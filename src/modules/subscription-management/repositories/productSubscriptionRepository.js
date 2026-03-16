import { supabaseAdmin } from '../../../config/supabase.js';

export const ProductSubscriptionRepository = {
    async listClientSubscriptions(clientId) {
        const { data, error } = await supabaseAdmin
            .from('client_product_access')
            .select('*')
            .eq('client_id', clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async createClientSubscription(payload) {
        const { data, error } = await supabaseAdmin
            .from('client_product_subscriptions')
            .insert([payload])
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async listResellerPermissions(resellerId) {
        const { data, error } = await supabaseAdmin
            .from('reseller_product_catalog')
            .select('*')
            .eq('reseller_id', resellerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async findResellerPermission({ resellerId, productId, productPlanId = null }) {
        const { data, error } = await supabaseAdmin
            .from('reseller_product_permissions')
            .select('*')
            .eq('reseller_id', resellerId)
            .eq('product_id', productId)
            .is('product_plan_id', productPlanId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async createResellerPermission(payload) {
        const { data, error } = await supabaseAdmin
            .from('reseller_product_permissions')
            .insert([payload])
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async updateResellerPermission(permissionId, payload) {
        const { data, error } = await supabaseAdmin
            .from('reseller_product_permissions')
            .update(payload)
            .eq('id', permissionId)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }
};
