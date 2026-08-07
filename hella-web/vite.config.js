import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Importación obligatoria para v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Debe estar en los plugins
  ],
});