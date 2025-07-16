import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env en el directorio actual.
  // El tercer parámetro '' asegura que se carguen todas las variables, sin importar el prefijo VITE_.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Expone las variables de entorno al código del cliente de forma segura.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})