import { badRequest } from '../../../utils/appError.js';
import { ProductCatalogRepository } from '../repositories/productCatalogRepository.js';

const PRODUCT_TYPES = new Set(['WEB_APP', 'MOBILE_APP', 'SERVICE', 'PLATFORM_MODULE']);
const PRODUCT_STATUSES = new Set(['DRAFT', 'ACTIVE', 'ARCHIVED']);
const BILLING_MODES = new Set(['ONE_TIME', 'MONTHLY', 'YEARLY', 'CUSTOM']);
const PLAN_STATUSES = new Set(['DRAFT', 'ACTIVE', 'DISABLED']);

const normalizeCode = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeUpper = (value) => String(value || '').trim().toUpperCase();

export const ProductCatalogService = {
    async listCatalog() {
        return ProductCatalogRepository.listProducts();
    },

    async createProduct({
        code,
        name,
        productType,
        status = 'DRAFT',
        tagline = null,
        description = null,
        icon = null,
        brandColor = null,
        defaultRoute = null,
        sortOrder = 0,
        metadata = {}
    }) {
        const normalizedCode = normalizeCode(code);
        const normalizedType = normalizeUpper(productType);
        const normalizedStatus = normalizeUpper(status);

        if (!normalizedCode) {
            throw badRequest('Code produit requis.', 'PRODUCT_CODE_REQUIRED');
        }

        if (!name) {
            throw badRequest('Nom produit requis.', 'PRODUCT_NAME_REQUIRED');
        }

        if (!PRODUCT_TYPES.has(normalizedType)) {
            throw badRequest('Type produit invalide.', 'PRODUCT_TYPE_INVALID');
        }

        if (!PRODUCT_STATUSES.has(normalizedStatus)) {
            throw badRequest('Statut produit invalide.', 'PRODUCT_STATUS_INVALID');
        }

        const existing = await ProductCatalogRepository.findProductByCode(normalizedCode);
        if (existing) {
            throw badRequest('Ce code produit existe deja.', 'PRODUCT_CODE_TAKEN');
        }

        return ProductCatalogRepository.createProduct({
            code: normalizedCode,
            name,
            product_type: normalizedType,
            status: normalizedStatus,
            tagline,
            description,
            icon,
            brand_color: brandColor,
            default_route: defaultRoute,
            sort_order: Number(sortOrder || 0),
            metadata
        });
    },

    async createPlan(productCode, {
        code,
        name,
        description = null,
        billingMode,
        durationDays = null,
        priceAmount = 0,
        currency = 'XOF',
        status = 'DRAFT',
        isDefault = false,
        features = {},
        metadata = {}
    }) {
        const product = await ProductCatalogRepository.findProductByCode(productCode);
        if (!product) {
            throw badRequest('Produit introuvable.', 'PRODUCT_NOT_FOUND');
        }

        const normalizedCode = normalizeCode(code);
        const normalizedBillingMode = normalizeUpper(billingMode);
        const normalizedStatus = normalizeUpper(status);

        if (!normalizedCode) {
            throw badRequest('Code plan requis.', 'PLAN_CODE_REQUIRED');
        }

        if (!name) {
            throw badRequest('Nom plan requis.', 'PLAN_NAME_REQUIRED');
        }

        if (!BILLING_MODES.has(normalizedBillingMode)) {
            throw badRequest('Mode de facturation invalide.', 'PLAN_BILLING_MODE_INVALID');
        }

        if (!PLAN_STATUSES.has(normalizedStatus)) {
            throw badRequest('Statut plan invalide.', 'PLAN_STATUS_INVALID');
        }

        return ProductCatalogRepository.createProductPlan({
            product_id: product.id,
            code: normalizedCode,
            name,
            description,
            billing_mode: normalizedBillingMode,
            duration_days: durationDays,
            price_amount: Number(priceAmount || 0),
            currency,
            status: normalizedStatus,
            is_default: Boolean(isDefault),
            features_json: features,
            metadata
        });
    }
};
