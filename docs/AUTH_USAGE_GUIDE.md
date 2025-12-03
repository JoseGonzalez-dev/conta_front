# Sistema de Autenticación y Autorización Mejorado

## 📚 Guía de Uso Completa

Este documento explica cómo usar el sistema de autenticación mejorado con ejemplos prácticos.

---

## 🔐 Componentes Principales

### 1. AuthProvider

Proveedor de contexto que maneja el estado de autenticación global.

**Características:**
- ✅ Monitoreo automático de sesión
- ✅ Timeout por inactividad (30 minutos)
- ✅ Tracking de actividad del usuario
- ✅ Loading state durante inicialización
- ✅ Logs de seguridad en desarrollo

**Uso:**
```tsx
// Ya está configurado en AppRouter.tsx
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

---

### 2. ProtectedRoute

Protege rutas completas basándose en autenticación, roles y permisos.

**Props:**
- `requiredRoles?: UserRole[]` - Roles requeridos
- `requiredPermissions?: Permission[]` - Permisos requeridos
- `requireAll?: boolean` - Si true, requiere TODOS. Si false, requiere AL MENOS UNO
- `fallbackPath?: string` - Ruta de redirección alternativa
- `onUnauthorized?: () => void` - Callback cuando no está autorizado

**Ejemplos:**

```tsx
// Proteger por autenticación básica
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Proteger por rol (solo ADMIN)
<ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
  <AdminPanel />
</ProtectedRoute>

// Proteger por múltiples roles (ADMIN o ACCOUNTANT)
<ProtectedRoute 
  requiredRoles={[UserRole.ADMIN, UserRole.ACCOUNTANT]}
  requireAll={false}
>
  <AccountingPage />
</ProtectedRoute>

// Proteger por permisos
<ProtectedRoute 
  requiredPermissions={[Permission.EDIT_ACCOUNTS]}
>
  <EditAccountPage />
</ProtectedRoute>

// Proteger con múltiples permisos (requiere TODOS)
<ProtectedRoute 
  requiredPermissions={[
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS
  ]}
  requireAll={true}
>
  <ExportReportsPage />
</ProtectedRoute>

// Con callback personalizado
<ProtectedRoute 
  requiredRoles={[UserRole.ADMIN]}
  onUnauthorized={() => {
    console.log('Acceso denegado');
    // Enviar analytics, mostrar toast, etc.
  }}
>
  <SensitivePage />
</ProtectedRoute>
```

---

### 3. PublicRoute

Protege rutas públicas (login, register) para que usuarios autenticados no accedan.

**Uso:**

```tsx
// En el router
<PublicRoute>
  <LoginPage />
</PublicRoute>

// Con redirección personalizada
<PublicRoute redirectTo="/dashboard">
  <RegisterPage />
</PublicRoute>
```

**Comportamiento:**
- Si el usuario NO está autenticado → Muestra la página
- Si el usuario SÍ está autenticado → Redirige a su página principal según rol

---

### 4. AuthGuard

Protege secciones de UI sin redirigir. Útil para ocultar botones o componentes.

**Props:**
- `requiredRoles?: UserRole[]`
- `requiredPermissions?: Permission[]`
- `requireAll?: boolean`
- `fallback?: ReactNode` - Contenido alternativo
- `onUnauthorized?: () => void`

**Ejemplos:**

```tsx
// Ocultar botón para usuarios sin permiso
<AuthGuard requiredPermissions={[Permission.DELETE_ACCOUNTS]}>
  <DeleteButton />
</AuthGuard>

// Mostrar contenido alternativo
<AuthGuard 
  requiredRoles={[UserRole.ADMIN]}
  fallback={<p>Solo administradores pueden ver esto</p>}
>
  <AdminSettings />
</AuthGuard>

// Ocultar sección completa
<AuthGuard requiredPermissions={[Permission.VIEW_AUDIT_LOG]}>
  <AuditLogSection />
</AuthGuard>

// Múltiples permisos (requiere AL MENOS UNO)
<AuthGuard 
  requiredPermissions={[
    Permission.EDIT_ACCOUNTS,
    Permission.DELETE_ACCOUNTS
  ]}
  requireAll={false}
>
  <AccountActions />
