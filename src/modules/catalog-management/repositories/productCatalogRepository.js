import { supabaseAdmin } from '../../../config/supabase.js';

export const ProductCatalogRepository = {
    async listProducts(limit = 50) {
        const { data, error } = await supabaseAdmin
            .from('product_catalog_summary')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('code', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async findProductByCode(code) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('code', code)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async createProduct(product) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .insert([product])
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async updateProduct(productId, payload) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .update(payload)
            .eq('id', productId)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async listProductPlans(productId) {
        const { data, error } = await supabaseAdmin
            .from('product_plans')
            .select('*')
            .eq('product_id', productId)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async createProductPlan(plan) {
        const { data, error } = await supabaseAdmin
            .from('product_plans')
            .insert([plan])
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async listProductApps(productId) {
        const { data, error } = await supabaseAdmin
            .from('product_apps')
            .select('id, product_id, app_id, entrypoint, is_primary, metadata, created_at')
            .eq('product_id', productId)
            .order('is_primary', { ascending: false });

        if (error) throw error;
        return data || [];
    }
};
