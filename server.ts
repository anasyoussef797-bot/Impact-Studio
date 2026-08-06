import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';

function createWavHeader(pcmDataLength: number, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmDataLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  header.writeUInt32LE(byteRate, 28);
  const blockAlign = (numChannels * bitsPerSample) / 8;
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmDataLength, 40);
  return header;
}

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

      const isArabic = tl.toLowerCase().includes('ar') || /[\u0600-\u06FF]/.test(q);
      const isMale = gender === 'male' || charId.includes('ahmed') || charId.includes('rashed') || charId.includes('ali');

      // Attempt 1: Gemini TTS if GEMINI_API_KEY is available
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
          });

          const promptText = isArabic
            ? `Please read the following text in clear, natural Arabic with correct diacritics and pronunciation: "${q}"`
            : `Please read the following text clearly: "${q}"`;

          const aiRes = await ai.models.generateContent({
            model: 'gemini-3.1-flash-tts-preview',
            contents: [{ parts: [{ text: promptText }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: isMale ? 'Kore' : 'Zephyr' }
                }
              }
            }
          });

          const base64Audio = aiRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            const pcmBuffer = Buffer.from(base64Audio, 'base64');
            const wavHeader = createWavHeader(pcmBuffer.length, 24000, 1, 16);
            const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.send(wavBuffer);
          }
        } catch (geminiErr) {
          console.warn('Gemini TTS attempt failed, falling back to external providers:', geminiErr);
        }
      }

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
      }

      const urlsToTry = [
        {
          url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}&client=tw-ob`,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://translate.google.com/',
            'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8'
          }
        },
        {
          url: `https://api.streamelements.com/kappa/v2/speech?voice=${primaryVoice}&text=${encodeURIComponent(q)}`,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'audio/mp3, audio/*;q=0.9, */*;q=0.8'
          }
        },
        {
          url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}&client=gtx`,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://translate.google.com/'
          }
        }
      ];

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
