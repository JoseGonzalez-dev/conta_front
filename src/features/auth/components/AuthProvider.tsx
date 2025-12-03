import { ReactNode, useEffect, useRef } from 'react';
import { AuthContext, useAuth } from '../hooks/useAuth';
import { SESSION_CONFIG } from '../constants/auth.constants';
import { logSecurityEvent } from '../utils/authUtils';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

interface AuthProviderProps {
  children: ReactNode;
}

// Styled Components para Loading State
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: white;
`;

const LoadingIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LoadingSubtext = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
`;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  const lastActivityRef = useRef<number>(Date.now());
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizar última actividad del usuario
  const updateLastActivity = () => {
    lastActivityRef.current = Date.now();
  };

  // Verificar si la sesión sigue activa haciendo una petición al backend
  const checkSessionValidity = async () => {
    if (!auth.isAuthenticated) return;

    try {
      // Aquí podrías hacer una petición ligera al backend para verificar la cookie
      // Por ejemplo: await api.get('/auth/verify')
      // Si la cookie expiró, el backend responderá 401 y el interceptor manejará el logout

      // Por ahora, solo verificamos actividad local
      const now = Date.now();
      const inactiveTime = (now - lastActivityRef.current) / 1000 / 60; // minutos

      if (inactiveTime > SESSION_CONFIG.TIMEOUT_MINUTES) {
        logSecurityEvent('Session expired due to inactivity (frontend check)', {
          inactiveMinutes: inactiveTime,
        });

        auth.logout();
      }
    } catch (error) {
      console.error('Error checking session validity:', error);
    }
  };

  // Configurar listeners de actividad del usuario
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    // Eventos que indican actividad del usuario
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      updateLastActivity();
    };

    // Agregar listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Inicializar última actividad
    updateLastActivity();

    // Configurar verificación periódica de sesión
    sessionCheckIntervalRef.current = setInterval(
      checkSessionValidity,
      SESSION_CONFIG.REFRESH_INTERVAL_MINUTES * 60 * 1000
    );

    logSecurityEvent('Session monitoring started', {
      timeoutMinutes: SESSION_CONFIG.TIMEOUT_MINUTES,
      refreshIntervalMinutes: SESSION_CONFIG.REFRESH_INTERVAL_MINUTES,
    });

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    };
  }, [auth.isAuthenticated]);

  // Verificar sesión al montar el componente
  useEffect(() => {
    logSecurityEvent('AuthProvider mounted', {
      isAuthenticated: auth.isAuthenticated,
      loading: auth.loading,
    });
  }, []);

  // Mostrar loading state durante la verificación inicial
  if (auth.loading && !auth.isAuthenticated && !auth.error) {
    return (
      <LoadingOverlay>
        <LoadingContent>
          <LoadingIcon>
            <Icon icon="mdi:loading" />
          </LoadingIcon>
          <LoadingText>Verificando autenticación</LoadingText>
          <LoadingSubtext>Por favor espera...</LoadingSubtext>
        </LoadingContent>
      </LoadingOverlay>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};