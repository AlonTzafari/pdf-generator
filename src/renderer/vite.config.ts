import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    base: './',
    build: {
        emptyOutDir: true,
        outDir: '../../app/renderer',
        assetsDir: './dist/assets'
    },
  plugins: [react()]
})
