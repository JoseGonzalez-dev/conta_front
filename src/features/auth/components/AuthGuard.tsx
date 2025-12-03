import { ReactNode } from 'react';
import type { UserRole, Permission } from '../types';
import { useAuthContext } from '../hooks/useAuth';
import { hasAnyRole, hasAllRoles, hasAnyPermission, hasAllPermissions } from '../utils/authUtils';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

interface AuthGuardProps {
    children: ReactNode;
    requiredRoles?: UserRole[];
    requiredPermissions?: Permission[];
    requireAll?: boolean;
    fallback?: ReactNode;
    onUnauthorized?: () => void;
}

// Styled Components para el fallback por defecto
const FallbackContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 0.5rem;
  margin: 1rem;
`;

const FallbackIcon = styled.div`
  font-size: 3rem;
  color: #ff9800;
  margin-bottom: 1rem;
`;

const FallbackTitle = styled.h3`
  color: #856404;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const FallbackMessage = styled.p`
  color: #856404;
  margin: 0;
`;

/**
 * AuthGuard Component
 * 
 * Componente de alto nivel para proteger secciones de la UI basado en roles y permisos.
 * A diferencia de ProtectedRoute, este componente no redirige, sino que oculta contenido.
 * 
 * Útil para:
 * - Ocultar botones o secciones según permisos
 * - Mostrar contenido alternativo para usuarios sin permisos
 * - Proteger componentes individuales dentro de una página
 * 
 * @example
 * ```tsx
 * <AuthGuard requiredRoles={['admin']}>
 *   <AdminPanel />
 * </AuthGuard>
 * 
 * <AuthGuard 
 *   requiredPermissions={['EDIT_ACCOUNTS']}
 *   fallback={<p>No tienes permiso para editar</p>}
 * >
 *   <EditButton />
 * </AuthGuard>
 * ```
 */
export const AuthGuard = ({
    children,
    requiredRoles,
    requiredPermissions,
    requireAll = false,
    fallback,
    onUnauthorized,
}: AuthGuardProps) => {
    const { user, isAuthenticated } = useAuthContext();

    // Si no está autenticado, no mostrar nada
    if (!isAuthenticated || !user) {
        if (onUnauthorized) {
            onUnauthorized();
        }
        return fallback ? <>{fallback}</> : null;
    }

    // Verificar roles si se especificaron
    if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requireAll
            ? hasAllRoles(user, requiredRoles)
            : hasAnyRole(user, requiredRoles);

        if (!hasRequiredRole) {
            if (onUnauthorized) {
                onUnauthorized();
            }

            return fallback ? (
                <>{fallback}</>
            ) : (
                <FallbackContainer>
                    <FallbackIcon>
                        <Icon icon="mdi:shield-lock" />
                    </FallbackIcon>
                    <FallbackTitle>Acceso Restringido</FallbackTitle>
                    <FallbackMessage>
                        Tu rol no tiene acceso a esta funcionalidad.
                    </FallbackMessage>
                </FallbackContainer>
            );
        }
    }

    // Verificar permisos si se especificaron
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasRequiredPermission = requireAll
            ? hasAllPermissions(user, requiredPermissions)
            : hasAnyPermission(user, requiredPermissions);

        if (!hasRequiredPermission) {
            if (onUnauthorized) {
                onUnauthorized();
            }

            return fallback ? (
                <>{fallback}</>
            ) : (
                <FallbackContainer>
                    <FallbackIcon>
                        <Icon icon="mdi:lock" />
                    </FallbackIcon>
                    <FallbackTitle>Permisos Insuficientes</FallbackTitle>
                    <FallbackMessage>
                        No tienes los permisos necesarios para ver este contenido.
                    </FallbackMessage>
                </FallbackContainer>
            );
        }
    }

    // Usuario autorizado, mostrar contenido
    return <>{children}</>;
};
