import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // TTS Proxy Route
  app.get('/api/tts', async (req, res) => {
    try {
      const q = (req.query.q as string) || '';
      const tl = (req.query.tl as string) || 'ar';
      const gender = (req.query.gender as string) || 'female';
      const charId = (req.query.charId as string) || '';

      if (!q) {
        return res.status(400).send('Missing text parameter q');
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
        `https://api.streamelements.com/kappa/v2/speech?voice=${primaryVoice}&text=${encodeURIComponent(q)}`,
        `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}`,
        `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}`,
        `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(q)}&le=${tl}`
      ];

      for (const ttsUrl of urlsToTry) {
        try {
          const response = await fetch(ttsUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });

          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength > 200) {
              const buffer = Buffer.from(arrayBuffer);
              res.setHeader('Content-Type', 'audio/mpeg');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Cache-Control', 'public, max-age=86400');
              return res.send(buffer);
            }
          }
        } catch (e) {
          // continue
        }
      }

      return res.status(502).send('All TTS providers failed');
    } catch (err) {
      console.error('TTS Express API Error:', err);
      res.status(500).send('Server error fetching TTS');
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
