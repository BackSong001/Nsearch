import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-env-plugin',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/save-env' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { clientId, clientSecret } = JSON.parse(body);
                const envPath = path.resolve(process.cwd(), '.env');
                
                let envContent = '';
                if (fs.existsSync(envPath)) {
                  envContent = fs.readFileSync(envPath, 'utf-8');
                }
                
                const lines = envContent.split('\n').filter(line => line.trim() !== '');
                const newLines = lines.filter(line => !line.startsWith('VITE_NAVER_CLIENT_ID=') && !line.startsWith('VITE_NAVER_CLIENT_SECRET='));
                
                newLines.push(`VITE_NAVER_CLIENT_ID=${clientId}`);
                newLines.push(`VITE_NAVER_CLIENT_SECRET=${clientSecret}`);
                
                fs.writeFileSync(envPath, newLines.join('\n') + '\n');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    proxy: {
      '/v1/search': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
      }
    }
  }
})
