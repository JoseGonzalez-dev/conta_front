import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones externas
    port: 5173, // Puerto del servidor de desarrollo
    strictPort: true, // Fallar si el puerto está en uso
    watch: {
      usePolling: true, // Usar polling para detectar cambios en archivos
    }
  }
})
