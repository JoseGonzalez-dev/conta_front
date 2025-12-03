import type { User, LoginRequest, RegisterRequest, AuthResponse, UserRole } from '../types';
import { post } from '../../../shared/utils/service/api';
import axios from 'axios';

const URI_BASE = '/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // El backend enviará la cookie HttpOnly automáticamente
      return await post<AuthResponse, LoginRequest>(`${URI_BASE}/login-json`, credentials);
    } catch (error: unknown) {
      // Extraer mensaje útil del backend si está disponible
      let msg = 'Error al iniciar sesión';
      if (axios.isAxiosError(error)) {
        const respData = error.response?.data;
        if (respData && typeof respData === 'object') {
          const maybeMessage = (respData as { message?: unknown }).message;
          if (typeof maybeMessage === 'string') msg = maybeMessage;
          else msg = JSON.stringify(respData);
        } else {
          msg = error.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      console.error('AuthService.login error:', msg);
      throw new Error(msg);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // El backend enviará la cookie HttpOnly automáticamente
    return await post<AuthResponse, RegisterRequest>(`${URI_BASE}/register`, userData);
  }

  async logout(): Promise<void> {
    // El backend eliminará la cookie HttpOnly
    return await post<void, void>(`${URI_BASE}/logout`);
  }

  // Guardar solo datos del usuario en localStorage (no sensibles)
  saveUserToStorage(user: User): void {
    try {
      console.log('📦 Saving user to localStorage:', user);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User saved successfully');
    } catch (err) {
      console.error('❌ Error saving user to localStorage:', err);
    }
  }

  // Limpiar datos del usuario
  clearStorage(): void {
    try {
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
  }

  // Obtener usuario de localStorage
  getUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      this.clearStorage();
    }
    return null;
  }

  getUserRole(): UserRole | null {
    const user = this.getUserFromStorage();
    return user?.role || null;
  }

  async forgotPassword(email: string): Promise<void> {
    return await post<void, { email: string }>(`${URI_BASE}/forgot-password`, { email });
  }
}

export const authService = new AuthService();