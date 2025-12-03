import { useState, useEffect, createContext, useContext } from 'react';
import type { AuthState, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);

  const login = async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authService.login(credentials);

      // El backend ya estableció la cookie HttpOnly
      // Solo guardamos el usuario en localStorage para acceso rápido
      authService.saveUserToStorage(response.user);

      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.access_token, // Solo para el estado, no se guarda
        isAuthenticated: true,
        loading: false
      }));
      navigate('/');
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error de autenticación'
      }));
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authService.register(userData);

      // El backend ya estableció la cookie HttpOnly
      authService.saveUserToStorage(response.user);

      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        loading: false
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error en el registro'
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // El backend eliminará la cookie HttpOnly
      await authService.logout();

      // Limpiar localStorage
      authService.clearStorage();

      setState(initialState);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cerrar sesión'
      }));
    }
  };

  /**
   * Force logout without calling backend
   * Used when cookie has already expired (401 error from backend)
   */
  const forceLogout = () => {
    // Clear localStorage
    authService.clearStorage();

    // Reset state
    setState(initialState);

    console.log('🔒 Session expired - user logged out');
  };

  const checkAuthStatus = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Intentar obtener usuario de localStorage
      const user = authService.getUserFromStorage();

      if (user) {
        // Si hay usuario en localStorage, asumimos que la cookie del backend existe
        // El backend validará la cookie en cada petición
        setState(prev => ({
          ...prev,
          user,
          token: null, // No tenemos acceso al token (está en cookie HttpOnly)
          isAuthenticated: true,
          loading: false
        }));
      } else {
        // No hay usuario guardado, no está autenticado
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al verificar autenticación'
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const forgotPassword = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authService.forgotPassword(email);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error al enviar email'
      }));
      throw error;
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    forceLogout,
    forgotPassword,
    clearError,
    checkAuthStatus
  };
};

// Context para compartir el estado de autenticación
export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de AuthProvider');
  }
  return context;
};