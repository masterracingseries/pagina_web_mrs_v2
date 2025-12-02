import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno (incluyendo las de GitHub Secrets)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: './', // Esto asegura que la página cargue bien sea cual sea el nombre de tu repo en GitHub Pages
    define: {
      // AQUÍ OCURRE LA MAGIA:
      // Reemplaza "process.env.API_KEY" en el código con el valor real de la variable VITE_API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    }
  }
})
