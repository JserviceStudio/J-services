-- J+SERVICE SUPABASE MASTER SCHEMA
-- PLATFORM VERSION 9.2
--
-- Canonical product roles:
--   admin
--   client
--   reseller
--
-- Current storage remains compatible with legacy manager_* naming.
-- New application code should prefer client/reseller vocabulary and use
-- the canonical SQL views/functions defined near the end of this file.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Managers / tenants
create table if not exists managers (
    id text primary key,
    email text unique not null,
    display_name text,
    status text default 'ACTIVE',
    api_key text unique not null,
    license_key text,
    license_type text default 'FREE',
    license_expiry_date timestamptz,
    notified_almost_expired boolean default false,
    notified_critical_expired boolean default false,
    fedapay_p_key text,
    fedapay_s_key text,
    notification_flags jsonb default '{}',
    logo_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table managers enable row level security;
create index if not exists idx_managers_email on managers(email);

-- Product/app catalog
create table if not exists apps (
    id text primary key,
    code text unique not null,
    name text not null,
    category text default 'CORE',
    status text default 'ACTIVE',
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table apps enable row level security;

insert into apps (id, code, name, category)
values
    ('wifi-core', 'wifi', 'WiFi Ticketing', 'CORE'),
    ('license-saas', 'license', 'License SaaS', 'SAAS'),
    ('marketing-core', 'marketing', 'Marketing Platform', 'GROWTH')
on conflict (id) do nothing;

-- Which apps are enabled for each manager
create table if not exists manager_apps (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete cascade,
    status text default 'ACTIVE',
    config jsonb default '{}',
    activated_at timestamptz default now(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(manager_id, app_id)
);
alter table manager_apps enable row level security;
create index if not exists idx_manager_apps_manager_id on manager_apps(manager_id);

-- External identities for hybrid auth
create table if not exists auth_identities (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    provider text not null,
    provider_user_id text not null,
    email text,
    is_primary boolean default false,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(provider, provider_user_id)
);
alter table auth_identities enable row level security;
create index if not exists idx_auth_identities_manager_id on auth_identities(manager_id);

-- Sites / physical or logical app instances
create table if not exists sites (
    id text primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    name text not null,
    ip_address text,
    api_user text,
    api_password text,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table sites enable row level security;
create index if not exists idx_sites_manager_id on sites(manager_id);

-- Vouchers
create table if not exists vouchers (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    site_id text references sites(id) on delete set null,
    app_id text references apps(id) on delete set null,
    profile text not null,
    price decimal(10,2) not null,
    code text not null,
    used boolean default false,
    sale_id text,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(code, manager_id)
);
alter table vouchers enable row level security;
create index if not exists idx_vouchers_manager_id on vouchers(manager_id);
create index if not exists idx_vouchers_sale_id on vouchers(sale_id);
create index if not exists idx_vouchers_manager_price_available on vouchers(manager_id, price) where (used = false);

-- Transactions
create table if not exists transactions (
    id text primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    amount decimal(10,2) not null,
    status text not null,
    type text,
    source_system text default 'BACKEND',
    voucher_id uuid references vouchers(id) on delete set null,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table transactions enable row level security;
create index if not exists idx_transactions_manager_id on transactions(manager_id);
create index if not exists idx_transactions_app_id on transactions(app_id);
create index if not exists idx_transactions_status_created_at on transactions(status, created_at desc);
create index if not exists idx_transactions_type_status_created_at on transactions(type, status, created_at desc);

-- Materialized sale facts
create table if not exists sales (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    amount decimal(10,2) not null,
    voucher_id uuid references vouchers(id) on delete set null,
    created_at timestamptz default now()
);
alter table sales enable row level security;
create index if not exists idx_sales_manager_id on sales(manager_id);
create index if not exists idx_sales_voucher_id on sales(voucher_id);

-- Audit Logs
create table if not exists audit_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id text,
    action text not null,
    entity_type text,
    entity_id text,
    details jsonb,
    ip_address text,
    created_at timestamptz default now()
);
alter table audit_logs enable row level security;
create index if not exists idx_audit_logs_user_id on audit_logs(user_id);

-- Notifications
create table if not exists notifications (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    title text not null,
    message text not null,
    type text,
    metadata jsonb default '{}',
    is_read boolean default false,
    created_at timestamptz default now()
);
alter table notifications enable row level security;
create index if not exists idx_notifications_manager_id on notifications(manager_id);

-- System Settings
create table if not exists system_settings (
    setting_key text primary key,
    setting_value text not null,
    updated_at timestamptz default now()
);
alter table system_settings enable row level security;

-- Resellers / partners
create table if not exists resellers (
    id text primary key,
    name text not null,
    email text unique not null,
    password text not null,
    phone text not null,
    promo_code text unique not null,
    commission_rate decimal(5,2) default 10.00,
    balance decimal(12,2) default 0.00,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table resellers enable row level security;

create table if not exists commission_logs (
    id uuid default uuid_generate_v4() primary key,
    reseller_id text references resellers(id) on delete cascade,
    transaction_id text references transactions(id) on delete set null,
    amount decimal(10,2) not null,
    created_at timestamptz default now()
);
alter table commission_logs enable row level security;
create index if not exists idx_commission_logs_reseller_id on commission_logs(reseller_id);
create index if not exists idx_commission_logs_transaction_id on commission_logs(transaction_id);

create table if not exists payout_requests (
    id text primary key,
    reseller_id text references resellers(id) on delete cascade,
    amount decimal(10,2) not null,
    phone_number text not null,
    operator text not null,
    status text default 'PENDING',
    error_message text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table payout_requests enable row level security;
create index if not exists idx_payout_requests_reseller_id on payout_requests(reseller_id);
create index if not exists idx_payout_requests_reseller_status_created_at on payout_requests(reseller_id, status, created_at desc);

-- Admin batches
create table if not exists license_batches (
    id text primary key,
    batch_name text,
    license_type text,
    quantity integer,
    generated_by text,
    created_at timestamptz default now()
);
alter table license_batches enable row level security;

-- Legacy report submissions
create table if not exists sales_reports (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text not null,
    report_date date not null,
    total_sales decimal(12,2) not null,
    total_transactions integer default 0,
    raw_data jsonb,
    created_at timestamptz default now()
);
alter table sales_reports enable row level security;
create index if not exists idx_sales_reports_manager_id on sales_reports(manager_id);

-- Licenses / subscriptions
create table if not exists licenses (
    id text primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    plan_code text not null,
    status text default 'ACTIVE',
    license_key text unique not null,
    starts_at timestamptz default now(),
    expires_at timestamptz,
    source_tx_id text references transactions(id) on delete set null,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table licenses enable row level security;
create index if not exists idx_licenses_manager_id on licenses(manager_id);
create index if not exists idx_licenses_source_tx_id on licenses(source_tx_id);

create table if not exists license_entitlements (
    id uuid default uuid_generate_v4() primary key,
    license_id text references licenses(id) on delete cascade,
    feature_code text not null,
    value_json jsonb default '{}',
    created_at timestamptz default now(),
    unique(license_id, feature_code)
);
alter table license_entitlements enable row level security;

-- Operational event stream
create table if not exists operational_events (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    event_type text not null,
    event_payload jsonb default '{}',
    source_system text default 'BACKEND',
    created_at timestamptz default now()
);
alter table operational_events enable row level security;
create index if not exists idx_operational_events_manager_id on operational_events(manager_id);
create index if not exists idx_operational_events_app_id on operational_events(app_id);

-- Async work tracking
create table if not exists sync_jobs (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    job_type text not null,
    status text default 'PENDING',
    attempt_count integer default 0,
    last_error text,
    payload jsonb default '{}',
    scheduled_for timestamptz default now(),
    processed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
alter table sync_jobs enable row level security;
create index if not exists idx_sync_jobs_status_scheduled on sync_jobs(status, scheduled_for);

-- Fast dashboard facts
create table if not exists analytics_daily_facts (
    id uuid default uuid_generate_v4() primary key,
    manager_id text references managers(id) on delete cascade,
    app_id text references apps(id) on delete set null,
    day date not null,
    sales_count integer default 0,
    revenue_total decimal(12,2) default 0,
    license_sales_count integer default 0,
    license_revenue_total decimal(12,2) default 0,
    low_stock_events integer default 0,
    metadata jsonb default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(manager_id, app_id, day)
);
alter table analytics_daily_facts enable row level security;
create index if not exists idx_analytics_daily_facts_manager_day on analytics_daily_facts(manager_id, day desc);

-- Platform commercial catalog
create table if not exists products (
    id uuid default uuid_generate_v4() primary key,
    code text not null unique,
    name text not null,
    product_type text not null check (product_type in ('WEB_APP', 'MOBILE_APP', 'SERVICE', 'PLATFORM_MODULE')),
    status text not null default 'DRAFT' check (status in ('DRAFT', 'ACTIVE', 'ARCHIVED')),
    tagline text,
    description text,
    icon text,
    brand_color text,
    default_route text,
    sort_order integer not null default 0,
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table products enable row level security;
create index if not exists idx_products_status_sort_order on products(status, sort_order, created_at desc);
create index if not exists idx_products_product_type on products(product_type);

create table if not exists product_plans (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid not null references products(id) on delete cascade,
    code text not null,
    name text not null,
    description text,
    billing_mode text not null check (billing_mode in ('ONE_TIME', 'MONTHLY', 'YEARLY', 'CUSTOM')),
    duration_days integer,
    price_amount numeric(12,2) not null default 0 check (price_amount >= 0),
    currency text not null default 'XOF',
    status text not null default 'DRAFT' check (status in ('DRAFT', 'ACTIVE', 'DISABLED')),
    is_default boolean not null default false,
    features_json jsonb not null default '{}',
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(product_id, code)
);
alter table product_plans enable row level security;
create index if not exists idx_product_plans_product_id on product_plans(product_id);
create index if not exists idx_product_plans_status on product_plans(status);
create unique index if not exists idx_product_plans_one_default_per_product on product_plans(product_id) where is_default = true;

create table if not exists product_apps (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid not null references products(id) on delete cascade,
    app_id text not null references apps(id) on delete cascade,
    entrypoint text,
    is_primary boolean not null default false,
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now(),
    unique(product_id, app_id)
);
alter table product_apps enable row level security;
create index if not exists idx_product_apps_product_id on product_apps(product_id);
create index if not exists idx_product_apps_app_id on product_apps(app_id);
create unique index if not exists idx_product_apps_one_primary_per_product on product_apps(product_id) where is_primary = true;

create table if not exists client_product_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    client_id text not null references managers(id) on delete cascade,
    product_id uuid not null references products(id) on delete cascade,
    product_plan_id uuid references product_plans(id) on delete set null,
    status text not null default 'PENDING' check (status in ('PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED')),
    starts_at timestamptz not null default now(),
    ends_at timestamptz,
    activated_by text,
    source text not null default 'ADMIN' check (source in ('ADMIN', 'RESELLER', 'SYSTEM', 'PROMO')),
    license_id text references licenses(id) on delete set null,
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table client_product_subscriptions enable row level security;
create index if not exists idx_client_product_subscriptions_client_id on client_product_subscriptions(client_id);
create index if not exists idx_client_product_subscriptions_product_id on client_product_subscriptions(product_id);
create index if not exists idx_client_product_subscriptions_plan_id on client_product_subscriptions(product_plan_id);
create index if not exists idx_client_product_subscriptions_status on client_product_subscriptions(status);
create unique index if not exists idx_client_product_subscriptions_one_active_per_product
    on client_product_subscriptions(client_id, product_id) where status = 'ACTIVE';

create table if not exists reseller_product_permissions (
    id uuid default uuid_generate_v4() primary key,
    reseller_id text not null references resellers(id) on delete cascade,
    product_id uuid not null references products(id) on delete cascade,
    product_plan_id uuid references product_plans(id) on delete cascade,
    status text not null default 'ACTIVE' check (status in ('ACTIVE', 'DISABLED', 'EXPIRED')),
    commission_type text not null default 'PERCENT' check (commission_type in ('PERCENT', 'FIXED')),
    commission_value numeric(12,2) not null default 0 check (commission_value >= 0),
    sale_price_override numeric(12,2),
    starts_at timestamptz,
    ends_at timestamptz,
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
alter table reseller_product_permissions enable row level security;
create index if not exists idx_reseller_product_permissions_reseller_id on reseller_product_permissions(reseller_id);
create index if not exists idx_reseller_product_permissions_product_id on reseller_product_permissions(product_id);
create index if not exists idx_reseller_product_permissions_plan_id on reseller_product_permissions(product_plan_id);
create index if not exists idx_reseller_product_permissions_status on reseller_product_permissions(status);
create unique index if not exists idx_reseller_product_permissions_unique_scope
    on reseller_product_permissions(
        reseller_id,
        product_id,
        coalesce(product_plan_id, '00000000-0000-0000-0000-000000000000'::uuid)
    );

-- 3. FUNCTIONS & RPCs

do $$
declare
    func_record record;
begin
    for func_record in (
        select oid::regprocedure as fn_name
        from pg_proc
        where proname in (
            'touch_updated_at',
            'get_next_voucher',
            'request_payout',
            'refund_reseller_balance',
            'get_admin_tx_stats',
            'get_revenue_history_7d',
            'get_license_type_stats',
            'get_low_stock_managers',
            'get_total_commissions_30d',
            'notify_low_stock',
            'log_sale_from_transaction'
        )
          and pronamespace = 'public'::regnamespace
    ) loop
        execute 'drop function ' || func_record.fn_name || ' cascade';
    end loop;
end $$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.get_next_voucher(m_id text, p_val numeric)
returns setof public.vouchers
language plpgsql
security definer
set search_path = ''
as $$
begin
    return query
    update public.vouchers
    set used = true
    where id = (
        select id from public.vouchers
        where manager_id = m_id
          and price = p_val
          and used = false
        order by created_at asc
        limit 1
        for update skip locked
    )
    returning *;
end;
$$;

create or replace function public.request_payout(p_id text, p_reseller_id text, p_amount numeric, p_phone text, p_operator text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    update public.resellers
    set balance = balance - p_amount
    where id = p_reseller_id and balance >= p_amount;

    if not found then
        raise exception 'Insufficient balance';
    end if;

    insert into public.payout_requests (id, reseller_id, amount, phone_number, operator, status)
    values (p_id, p_reseller_id, p_amount, p_phone, p_operator, 'PENDING');
end;
$$;

create or replace function public.refund_reseller_balance(reseller_id text, amount_to_add numeric)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    update public.resellers
    set balance = balance + amount_to_add
    where id = reseller_id;
end;
$$;

create or replace function public.get_admin_tx_stats()
returns table(total_tx bigint, total_volume numeric, active_managers bigint)
language sql
security definer
set search_path = ''
as $$
    select
        count(*)::bigint as total_tx,
        coalesce(sum(amount), 0)::numeric as total_volume,
        count(distinct manager_id)::bigint as active_managers
    from public.transactions
    where status = 'SUCCESS';
$$;

create or replace function public.get_revenue_history_7d()
returns table(date date, total numeric)
language sql
security definer
set search_path = ''
as $$
    select
        gs.day::date as date,
        coalesce(sum(t.amount), 0)::numeric as total
    from generate_series(current_date - interval '6 day', current_date, interval '1 day') as gs(day)
    left join public.transactions t
        on date(t.created_at) = gs.day::date
       and t.status = 'SUCCESS'
    group by gs.day
    order by gs.day asc;
$$;

create or replace function public.get_license_type_stats()
returns table(plan_code text, total bigint)
language sql
security definer
set search_path = ''
as $$
    select
        coalesce(plan_code, 'UNKNOWN') as plan_code,
        count(*)::bigint as total
    from public.licenses
    group by coalesce(plan_code, 'UNKNOWN')
    order by total desc;
$$;

create or replace function public.get_low_stock_managers()
returns table(manager_id text, email text, profile text, stock bigint)
language sql
security definer
set search_path = ''
as $$
    select
        v.manager_id,
        m.email,
        v.profile,
        count(*)::bigint as stock
    from public.vouchers v
    join public.managers m on m.id = v.manager_id
    where v.used = false
    group by v.manager_id, m.email, v.profile
    having count(*) < 10
    order by stock asc, m.email asc;
$$;

create or replace function public.get_low_stock_clients()
returns table(client_id text, email text, profile text, stock bigint)
language sql
security definer
set search_path = ''
as $$
    select
        v.manager_id as client_id,
        m.email,
        v.profile,
        count(*)::bigint as stock
    from public.vouchers v
    join public.managers m on m.id = v.manager_id
    where v.used = false
    group by v.manager_id, m.email, v.profile
    having count(*) < 10
    order by stock asc, m.email asc;
$$;

create or replace function public.get_total_commissions_30d()
returns table(total numeric)
language sql
security definer
set search_path = ''
as $$
    select coalesce(sum(amount), 0)::numeric as total
    from public.commission_logs
    where created_at >= now() - interval '30 day';
$$;

-- 4. RLS POLICIES

do $$
declare
    pol record;
begin
    for pol in (select policyname, tablename from pg_policies where schemaname = 'public') loop
        execute format('drop policy %I on public.%I', pol.policyname, pol.tablename);
    end loop;
end $$;

create policy "Managers Policy" on managers for select using ((select auth.uid())::text = id);
create policy "Apps Policy" on apps for select using (true);
create policy "Manager Apps Policy" on manager_apps for all using ((select auth.uid())::text = manager_id);
create policy "Auth Identities Policy" on auth_identities for select using ((select auth.uid())::text = manager_id);
create policy "Sites Policy" on sites for all using ((select auth.uid())::text = manager_id);
create policy "Vouchers Policy" on vouchers for all using ((select auth.uid())::text = manager_id);
create policy "Transactions Policy" on transactions for select using ((select auth.uid())::text = manager_id);
create policy "Sales Policy" on sales for select using ((select auth.uid())::text = manager_id);
create policy "Notifications Policy" on notifications for all using ((select auth.uid())::text = manager_id);
create policy "Settings Policy" on system_settings for select using (true);
create policy "Resellers Policy" on resellers for select using ((select auth.uid())::text = id);
create policy "Commissions Policy" on commission_logs for select using ((select auth.uid())::text = reseller_id);
create policy "Payouts Policy" on payout_requests for select using ((select auth.uid())::text = reseller_id);
create policy "Batches Policy" on license_batches for select using (true);
create policy "Reports Policy" on sales_reports for all using ((select auth.uid())::text = manager_id);
create policy "Licenses Policy" on licenses for all using ((select auth.uid())::text = manager_id);
create policy "Operational Events Policy" on operational_events for all using ((select auth.uid())::text = manager_id);
create policy "Sync Jobs Policy" on sync_jobs for all using ((select auth.uid())::text = manager_id);
create policy "Analytics Facts Policy" on analytics_daily_facts for select using ((select auth.uid())::text = manager_id);
create policy "Products Policy" on products for select using (true);
create policy "Product Plans Policy" on product_plans for select using (true);
create policy "Product Apps Policy" on product_apps for select using (true);
create policy "Client Product Subscriptions Policy" on client_product_subscriptions for select using ((select auth.uid())::text = client_id);
create policy "Reseller Product Permissions Policy" on reseller_product_permissions for select using ((select auth.uid())::text = reseller_id);

-- 5. REALTIME

do $$
begin
    if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        create publication supabase_realtime;
    end if;
end $$;

do $$
begin
    begin
        alter publication supabase_realtime add table public.notifications;
    exception when duplicate_object then null;
    end;
    begin
        alter publication supabase_realtime add table public.sales;
    exception when duplicate_object then null;
    end;
    begin
        alter publication supabase_realtime add table public.audit_logs;
    exception when duplicate_object then null;
    end;
    begin
        alter publication supabase_realtime add table public.operational_events;
    exception when duplicate_object then null;
    end;
end $$;

-- 6. STORAGE

insert into storage.buckets (id, name, public)
values ('manager-assets', 'manager-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('reports-pdf', 'reports-pdf', false)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using (bucket_id = 'manager-assets');

drop policy if exists "Manager Upload" on storage.objects;
create policy "Manager Upload" on storage.objects
for insert
with check (bucket_id = 'manager-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- 7. TRIGGERS

drop trigger if exists tr_managers_touch_updated_at on managers;
create trigger tr_managers_touch_updated_at before update on managers for each row execute function public.touch_updated_at();

drop trigger if exists tr_apps_touch_updated_at on apps;
create trigger tr_apps_touch_updated_at before update on apps for each row execute function public.touch_updated_at();

drop trigger if exists tr_manager_apps_touch_updated_at on manager_apps;
create trigger tr_manager_apps_touch_updated_at before update on manager_apps for each row execute function public.touch_updated_at();

drop trigger if exists tr_auth_identities_touch_updated_at on auth_identities;
create trigger tr_auth_identities_touch_updated_at before update on auth_identities for each row execute function public.touch_updated_at();

drop trigger if exists tr_sites_touch_updated_at on sites;
create trigger tr_sites_touch_updated_at before update on sites for each row execute function public.touch_updated_at();

drop trigger if exists tr_vouchers_touch_updated_at on vouchers;
create trigger tr_vouchers_touch_updated_at before update on vouchers for each row execute function public.touch_updated_at();

drop trigger if exists tr_transactions_touch_updated_at on transactions;
create trigger tr_transactions_touch_updated_at before update on transactions for each row execute function public.touch_updated_at();

drop trigger if exists tr_resellers_touch_updated_at on resellers;
create trigger tr_resellers_touch_updated_at before update on resellers for each row execute function public.touch_updated_at();

drop trigger if exists tr_payout_requests_touch_updated_at on payout_requests;
create trigger tr_payout_requests_touch_updated_at before update on payout_requests for each row execute function public.touch_updated_at();

drop trigger if exists tr_licenses_touch_updated_at on licenses;
create trigger tr_licenses_touch_updated_at before update on licenses for each row execute function public.touch_updated_at();

drop trigger if exists tr_sync_jobs_touch_updated_at on sync_jobs;
create trigger tr_sync_jobs_touch_updated_at before update on sync_jobs for each row execute function public.touch_updated_at();

drop trigger if exists tr_analytics_daily_facts_touch_updated_at on analytics_daily_facts;
create trigger tr_analytics_daily_facts_touch_updated_at before update on analytics_daily_facts for each row execute function public.touch_updated_at();

drop trigger if exists tr_products_touch_updated_at on products;
create trigger tr_products_touch_updated_at before update on products for each row execute function public.touch_updated_at();

drop trigger if exists tr_product_plans_touch_updated_at on product_plans;
create trigger tr_product_plans_touch_updated_at before update on product_plans for each row execute function public.touch_updated_at();

drop trigger if exists tr_client_product_subscriptions_touch_updated_at on client_product_subscriptions;
create trigger tr_client_product_subscriptions_touch_updated_at before update on client_product_subscriptions for each row execute function public.touch_updated_at();

drop trigger if exists tr_reseller_product_permissions_touch_updated_at on reseller_product_permissions;
create trigger tr_reseller_product_permissions_touch_updated_at before update on reseller_product_permissions for each row execute function public.touch_updated_at();

create or replace function public.notify_low_stock()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    stock_count int;
begin
    select count(*) into stock_count
    from public.vouchers
    where manager_id = new.manager_id and profile = new.profile and used = false;

    if stock_count < 10 then
        insert into public.notifications (manager_id, title, message, type, metadata)
        values (
            new.manager_id,
            'Stock Faible',
            'Plus que ' || stock_count || ' tickets (' || new.profile || ').',
            'LOW_STOCK',
            jsonb_build_object('profile', new.profile, 'stock', stock_count)
        );
    end if;
    return new;
end;
$$;

drop trigger if exists tr_check_low_stock on vouchers;
create trigger tr_check_low_stock
    after update of used on vouchers
    for each row
    when (old.used = false and new.used = true)
    execute function public.notify_low_stock();

create or replace function public.log_sale_from_transaction()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.status = 'SUCCESS' and new.voucher_id is not null and (old.status is distinct from 'SUCCESS') then
        insert into public.sales (manager_id, app_id, amount, voucher_id)
        values (new.manager_id, new.app_id, new.amount, new.voucher_id);
    end if;
    return new;
end;
$$;

drop trigger if exists tr_transactions_log_sale on transactions;
create trigger tr_transactions_log_sale
    after update on transactions
    for each row
    execute function public.log_sale_from_transaction();

-- 8. ANALYTIC VIEWS

drop view if exists client_accounts;
create view client_accounts
with (security_invoker = true)
as
select
    id as client_id,
    email,
    display_name,
    status,
    api_key,
    license_key,
    license_type,
    license_expiry_date,
    notified_almost_expired,
    notified_critical_expired,
    fedapay_p_key,
    fedapay_s_key,
    notification_flags,
    logo_url,
    created_at,
    updated_at
from public.managers;

drop view if exists client_app_access;
create view client_app_access
with (security_invoker = true)
as
select
    id,
    manager_id as client_id,
    app_id,
    status,
    config,
    activated_at,
    created_at,
    updated_at
from public.manager_apps;

drop view if exists product_catalog_summary;
create view product_catalog_summary
with (security_invoker = true)
as
select
    p.id,
    p.code,
    p.name,
    p.product_type,
    p.status,
    p.default_route,
    p.sort_order,
    count(distinct pp.id) as plans_count,
    count(distinct pa.app_id) as apps_count,
    count(distinct cps.client_id) filter (where cps.status = 'ACTIVE') as active_clients_count,
    count(distinct rpp.reseller_id) filter (where rpp.status = 'ACTIVE') as active_resellers_count
from public.products p
left join public.product_plans pp on pp.product_id = p.id
left join public.product_apps pa on pa.product_id = p.id
left join public.client_product_subscriptions cps on cps.product_id = p.id
left join public.reseller_product_permissions rpp on rpp.product_id = p.id
group by p.id, p.code, p.name, p.product_type, p.status, p.default_route, p.sort_order;

drop view if exists client_product_access;
create view client_product_access
with (security_invoker = true)
as
select
    cps.id,
    cps.client_id,
    cps.product_id,
    p.code as product_code,
    p.name as product_name,
    p.product_type,
    p.default_route,
    cps.product_plan_id,
    pp.code as product_plan_code,
    pp.name as product_plan_name,
    cps.status,
    cps.starts_at,
    cps.ends_at,
    cps.license_id,
    cps.source,
    cps.metadata,
    cps.created_at,
    cps.updated_at
from public.client_product_subscriptions cps
join public.products p on p.id = cps.product_id
left join public.product_plans pp on pp.id = cps.product_plan_id;

drop view if exists reseller_product_catalog;
create view reseller_product_catalog
with (security_invoker = true)
as
select
    rpp.id,
    rpp.reseller_id,
    rpp.product_id,
    p.code as product_code,
    p.name as product_name,
    p.product_type,
    rpp.product_plan_id,
    pp.code as product_plan_code,
    pp.name as product_plan_name,
    rpp.status,
    rpp.commission_type,
    rpp.commission_value,
    rpp.sale_price_override,
    rpp.starts_at,
    rpp.ends_at,
    rpp.metadata,
    rpp.created_at,
    rpp.updated_at
from public.reseller_product_permissions rpp
join public.products p on p.id = rpp.product_id
left join public.product_plans pp on pp.id = rpp.product_plan_id;

drop view if exists client_auth_identities;
create view client_auth_identities
with (security_invoker = true)
as
select
    id,
    manager_id as client_id,
    provider,
    provider_user_id,
    email,
    is_primary,
    metadata,
    created_at,
    updated_at
from public.auth_identities;

drop view if exists client_licenses;
create view client_licenses
with (security_invoker = true)
as
select
    id,
    manager_id as client_id,
    app_id,
    plan_code,
    status,
    license_key,
    starts_at,
    expires_at,
    source_tx_id,
    metadata,
    created_at,
    updated_at
from public.licenses;

drop view if exists manager_sales_summary;
create view manager_sales_summary
with (security_invoker = true)
as
select
    manager_id,
    app_id,
    date(created_at) as sale_date,
    count(*) as tickets_sold,
    sum(amount) as total_revenue
from public.sales
group by manager_id, app_id, date(created_at);

drop view if exists client_sales_summary;
create view client_sales_summary
with (security_invoker = true)
as
select
    manager_id as client_id,
    app_id,
    date(created_at) as sale_date,
    count(*) as tickets_sold,
    sum(amount) as total_revenue
from public.sales
group by manager_id, app_id, date(created_at);

drop view if exists reseller_performance_summary;
create view reseller_performance_summary
with (security_invoker = true)
as
select
    r.id,
    r.name,
    r.promo_code,
    r.balance as current_balance,
    count(c.id) as total_commissions_count,
    coalesce(sum(c.amount), 0) as total_earned
from public.resellers r
left join public.commission_logs c on r.id = c.reseller_id
group by r.id, r.name, r.promo_code, r.balance;

insert into products (
    code,
    name,
    product_type,
    status,
    tagline,
    description,
    default_route,
    sort_order,
    metadata
)
values (
    'tiketmomo',
    'TiketMomo',
    'WEB_APP',
    'ACTIVE',
    'Gestion vouchers, ventes et operations Wi-Fi',
    'Premier produit de l ecosysteme J+SERVICES pour la gestion de vouchers, ventes et operations associees.',
    '/client',
    10,
    jsonb_build_object('workspace_role', 'client', 'studio_origin', 'J+SERVICES')
)
on conflict (code) do update
set
    name = excluded.name,
    product_type = excluded.product_type,
    status = excluded.status,
    tagline = excluded.tagline,
    description = excluded.description,
    default_route = excluded.default_route,
    sort_order = excluded.sort_order,
    metadata = excluded.metadata;

insert into product_apps (
    product_id,
    app_id,
    entrypoint,
    is_primary,
    metadata
)
select
    p.id,
    'wifi-core',
    '/client',
    true,
    jsonb_build_object('workspace', 'client', 'product_code', p.code)
from products p
where p.code = 'tiketmomo'
on conflict (product_id, app_id) do update
set
    entrypoint = excluded.entrypoint,
    is_primary = excluded.is_primary,
    metadata = excluded.metadata;

insert into product_plans (
    product_id,
    code,
    name,
    description,
    billing_mode,
    duration_days,
    price_amount,
    currency,
    status,
    is_default,
    features_json,
    metadata
)
select
    p.id,
    'standard',
    'Standard',
    'Plan standard TiketMomo',
    'MONTHLY',
    30,
    0,
    'XOF',
    'ACTIVE',
    true,
    jsonb_build_object('dashboard', true, 'voucher_operations', true),
    jsonb_build_object('seeded_by', 'platform_core')
from products p
where p.code = 'tiketmomo'
on conflict (product_id, code) do update
set
    name = excluded.name,
    description = excluded.description,
    billing_mode = excluded.billing_mode,
    duration_days = excluded.duration_days,
    price_amount = excluded.price_amount,
    currency = excluded.currency,
    status = excluded.status,
    is_default = excluded.is_default,
    features_json = excluded.features_json,
    metadata = excluded.metadata;
