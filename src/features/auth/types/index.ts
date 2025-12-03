export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export const UserRole = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  USER: 'user'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const Permission = {
  // Nomenclatura permissions
  VIEW_ACCOUNTS: 'view_accounts',
  CREATE_ACCOUNTS: 'create_accounts',
  EDIT_ACCOUNTS: 'edit_accounts',
  DELETE_ACCOUNTS: 'delete_accounts',

  // Asientos permissions
  VIEW_ENTRIES: 'view_entries',
  CREATE_ENTRIES: 'create_entries',
  EDIT_ENTRIES: 'edit_entries',
  DELETE_ENTRIES: 'delete_entries',

  // Reports permissions
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',

  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_AUDIT_LOG: 'view_audit_log',
} as const;

export type Permission = typeof Permission[keyof typeof Permission];

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Protected Route Props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
}

// Auth Guard Props
export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // Si true, requiere TODOS los permisos/roles. Si false, requiere AL MENOS UNO
  fallback?: React.ReactNode;
  onUnauthorized?: () => void;
}

// Session Configuration
export interface SessionConfig {
  timeoutMinutes: number;
  warningMinutes: number;
  refreshIntervalMinutes: number;
}