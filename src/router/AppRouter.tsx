import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '../shared/ui/layout/AppLayout';
import { HomePage } from '../pages/HomePage/index';
import { NomenclaturaPage } from '../pages/NomenclaturaPage/index';
import { AsientosPage } from '../pages/AsientosPage/index';
import { LibroMayorPage } from '../pages/LibroMayorPage/index';
import { CierreContablePage } from '../pages/CierreContablePage/index';
import { BalanceGeneralPage } from '../pages/BalanceGeneralPage/index';
import { AuthPage } from '../pages/AuthPage/index';
import { NotFoundPage } from '../pages/NotFoundPage/index';
import { AuthProvider } from '../features/auth/components/AuthProvider';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { PublicRoute } from '../features/auth/components/PublicRoute';

const router = createBrowserRouter(
  [
    {
      path: '/auth',
      element: (
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      )
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'nomenclatura',
          element: <NomenclaturaPage />
        },
        {
          path: 'asientos',
          element: <AsientosPage />
        },
        {
          path: 'libro-mayor',
          element: <LibroMayorPage />
        },
        {
          path: 'cierre-contable',
          element: <CierreContablePage />
        },
        {
          path: 'balance-general',
          element: <BalanceGeneralPage />
        },
        {
          path: '*',
          element: <NotFoundPage />
        }
      ]
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]
)

export const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}