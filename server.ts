import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleTTSRequest } from './api/tts';
import { handleElevenLabsVoices } from './api/elevenlabs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ElevenLabs Voices Route
  app.all('/api/elevenlabs/voices', (req, res) => {
    handleElevenLabsVoices(req, res);
  });

  // Unified TTS Route (Delegates to serverless & Cloud Run handler)
  app.all('/api/tts', (req, res) => {
    handleTTSRequest(req, res);
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
