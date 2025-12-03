# Conta Front

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

Frontend para el sistema de contabilidad **Conta**, construido con React, TypeScript y Vite. Este proyecto proporciona una interfaz moderna y eficiente para la gestión de procesos contables.

## 🔗 Backend

El backend de este proyecto se encuentra en:
[https://github.com/JoseGonzalez-dev/Conta.git](https://github.com/JoseGonzalez-dev/Conta.git)

## 📸 Screenshots

<!-- Añade tus capturas de pantalla aquí -->
<div align="center">
  <img src="https://via.placeholder.com/800x450?text=Dashboard+Preview" alt="Dashboard" />
  <p><em>Panel Principal (Preview)</em></p>
</div>

## 🚀 Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/conta_front.git
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
