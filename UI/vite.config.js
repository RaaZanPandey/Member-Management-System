import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  base: './', 
 build: {
    outDir: '../Desktop/resources/PNSB/public',
    emptyOutDir: false,
},
  plugins: [react(),
    tailwindcss(),
  ],
})
