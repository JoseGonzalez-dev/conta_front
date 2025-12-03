# Conta Front

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

Frontend para el sistema de contabilidad **Conta**, construido con React, TypeScript y Vite. Este proyecto proporciona una interfaz moderna y eficiente para la gestión de procesos contables.

## 📖 Descripción del Proyecto

**Conta** es una solución integral para la gestión contable, diseñada para facilitar el registro, control y análisis de la información financiera. La aplicación permite a los usuarios gestionar su ciclo contable completo, desde la configuración del plan de cuentas hasta la generación de estados financieros.

### Funcionalidades Principales

*   **🔐 Autenticación y Seguridad**: Sistema robusto de inicio de sesión y gestión de sesiones para proteger la información financiera.
*   **📚 Nomenclatura (Plan de Cuentas)**: Gestión flexible de cuentas contables, permitiendo crear, editar y estructurar el catálogo de cuentas según las necesidades de la organización.
*   **📝 Gestión de Asientos**: Interfaz intuitiva para el registro de partidas diarias (asientos contables), asegurando el principio de partida doble.
*   **📒 Libro Mayor**: Visualización detallada de los movimientos por cuenta, facilitando el seguimiento y la auditoría de transacciones.
*   **📊 Balance General**: Generación automática del estado de situación financiera para conocer la salud económica de la entidad en tiempo real.
*   **🔄 Cierre Contable**: Herramientas para realizar el cierre del ejercicio fiscal, automatizando el cálculo de resultados y el reinicio de saldos para el nuevo periodo.

## 🔗 Backend

El backend de este proyecto se encuentra en:
[https://github.com/JoseGonzalez-dev/Conta.git](https://github.com/JoseGonzalez-dev/Conta.git)

## 📸 Screenshots

<!-- Añade tus capturas de pantalla aquí -->
<div align="center">
  <img src="https://res.cloudinary.com/dzydnoljd/image/upload/v1764800161/WhatsApp_Image_2025-12-03_at_4.15.38_PM_cv5oxx.jpg" alt="Dashboard" />
  <p><em>Panel Principal (Preview)</em></p>
</div>

## 🚀 Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/JoseGonzalez-dev/conta_front.git
    cd conta_front
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` (si existe) o configura la URL del backend:

    ```env
    VITE_API_URL=http://localhost:8000/api/v1
    ```

4.  **Docker (Opcional):**

    Si prefieres usar Docker, asegúrate de tener Docker y Docker Compose instalados.

    ```bash
    docker-compose up -d --build
    ```

    Esto levantará la aplicación en el puerto configurado (por defecto 5173).

## 💻 Uso

### Servidor de Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Construcción para Producción

Para construir el proyecto para producción:

```bash
npm run build
```

Para previsualizar la build:

```bash
npm run preview
```

### Linting

Para ejecutar el linter y verificar la calidad del código:

```bash
npm run lint
```

## 🗺️ Roadmap

- [x] Configuración inicial del proyecto (Vite + React + TS)
- [x] Integración de RSuite y Styled Components
- [ ] **Autenticación**: Login, Registro y Recuperación de contraseña
- [ ] **Gestión de Cuentas**: CRUD de cuentas contables
- [ ] **Asientos Contables**: Creación y visualización de asientos
- [ ] **Reportes**: Balance General y Estado de Resultados
- [ ] Tests Unitarios y de Integración
- [ ] CI/CD Pipeline

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.
