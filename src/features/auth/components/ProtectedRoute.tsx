import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { logSecurityEvent } from '../utils/authUtils';
import { AUTH_ROUTES } from '../constants/auth.constants';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

interface ProtectedRouteProps {
  children: ReactNode;
  onUnauthorized?: () => void;
}

// Styled Components
const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
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

const LoadingText = styled.p`
  font-size: 1.125rem;
  margin: 0;
`;

/**
 * ProtectedRoute Component
 * 
 * Protects routes by checking if the user is authenticated.
 * If not authenticated, redirects to login page.
 * If authenticated, renders the children components.
 */
export const ProtectedRoute = ({
  children,
  onUnauthorized,
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuthContext();
  const location = useLocation();

  // Show loading while verifying authentication
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <LoadingIcon>
            <Icon icon="mdi:loading" />
          </LoadingIcon>
          <LoadingText>Verificando autenticación...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    logSecurityEvent('Unauthorized access attempt - not authenticated', {
      attemptedPath: location.pathname,
    });

    if (onUnauthorized) {
      onUnauthorized();
    }

    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // User is authenticated, grant access
  logSecurityEvent('Authorized access granted', {
    path: location.pathname,
    userRole: user?.role,
  });

  return <>{children}</>;
};