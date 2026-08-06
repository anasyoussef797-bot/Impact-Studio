import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function ttsProxyPlugin(): Plugin {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');
          const q = urlParams.get('q') || '';
          const tl = urlParams.get('tl') || 'ar';
          if (!q) {
            res.statusCode = 400;
            res.end('Missing text parameter q');
            return;
          }
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}`;
          const response = await fetch(ttsUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });

          if (!response.ok) {
            res.statusCode = response.status;
            res.end('TTS request failed');
            return;
          }

          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(buffer);
        } catch (err) {
          console.error('TTS Proxy Error:', err);
          res.statusCode = 500;
          res.end('Server error fetching TTS');
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ttsProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
