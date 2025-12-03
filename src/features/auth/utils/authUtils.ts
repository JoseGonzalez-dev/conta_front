import type { User, UserRole, Permission } from '../types';
import { ROLE_PERMISSIONS, ROLE_DEFAULT_ROUTES } from '../constants/auth.constants';

/**
 * Check if a user has a specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
    if (!user) return false;
    return user.role === role;
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    if (!user || !roles.length) return false;
    return roles.includes(user.role);
}

/**
 * Check if a user has all of the specified roles (usually just one role per user)
 */
export function hasAllRoles(user: User | null, roles: UserRole[]): boolean {
    if (!user || !roles.length) return false;
    // En un sistema de rol único, esto solo es true si el usuario tiene exactamente ese rol
    return roles.every(role => user.role === role);
}

/**
 * Check if a user has a specific permission based on their role
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role];

    if (!rolePermissions) {
        console.warn(`⚠️ No permissions defined for role: ${user.role}`);
        return false;
    }

    return rolePermissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
    if (!user || !permissions.length) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role];

    if (!rolePermissions) {
        console.warn(`⚠️ No permissions defined for role: ${user.role}`);
        return false;
    }

    return permissions.some(permission => rolePermissions.includes(permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
    if (!user || !permissions.length) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role];

    if (!rolePermissions) {
        console.warn(`⚠️ No permissions defined for role: ${user.role}`);
        return false;
    }

    return permissions.every(permission => rolePermissions.includes(permission));
}

/**
 * Get all permissions for a user based on their role
 */
export function getUserPermissions(user: User | null): Permission[] {
    if (!user) return [];
    const rolePermissions = ROLE_PERMISSIONS[user.role];

    if (!rolePermissions) {
        console.warn(`⚠️ No permissions defined for role: ${user.role}`);
        return [];
    }

    return rolePermissions;
}

/**
 * Check if a session has expired based on last activity timestamp
 */
export function isSessionExpired(lastActivityTime: number, timeoutMinutes: number): boolean {
    const now = Date.now();
    const timeoutMs = timeoutMinutes * 60 * 1000;
    return (now - lastActivityTime) > timeoutMs;
}

/**
 * Get the default redirect path for a user based on their role
 */
export function getDefaultRedirectPath(user: User | null): string {
    if (!user) return '/';
    return ROLE_DEFAULT_ROUTES[user.role] || '/';
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
    return hasRole(user, 'admin' as UserRole);
}

/**
 * Check if user is accountant or admin
 */
export function isAccountantOrAdmin(user: User | null): boolean {
    return hasAnyRole(user, ['admin' as UserRole, 'accountant' as UserRole]);
}

/**
 * Sanitize user data for logging (remove sensitive info)
 */
export function sanitizeUserForLogging(user: User | null): Partial<User> | null {
    if (!user) return null;
    return {
        id: user.id,
        username: user.username,
        role: user.role,
    };
}

/**
 * Log security event (only in development)
 */
export function logSecurityEvent(event: string, details?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
        console.log(`🔒 [Security] ${event}`, details || '');
    }
}

/**
 * Format time remaining until session expires
 */
export function formatTimeRemaining(minutes: number): string {
    if (minutes < 1) {
        return 'menos de 1 minuto';
    }
    if (minutes === 1) {
        return '1 minuto';
    }
    return `${Math.floor(minutes)} minutos`;
}
