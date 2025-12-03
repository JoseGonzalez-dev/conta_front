import { UserRole, Permission } from '../types';

/**
 * Authentication and Authorization Constants
 */

// Session Configuration
export const SESSION_CONFIG = {
    TIMEOUT_MINUTES: 30, // Tiempo de inactividad antes de cerrar sesión
    WARNING_MINUTES: 2, // Minutos antes del timeout para mostrar warning
    REFRESH_INTERVAL_MINUTES: 5, // Intervalo para verificar sesión
} as const;

// Route Paths
export const AUTH_ROUTES = {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
} as const;

export const APP_ROUTES = {
    HOME: '/',
    NOMENCLATURA: '/nomenclatura',
    ASIENTOS: '/asientos',
    LIBRO_MAYOR: '/libro-mayor',
    CIERRE_CONTABLE: '/cierre-contable',
    BALANCE_GENERAL: '/balance-general',
    UNAUTHORIZED: '/403',
    NOT_FOUND: '/404',
} as const;

// Error Messages
export const AUTH_ERRORS = {
    UNAUTHORIZED: 'No tienes autorización para acceder a este recurso',
    SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet',
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado',
    INSUFFICIENT_PERMISSIONS: 'No tienes los permisos necesarios para realizar esta acción',
    INVALID_ROLE: 'Tu rol no tiene acceso a esta funcionalidad',
} as const;

// Role-Based Permissions Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.ADMIN]: [
        // Admin tiene todos los permisos
        Permission.VIEW_ACCOUNTS,
        Permission.CREATE_ACCOUNTS,
        Permission.EDIT_ACCOUNTS,
        Permission.DELETE_ACCOUNTS,
        Permission.VIEW_ENTRIES,
        Permission.CREATE_ENTRIES,
        Permission.EDIT_ENTRIES,
        Permission.DELETE_ENTRIES,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_REPORTS,
        Permission.MANAGE_USERS,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_AUDIT_LOG,
    ],
    [UserRole.ACCOUNTANT]: [
        // Contador tiene permisos de lectura/escritura pero no de administración
        Permission.VIEW_ACCOUNTS,
        Permission.CREATE_ACCOUNTS,
        Permission.EDIT_ACCOUNTS,
        Permission.VIEW_ENTRIES,
        Permission.CREATE_ENTRIES,
        Permission.EDIT_ENTRIES,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_REPORTS,
    ],
    [UserRole.USER]: [
        // Usuario básico solo puede ver
        Permission.VIEW_ACCOUNTS,
        Permission.VIEW_ENTRIES,
        Permission.VIEW_REPORTS,
    ],
};

// Default redirect paths based on role
export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
    [UserRole.ADMIN]: APP_ROUTES.HOME,
    [UserRole.ACCOUNTANT]: APP_ROUTES.NOMENCLATURA,
    [UserRole.USER]: APP_ROUTES.HOME,
};

// Cookie names
export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'access_token',
    USER: 'user',
    LAST_ACTIVITY: 'last_activity',
} as const;

// Local Storage keys (for non-sensitive data)
export const STORAGE_KEYS = {
    THEME: 'app_theme',
    LANGUAGE: 'app_language',
    SIDEBAR_STATE: 'sidebar_state',
} as const;