</AuthGuard>
```

---

## 🛠️ Hooks y Utilidades

### useAuthContext

Hook para acceder al estado de autenticación.

```tsx
import { useAuthContext } from '@/features/auth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    login, 
    logout 
  } = useAuthContext();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <div>Hola, {user?.fullname}</div>;
}
```

### Funciones de Utilidad

```tsx
import { 
  hasRole, 
  hasPermission, 
  isAdmin,
  getUserPermissions 
} from '@/features/auth';

// Verificar rol
if (hasRole(user, UserRole.ADMIN)) {
  // Hacer algo solo para admins
}

// Verificar permiso
if (hasPermission(user, Permission.EDIT_ACCOUNTS)) {
  // Mostrar botón de editar
}

// Verificar si es admin (shortcut)
if (isAdmin(user)) {
  // Funcionalidad de admin
}

// Obtener todos los permisos del usuario
const permissions = getUserPermissions(user);
console.log('Permisos:', permissions);
```

---

## 📋 Roles y Permisos

### Roles Disponibles

```typescript
enum UserRole {
  ADMIN = 'admin',        // Acceso total
  ACCOUNTANT = 'accountant', // Acceso contable
  USER = 'user'           // Solo lectura
}
```

### Permisos por Rol

#### ADMIN
- ✅ Todos los permisos
- ✅ Gestión de usuarios
- ✅ Configuración del sistema
- ✅ Logs de auditoría

#### ACCOUNTANT
- ✅ Ver/Crear/Editar cuentas
- ✅ Ver/Crear/Editar asientos
- ✅ Ver/Exportar reportes
- ❌ Eliminar cuentas/asientos
- ❌ Gestión de usuarios

#### USER
- ✅ Ver cuentas
- ✅ Ver asientos
- ✅ Ver reportes
- ❌ Crear/Editar/Eliminar

### Permisos Disponibles

```typescript
enum Permission {
  // Nomenclatura
  VIEW_ACCOUNTS,
  CREATE_ACCOUNTS,
  EDIT_ACCOUNTS,
  DELETE_ACCOUNTS,
  
  // Asientos
  VIEW_ENTRIES,
  CREATE_ENTRIES,
  EDIT_ENTRIES,
  DELETE_ENTRIES,
  
  // Reportes
  VIEW_REPORTS,
  EXPORT_REPORTS,
  
  // Admin
  MANAGE_USERS,
  MANAGE_SETTINGS,
  VIEW_AUDIT_LOG,
}
```

---

## 🎯 Ejemplos Prácticos

### Ejemplo 1: Botón Condicional

```tsx
import { AuthGuard, Permission } from '@/features/auth';

function AccountsList() {
  return (
    <div>
      <h1>Cuentas</h1>
      
      {/* Botón solo visible para quienes pueden crear */}
      <AuthGuard requiredPermissions={[Permission.CREATE_ACCOUNTS]}>
        <Button onClick={handleCreate}>
          Nueva Cuenta
        </Button>
      </AuthGuard>

      {/* Botón solo para admins */}
      <AuthGuard requiredRoles={[UserRole.ADMIN]}>
        <Button onClick={handleDeleteAll} variant="danger">
          Eliminar Todas
        </Button>
      </AuthGuard>
    </div>
  );
}
```

### Ejemplo 2: Menú Dinámico

```tsx
import { useAuthContext, hasPermission, Permission } from '@/features/auth';

function Sidebar() {
  const { user } = useAuthContext();

  return (
    <nav>
      <MenuItem to="/">Inicio</MenuItem>
      
      {hasPermission(user, Permission.VIEW_ACCOUNTS) && (
        <MenuItem to="/nomenclatura">Nomenclatura</MenuItem>
      )}
      
      {hasPermission(user, Permission.VIEW_ENTRIES) && (
        <MenuItem to="/asientos">Asientos</MenuItem>
      )}
      
      {hasPermission(user, Permission.VIEW_REPORTS) && (
        <MenuItem to="/reportes">Reportes</MenuItem>
      )}
      
      {isAdmin(user) && (
        <MenuItem to="/admin">Administración</MenuItem>
      )}
    </nav>
  );
}
```

### Ejemplo 3: Formulario con Permisos

```tsx
import { AuthGuard, Permission } from '@/features/auth';

