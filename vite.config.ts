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
          const gender = urlParams.get('gender') || 'female';
          const charId = urlParams.get('charId') || '';

          if (!q) {
            res.statusCode = 400;
            res.end('Missing text parameter q');
            return;
          }

          const isArabic = tl.toLowerCase().includes('ar');
          const isMale = gender === 'male' || charId.includes('ahmed') || charId.includes('rashed') || charId.includes('ali');

          let primaryVoice = 'Zeina';
          if (isArabic) {
            if (charId === 'char_lulu') primaryVoice = 'Laila';
            else if (charId === 'char_noor') primaryVoice = 'Salma';
            else if (charId === 'char_maryam') primaryVoice = 'Zeina';
            else if (charId === 'char_rashed') primaryVoice = 'Tarik';
            else if (charId === 'char_ahmed') primaryVoice = 'Maged';
            else if (charId === 'char_ali') primaryVoice = 'Maged';
            else primaryVoice = isMale ? 'Maged' : 'Zeina';
          } else if (tl.toLowerCase().includes('en')) {
            primaryVoice = isMale ? 'Justin' : 'Ivy';
          } else if (tl.toLowerCase().includes('fr')) {
            primaryVoice = isMale ? 'Mathieu' : 'Lea';
          } else if (tl.toLowerCase().includes('de')) {
            primaryVoice = isMale ? 'Hans' : 'Marlene';
          }

          const urlsToTry = [
            // 1. Google Translate tw-ob with proper headers
            {
              url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}&client=tw-ob`,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/',
                'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8'
              }
            },
            // 2. StreamElements TTS
            {
              url: `https://api.streamelements.com/kappa/v2/speech?voice=${primaryVoice}&text=${encodeURIComponent(q)}`,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'audio/mp3, audio/*;q=0.9, */*;q=0.8'
              }
            },
            // 3. Google Translate GTX
            {
              url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}&client=gtx`,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/'
              }
            },
            // 4. Youdao TTS
            {
              url: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(q)}&le=${isArabic ? 'ar' : 'en'}`,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            }
          ];

          // Try SoundOfText API first for Arabic
          try {
            const sotRes = await fetch('https://soundoftext.com/api/v2/requests', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              body: JSON.stringify({
                text: q,
                voice: isArabic ? 'ar-SA' : (tl.includes('en') ? 'en-US' : 'ar-SA')
              })
            });

            if (sotRes.ok) {
              const sotData = await sotRes.json();
              if (sotData.success && sotData.id) {
                const fileUrl = `https://files.soundoftext.com/${sotData.id}.mp3`;
                await new Promise((r) => setTimeout(r, 350));
                const audioRes = await fetch(fileUrl);
                if (audioRes.ok) {
                  const arrayBuffer = await audioRes.arrayBuffer();
                  if (arrayBuffer.byteLength > 200) {
                    const buffer = Buffer.from(arrayBuffer);
                    res.setHeader('Content-Type', 'audio/mpeg');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Cache-Control', 'public, max-age=86400');
                    res.end(buffer);
                    return;
                  }
                }
              }
            }
          } catch (sotErr) {
            console.warn('SoundOfText attempt failed, falling back:', sotErr);
          }

          for (const item of urlsToTry) {
            try {
              const response = await fetch(item.url, { headers: item.headers });

              if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                if (arrayBuffer.byteLength > 200) {
                  const buffer = Buffer.from(arrayBuffer);
                  res.setHeader('Content-Type', 'audio/mpeg');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.setHeader('Cache-Control', 'public, max-age=86400');
                  res.end(buffer);
                  return;
                }
              }
            } catch (e) {
              // continue
            }
          }

          res.statusCode = 502;
          res.end('All TTS providers failed');
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
