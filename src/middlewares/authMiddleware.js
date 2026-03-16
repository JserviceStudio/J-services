import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { firebaseAuth } from '../config/firebase.js';

/**
 * 🛡️ RÈGLE 1 : Middleware d'Isolation "Multi-Tenant"
 * Supporte 3 méthodes : Clé API, Supabase JWT OU Firebase Auth (Mobile)
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const apiKeyHeader = req.headers['x-api-key'] || req.headers['x-license-key'];

        // 1. Authentification par Clé API (Si fournie par le mobile)
        if (apiKeyHeader) {
            const { data: manager, error } = await supabaseAdmin
                .from('managers')
                .select('id, email')
                .eq('api_key', apiKeyHeader)
                .single();

            if (error || !manager) throw new Error('API Key invalide.');

            req.user = { manager_id: manager.id, email: manager.email, method: 'api_key' };
            return next();
        }

        // 2. Authentification par Token (JWT Supabase ou Firebase)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED_MISSING_TOKEN',
                    message: 'Token d\'authentification ou Clé API manquante.'
                }
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Détection du type de token (Firebase tokens sont souvent plus longs et structurés différemment)
        // Mais ici on va tenter Firebase si firebaseAuth est dispo, sinon on rollback sur Supabase.
        let userId = null;
        let email = null;
        let method = null;

        if (firebaseAuth) {
            try {
                const decodedToken = await firebaseAuth.verifyIdToken(token);
                userId = decodedToken.uid;
                email = decodedToken.email;
                method = 'firebase';
            } catch (fbError) {
                // Pas un token Firebase valide, on tente Supabase
            }
        }

        if (!userId) {
            const { data: { user }, error: authError } = await supabase.auth.getUser(token);
            if (!authError && user) {
                userId = user.id;
                email = user.email;
                method = 'supabase';
            }
        }

        if (!userId) {
            throw new Error('Token invalide ou expiré.');
        }

        // Injection du Pivot de Sécurité Multi-Tenant
        // CRITICAL: manager_id DOIT correspondre à l'ID dans la table 'managers'
        req.user = {
            manager_id: userId,
            email: email,
            method: method
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED_INVALID_CREDENTIALS',
                message: error.message || 'Accès refusé. Token invalide ou expiré.'
            }
        });
    }
};

const safeCompare = (left, right) => {
    if (typeof left !== 'string' || typeof right !== 'string') return false;
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) return false;
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ ERREUR FATALE : JWT_SECRET est manquant dans le fichier .env. Arrêt du serveur.');
    process.exit(1);
}

/**
 * 🛡️ RÈGLE 2 : Middleware Partenaires (JWT Interne)
 */
export const requirePartnerAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.partner_token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

        if (!token) {
            return res.status(401).send('<script>window.location.href="/partners/auth";</script>');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).send('<script>window.location.href="/partners/auth";</script>');
    }
};

/**
 * 🔒 Middleware d'authentification Admin (Token serveur uniquement)
 */
export const requireAdminAuth = (req, res, next) => {
    const configuredToken = process.env.ADMIN_DASHBOARD_TOKEN;

    if (!configuredToken) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'ADMIN_AUTH_NOT_CONFIGURED',
                message: 'ADMIN_DASHBOARD_TOKEN est manquant côté serveur.'
            }
        });
    }

    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    const providedTokenHeader = req.headers['x-admin-token'];
    const providedToken = Array.isArray(providedTokenHeader)
        ? providedTokenHeader[0]
        : (providedTokenHeader || bearerToken);

    if (!safeCompare(providedToken, configuredToken)) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED_ADMIN',
                message: 'Accès admin refusé.'
            }
        });
    }

    return next();
};
};

/**
 * 🔒 Middleware d'authentification Admin (session username/password)
 */
export const requireAdminAuth = (req, res, next) => {
    const configuredUsername = process.env.ADMIN_DASHBOARD_USERNAME || 'admin';
    const configuredPassword = process.env.ADMIN_DASHBOARD_PASSWORD || process.env.ADMIN_DASHBOARD_TOKEN;

    if (!configuredUsername || !configuredPassword) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'ADMIN_AUTH_NOT_CONFIGURED',
                message: 'ADMIN_DASHBOARD_USERNAME ou ADMIN_DASHBOARD_PASSWORD est manquant côté serveur.'
            }
        });
    }

    const authHeader = req.headers.authorization;
    const bearerSession = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    const cookieSession = req.cookies?.[ADMIN_SESSION_COOKIE];
    const providedSession = cookieSession || bearerSession;

    if (!providedSession) {
        const acceptsHtml = req.headers.accept?.includes('text/html');
        if (acceptsHtml) {
            return res.status(401).send('<script>window.location.href="/admin/auth";</script>');
        }

        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED_ADMIN',
                message: 'Accès admin refusé.'
            }
        });
    }

    try {
        const decoded = jwt.verify(providedSession, JWT_SECRET);
        const sessionUsername = typeof decoded === 'object' ? decoded.sub : null;
        const sessionRole = typeof decoded === 'object' ? decoded.role : null;

        if (!safeCompare(sessionUsername, configuredUsername) || sessionRole !== 'admin') {
            throw new Error('INVALID_ADMIN_SESSION');
        }

        req.user = {
            ...(req.user || {}),
            email: configuredUsername,
            role: normalizeRole('admin', 'admin')
        };

        return next();
    } catch (error) {
        const acceptsHtml = req.headers.accept?.includes('text/html');
        if (acceptsHtml) {
            return res.status(401).send('<script>window.location.href="/admin/auth";</script>');
        }

        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED_ADMIN',
                message: 'Session admin invalide ou expirée.'
            }
        });
    }
};

export const requireAdminRole = requireRole('admin');
export const requireClientRole = requireRole('client', 'admin');
export const requireManagerRole = requireClientRole;
export const requireResellerRole = requireRole('reseller', 'admin');
