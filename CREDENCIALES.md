# Credenciales de Prueba - ContaFront

## 🔐 Usuarios de Prueba

### Administrador
- **Email:** admin@contafront.com
- **Contraseña:** password123
- **Rol:** Administrador
- **Empresa:** ContaFront Corp

### Contador
- **Email:** contador@empresa.com
- **Contraseña:** password123
- **Rol:** Contador
- **Empresa:** Empresa Demo

## 📝 Registro de Nuevos Usuarios

Para crear una cuenta nueva:
1. Ir a la página de registro
2. Completar el formulario con:
   - Nombre completo
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
   - Empresa (opcional)
   - Aceptar términos y condiciones

### Requisitos de Contraseña
- Mínimo 6 caracteres
- Se recomienda incluir:
  - Letras mayúsculas
  - Números
  - Para mayor seguridad

## 🎯 Funcionalidades Disponibles

### Módulos Implementados
1. **Nomenclatura Contable** - Gestión de catálogo de cuentas
2. **Registro de Asientos** - Partidas diarias
3. **Libro Mayor** - Visualización de T gráfica
4. **Cierre Contable** - Proceso de cierre de período
5. **Balance General** - Reportes financieros

### Características de Autenticación
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Recordar sesión (localStorage)
- ✅ Protección de rutas privadas
- ✅ Menú de usuario con logout
- ✅ Validaciones en tiempo real
- ✅ Indicador de fortaleza de contraseña

## 🚀 Inicio Rápido

1. Acceder a la aplicación
2. Usar las credenciales de prueba o crear una cuenta nueva
3. Explorar los diferentes módulos desde el sidebar
4. Cerrar sesión desde el menú de usuario

## 📱 Navegación

### Sidebar
- **Registro y Transacciones**
  - Registro de partidas → `/asientos`
  - Partidas pendientes

- **Administración y Catálogo**
  - Nomenclatura Contable → `/nomenclatura`
  - Libro mayor → `/libro-mayor`

- **Informes y Análisis**
  - Balance general → `/balance-general`
  - Estado de resultados
  - Balanza de comprobación

- **Fin de Período**
  - Proceso de cierre → `/cierre-contable`
  - Asiento de apertura

## 🔧 Notas Técnicas

- Los datos son mock y se almacenan en memoria
- La sesión persiste en localStorage si se activa "Recordar sesión"
- Las contraseñas no están hasheadas (solo para demo)
- Los tokens son simulados para propósitos de desarrollo

## 🎨 Características de UI/UX

- Diseño responsivo para móviles y desktop
- Gradientes y efectos glassmorphism
- Animaciones suaves y transiciones
- Feedback visual en todas las acciones
- Estados de carga y error claros
- Validaciones en tiempo real

## 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo para:
- Cuentas contables (Activos, Pasivos, Capital)
- Asientos contables con movimientos
- Períodos contables abiertos y cerrados
- Balances y reportes financieros

---

**Nota:** Esta es una aplicación de demostración. En producción, se debe implementar:
- Autenticación con backend real
- Hashing de contraseñas
- Tokens JWT
- Validación de sesiones
- Recuperación de contraseña por email
- Autenticación de dos factores (2FA)
