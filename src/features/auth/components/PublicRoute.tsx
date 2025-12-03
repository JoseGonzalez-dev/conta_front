import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { getDefaultRedirectPath, logSecurityEvent } from '../utils/authUtils';

interface PublicRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

/**
 * PublicRoute Component
 * 
 * Protege rutas públicas (como login/register) para que usuarios
 * autenticados no puedan acceder a ellas.
 * 
 * Si el usuario ya está autenticado, lo redirige a su página principal.
 */
export const PublicRoute = ({ children, redirectTo }: PublicRouteProps) => {
    const { isAuthenticated, loading, user } = useAuthContext();
    const location = useLocation();

    // Esperar mientras se verifica la autenticación
    if (loading) {
        return null; // O un loading spinner si prefieres
    }

    // Si está autenticado, redirigir a la página principal
    if (isAuthenticated && user) {
        const destination = redirectTo || getDefaultRedirectPath(user);

        logSecurityEvent('Authenticated user redirected from public route', {
            from: location.pathname,
            to: destination,
            userRole: user.role,
        });

        // Usar location.state?.from si existe (para redirigir después del login)
        const from = (location.state as { from?: Location })?.from?.pathname;
        const finalDestination = from || destination;

        return <Navigate to={finalDestination} replace />;
    }

    // Usuario no autenticado, permitir acceso a ruta pública
    return <>{children}</>;
};
