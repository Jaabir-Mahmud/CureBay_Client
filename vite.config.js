import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use('/api/stats', (req, res, next) => {
          if (req.url === '/api/stats') {
            // Generate new random values for each request to ensure truly dynamic data
            const stats = {
              products: Math.floor(Math.random() * 300) + 250, // Random number between 250-550
              customers: Math.floor(Math.random() * 400) + 900, // Random number between 900-1300
              support: 24 // Fixed at 24 for 24/7 support
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(stats));
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