function AccountForm() {
  return (
    <form>
      <Input name="code" label="Código" />
      <Input name="name" label="Nombre" />
      
      {/* Campo solo editable por admins */}
      <AuthGuard 
        requiredRoles={[UserRole.ADMIN]}
        fallback={<Input name="type" label="Tipo" disabled />}
      >
        <Input name="type" label="Tipo" />
      </AuthGuard>

      {/* Botones según permisos */}
      <AuthGuard requiredPermissions={[Permission.EDIT_ACCOUNTS]}>
        <Button type="submit">Guardar</Button>
      </AuthGuard>

      <AuthGuard requiredPermissions={[Permission.DELETE_ACCOUNTS]}>
        <Button variant="danger" onClick={handleDelete}>
          Eliminar
        </Button>
      </AuthGuard>
    </form>
  );
}
```

### Ejemplo 4: Página Completa Protegida

```tsx
// En el router
{
  path: 'admin',
  element: (
    <ProtectedRoute 
      requiredRoles={[UserRole.ADMIN]}
      fallbackPath="/"
    >
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'users',
      element: (
        <ProtectedRoute 
          requiredPermissions={[Permission.MANAGE_USERS]}
        >
          <UsersPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'settings',
      element: (
        <ProtectedRoute 
          requiredPermissions={[Permission.MANAGE_SETTINGS]}
        >
          <SettingsPage />
        </ProtectedRoute>
      )
    }
  ]
}
```

---

## ⚙️ Configuración

### Timeouts de Sesión

Editar en `auth.constants.ts`:

```typescript
export const SESSION_CONFIG = {
  TIMEOUT_MINUTES: 30,      // Cambiar timeout
  WARNING_MINUTES: 2,       // Warning antes de expirar
  REFRESH_INTERVAL_MINUTES: 5, // Intervalo de verificación
};
```

### Agregar Nuevos Permisos

1. Agregar en `types/index.ts`:
```typescript
export const enum Permission {
  // ... existentes
  MY_NEW_PERMISSION = 'my_new_permission',
}
```

2. Asignar a roles en `constants/auth.constants.ts`:
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // ... existentes
    Permission.MY_NEW_PERMISSION,
  ],
  // ...
};
```

3. Usar en componentes:
```tsx
<AuthGuard requiredPermissions={[Permission.MY_NEW_PERMISSION]}>
  <MyComponent />
</AuthGuard>
```

---

## 🔒 Seguridad

### Características Implementadas

✅ **Cookies Seguras**: HttpOnly, Secure (HTTPS), SameSite=Strict
✅ **Session Timeout**: Cierre automático por inactividad
✅ **Activity Tracking**: Renovación automática con actividad
✅ **RBAC**: Control de acceso basado en roles
✅ **Permission-Based**: Control granular por permisos
✅ **Security Logging**: Logs de acceso en desarrollo
✅ **Fail Secure**: Por defecto niega acceso

### Mejores Prácticas

1. **Siempre usa ProtectedRoute para rutas completas**
2. **Usa AuthGuard para componentes individuales**
3. **Verifica permisos en el backend también** (nunca confíes solo en frontend)
4. **Usa PublicRoute para páginas de auth**
5. **Revisa logs de seguridad en desarrollo**

---

## 🐛 Troubleshooting

### "No tienes autorización"

- Verifica que el usuario tenga el rol correcto
- Verifica que el rol tenga los permisos necesarios
- Revisa los logs de seguridad en consola (modo desarrollo)

### Sesión expira muy rápido

- Ajusta `SESSION_CONFIG.TIMEOUT_MINUTES` en `auth.constants.ts`
- Verifica que los eventos de actividad se estén detectando

### Usuario autenticado ve página de login

- Verifica que estés usando `PublicRoute` en rutas de auth
- Verifica que `AuthProvider` esté envolviendo el router

---

## 📊 Estructura de Archivos

```
features/auth/
├── components/
│   ├── AuthProvider.tsx      # Proveedor de contexto
│   ├── ProtectedRoute.tsx    # Protección de rutas
│   ├── PublicRoute.tsx       # Rutas públicas
│   ├── AuthGuard.tsx         # Protección de UI
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── constants/
│   └── auth.constants.ts     # Configuración y constantes
├── hooks/
│   └── useAuth.ts            # Hook principal
├── services/
│   └── authService.ts        # API calls
├── types/
│   └── index.ts              # TypeScript types
├── utils/
│   └── authUtils.ts          # Funciones helper
└── index.ts                  # Exports
```
