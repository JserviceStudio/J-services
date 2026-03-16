import { badRequest } from '../../../utils/appError.js';
import { ProductCatalogRepository } from '../../catalog-management/repositories/productCatalogRepository.js';
import { ProductSubscriptionRepository } from '../repositories/productSubscriptionRepository.js';

const SUBSCRIPTION_STATUSES = new Set(['PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED']);
const SUBSCRIPTION_SOURCES = new Set(['ADMIN', 'RESELLER', 'SYSTEM', 'PROMO']);
const PERMISSION_STATUSES = new Set(['ACTIVE', 'DISABLED', 'EXPIRED']);
const COMMISSION_TYPES = new Set(['PERCENT', 'FIXED']);

const normalizeUpper = (value) => String(value || '').trim().toUpperCase();

export const ProductSubscriptionService = {
    async listClientSubscriptions(clientId) {
        return ProductSubscriptionRepository.listClientSubscriptions(clientId);
    },

    async activateProductForClient(clientId, productCode, {
        productPlanCode = null,
        status = 'ACTIVE',
        startsAt = new Date().toISOString(),
        endsAt = null,
        activatedBy = 'admin',
        source = 'ADMIN',
        licenseId = null,
        metadata = {}
    } = {}) {
        if (!clientId) {
            throw badRequest('Client requis.', 'CLIENT_ID_REQUIRED');
        }

        const product = await ProductCatalogRepository.findProductByCode(productCode);
        if (!product) {
            throw badRequest('Produit introuvable.', 'PRODUCT_NOT_FOUND');
        }

        const plans = await ProductCatalogRepository.listProductPlans(product.id);
        const selectedPlan = productPlanCode
            ? plans.find((plan) => plan.code === productPlanCode)
            : plans.find((plan) => plan.is_default) || null;

        const normalizedStatus = normalizeUpper(status);
        const normalizedSource = normalizeUpper(source);

        if (!SUBSCRIPTION_STATUSES.has(normalizedStatus)) {
            throw badRequest('Statut subscription invalide.', 'SUBSCRIPTION_STATUS_INVALID');
        }

        if (!SUBSCRIPTION_SOURCES.has(normalizedSource)) {
            throw badRequest('Source subscription invalide.', 'SUBSCRIPTION_SOURCE_INVALID');
        }

        return ProductSubscriptionRepository.createClientSubscription({
            client_id: clientId,
            product_id: product.id,
            product_plan_id: selectedPlan?.id || null,
            status: normalizedStatus,
            starts_at: startsAt,
            ends_at: endsAt,
            activated_by: activatedBy,
            source: normalizedSource,
            license_id: licenseId,
            metadata
        });
    },

    async listResellerPermissions(resellerId) {
        return ProductSubscriptionRepository.listResellerPermissions(resellerId);
    },

    async grantResellerProductPermission(resellerId, productCode, {
        productPlanCode = null,
        status = 'ACTIVE',
        commissionType = 'PERCENT',
        commissionValue = 0,
        salePriceOverride = null,
        startsAt = null,
        endsAt = null,
        metadata = {}
    } = {}) {
        if (!resellerId) {
            throw badRequest('Reseller requis.', 'RESELLER_ID_REQUIRED');
        }

        const product = await ProductCatalogRepository.findProductByCode(productCode);
        if (!product) {
            throw badRequest('Produit introuvable.', 'PRODUCT_NOT_FOUND');
        }

        const plans = await ProductCatalogRepository.listProductPlans(product.id);
        const selectedPlan = productPlanCode
            ? plans.find((plan) => plan.code === productPlanCode)
            : null;

        if (productPlanCode && !selectedPlan) {
            throw badRequest('Plan produit introuvable.', 'PRODUCT_PLAN_NOT_FOUND');
        }

        const normalizedStatus = normalizeUpper(status);
        const normalizedCommissionType = normalizeUpper(commissionType);

        if (!PERMISSION_STATUSES.has(normalizedStatus)) {
            throw badRequest('Statut permission invalide.', 'RESELLER_PERMISSION_STATUS_INVALID');
        }

        if (!COMMISSION_TYPES.has(normalizedCommissionType)) {
            throw badRequest('Type de commission invalide.', 'RESELLER_COMMISSION_TYPE_INVALID');
        }

        const existingPermission = await ProductSubscriptionRepository.findResellerPermission({
            resellerId,
            productId: product.id,
            productPlanId: selectedPlan?.id || null
        });

        const payload = {
            reseller_id: resellerId,
            product_id: product.id,
            product_plan_id: selectedPlan?.id || null,
            status: normalizedStatus,
            commission_type: normalizedCommissionType,
            commission_value: Number(commissionValue || 0),
            sale_price_override: salePriceOverride,
            starts_at: startsAt,
            ends_at: endsAt,
            metadata
        };

        if (existingPermission) {
            return ProductSubscriptionRepository.updateResellerPermission(existingPermission.id, payload);
        }

        return ProductSubscriptionRepository.createResellerPermission(payload);
    }
};
