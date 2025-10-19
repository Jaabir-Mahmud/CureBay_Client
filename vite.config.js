import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Default to development mode
  const isProduction = mode === 'production';
  
  // Define API base URL based on environment
  const apiBaseUrl = isProduction 
    ? 'https://curebay-backend.onrender.com' 
    : 'http://localhost:5000';
  
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      proxy: {
        '/api': 'http://localhost:5000',
        '/uploads': 'http://localhost:5000',
      },
      host: true,
      port: 3000,  
      open: true,
      middleware: [
        (req, res, next) => {
          if (!req.url.includes('.') && !req.url.startsWith('/api')) {
            req.url = '/index.html';
          }
          next();
        }
      ]
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isProduction ? false : true,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip']
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define global constants for the application
    define: {
      __API_BASE_URL__: JSON.stringify(apiBaseUrl),
    }
  }
})