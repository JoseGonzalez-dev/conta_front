# Guía de Uso - ContaFront

## 🎯 Introducción

ContaFront es un sistema contable profesional desarrollado con React, TypeScript y Styled Components, siguiendo la arquitectura Screaming Architecture para una organización clara y mantenible del código.

## 📁 Estructura del Proyecto

```
src/
├── features/              # Módulos por funcionalidad
│   ├── auth/             # Autenticación
│   ├── nomenclatura/     # Catálogo de cuentas
│   ├── asientos/         # Registro de partidas
│   ├── libro-mayor/      # Libro mayor
│   ├── cierre-contable/  # Cierre de período
│   └── balance-general/  # Balance general
├── pages/                # Páginas de la aplicación
├── router/               # Configuración de rutas
└── shared/               # Componentes compartidos
    └── ui/               # UI components
```

## 🚀 Inicio de Sesión

### Primera Vez
1. Acceder a la aplicación
2. Hacer clic en "Crear cuenta nueva"
3. Completar el formulario de registro
4. Aceptar términos y condiciones
5. Hacer clic en "Crear Cuenta"

### Usuarios Existentes
1. Ingresar email y contraseña
2. (Opcional) Marcar "Recordar mi sesión"
3. Hacer clic en "Iniciar Sesión"

## 📊 Módulos Principales

### 1. Nomenclatura Contable (`/nomenclatura`)

**Funcionalidad:** Gestión del catálogo de cuentas contables

**Características:**
- Visualización de cuentas agrupadas por tipo
- Búsqueda por código o nombre
- Creación de nuevas cuentas
- Clasificación automática (Activo, Pasivo, Capital, etc.)

**Cómo usar:**
1. Navegar a "Nomenclatura Contable" desde el sidebar o card principal
2. Buscar cuentas existentes usando el buscador
3. Hacer clic en "Crear Nueva Cuenta" para agregar
4. Completar el formulario con:
   - Código de cuenta
   - Nombre
   - Tipo de cuenta
   - Cuenta padre (opcional)
   - Descripción

### 2. Registro de Asientos (`/asientos`)

**Funcionalidad:** Registro de partidas diarias en el libro diario

**Características:**
- Fecha y hora de transacción
- Múltiples movimientos por asiento
- Validación de partida doble
- Cálculo automático de totales
- Verificación de balance

**Cómo usar:**
1. Navegar a "Registro de partidas"
2. Seleccionar fecha y hora
3. Agregar movimientos:
   - Seleccionar cuenta contable
   - Ingresar débito o crédito
   - Ver saldo actual de la cuenta
4. Agregar descripción de la transacción
5. Verificar que débitos = créditos
6. Guardar transacción

**Validaciones:**
- Mínimo 2 movimientos
- Débitos deben igualar créditos
- Todos los campos obligatorios completos

### 3. Libro Mayor (`/libro-mayor`)

**Funcionalidad:** Visualización de movimientos por cuenta en formato T

**Características:**
- Selección de cuenta
- Filtro por rango de fechas
- Visualización en T gráfica
- Separación de débitos y créditos
- Cálculo de saldo final
- Exportación a PDF/Excel

**Cómo usar:**
1. Navegar a "Libro mayor"
2. Seleccionar cuenta del dropdown
3. Definir fecha de inicio y fin
4. Hacer clic en "Generar Reporte"
5. Revisar movimientos en formato T
6. (Opcional) Exportar a PDF o Excel

### 4. Cierre Contable (`/cierre-contable`)

**Funcionalidad:** Proceso de cierre de período contable

**Características:**
- Selección de período a cerrar
- Cálculo automático de resultados
- Resumen de ingresos y gastos
- Generación de asientos de cierre
- Proceso en 2 pasos (Revisión y Ejecución)

**Cómo usar:**
1. Navegar a "Proceso de cierre"
2. Seleccionar período a cerrar
3. Hacer clic en "Calcular Resultado del Ejercicio"
4. Revisar:
   - Total de ingresos
   - Total de gastos
   - Detalle por cuenta
5. Hacer clic en "Ejecutar Cierre Contable"
6. Confirmar el proceso

**Asientos generados automáticamente:**
- Cierre de cuentas de ingresos
- Cierre de cuentas de gastos
- Transferencia del resultado neto

### 5. Balance General (`/balance-general`)

**Funcionalidad:** Generación de balance general a una fecha específica

**Características:**
- Calendario interactivo
- Navegación por meses
- Verificación de ecuación contable
- Clasificación por categorías
- Formato de 3 columnas (Activo, Pasivo, Capital)
- Exportación de reportes

**Cómo usar:**
1. Navegar a "Balance general"
2. Seleccionar fecha usando el calendario
3. Hacer clic en "Generar Reporte"
4. Revisar:
   - Verificación de ecuación contable
   - Activos (Corrientes y No Corrientes)
   - Pasivos (Corrientes y No Corrientes)
   - Capital (Social y Utilidades Retenidas)
5. (Opcional) Exportar reporte

**Verificación:**
- Total Activo = Total Pasivo + Capital
- Indicador visual de balance correcto

## 🎨 Características de la Interfaz

### Navegación
- **Sidebar:** Menú lateral con todas las funcionalidades
- **Cards principales:** Acceso rápido desde el dashboard
- **Breadcrumbs:** Navegación contextual
- **Menú de usuario:** Configuración y logout

### Feedback Visual
- **Estados de carga:** Spinners durante operaciones
- **Mensajes de error:** Alertas descriptivas
- **Validaciones:** Feedback en tiempo real
- **Confirmaciones:** Mensajes de éxito

### Responsive Design
- Adaptable a móviles, tablets y desktop
- Sidebar colapsable en móviles
- Grids que se reorganizan
- Touch-friendly en dispositivos móviles

## 🔧 Funcionalidades Avanzadas

### Búsqueda y Filtros
- Búsqueda en tiempo real
- Filtros por fecha
- Filtros por tipo de cuenta
- Ordenamiento de resultados

### Validaciones
- Validación de partida doble
- Verificación de ecuación contable
- Validación de campos obligatorios
- Validación de formatos (email, números)

### Exportación
- PDF (simulado)
- Excel (simulado)
- Formato profesional

## 💡 Mejores Prácticas

### Registro de Asientos
1. Siempre verificar que la partida esté balanceada
2. Incluir descripciones claras
3. Revisar saldos de cuentas antes de registrar
4. Usar referencias consistentes

### Nomenclatura
1. Seguir un plan de cuentas estándar
2. Usar códigos numéricos consistentes
3. Mantener jerarquía de cuentas
4. Documentar cuentas con descripciones

### Cierre de Período
1. Revisar todos los asientos del período
2. Verificar balances antes de cerrar
3. Generar reportes antes del cierre
4. No cerrar períodos con errores

## 🆘 Solución de Problemas

### No puedo iniciar sesión
- Verificar email y contraseña
- Usar credenciales de prueba: admin@contafront.com / password123
- Limpiar caché del navegador

### La partida no se guarda
- Verificar que débitos = créditos
- Completar todos los campos obligatorios
- Agregar al menos 2 movimientos

### No veo mis datos
- Verificar que la sesión esté activa
- Recargar la página
- Verificar filtros aplicados

### El balance no cuadra
- Revisar todos los asientos del período
- Verificar clasificación de cuentas
- Regenerar el reporte

## 📞 Soporte

Para más información o reportar problemas:
- Revisar la documentación técnica
- Consultar el código fuente
- Verificar los tipos TypeScript

---

**Nota:** Esta es una aplicación de demostración con datos mock. En producción, todos los datos se persistirían en una base de datos real.
