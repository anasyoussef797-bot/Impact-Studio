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

export async function handleTTSRequest(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body: any = {};
    if (req.body) {
      if (typeof req.body === 'string') {
        try {
          body = JSON.parse(req.body);
        } catch (e) {
          body = {};
        }
      } else {
        body = req.body;
      }
    }

    const query = req.query || {};
    const q = (query.q || body.text || '').toString().trim();
    const tl = (query.tl || body.language || 'ar').toString().toLowerCase();
    const voiceParam = (query.voice || body.voice || '').toString();
    const gender = (query.gender || body.gender || 'female').toString();
    const charId = (query.charId || body.charId || '').toString();
    const role = (query.role || body.role || 'child').toString();

    if (!q) {
      return res.status(400).json({ error: 'Missing required parameter "q" or "text"' });
    }

    const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(q) || tl.includes('ar');
    const isMale = gender === 'male' || charId.includes('ahmed') || charId.includes('rashed') || charId.includes('ali');

    // Gemini Voice Selection Strategy per character identity
    let geminiVoice = voiceParam;
    let personaPrompt = '';

    if (charId === 'char_lulu' || charId === 'char_noor' || charId === 'char_sara') {
      if (!geminiVoice) geminiVoice = 'Aoede';
      personaPrompt = 'You are a sweet, cheerful 7-year-old young girl. Speak in a high-pitched, cute child girl voice.';
    } else if (charId === 'char_rashed' || charId === 'char_ali') {
      if (!geminiVoice) geminiVoice = 'Puck';
      personaPrompt = 'You are an energetic 8-year-old young boy. Speak in a lively, playful young boy voice.';
    } else if (charId === 'char_maryam' || (role === 'teacher' && !isMale)) {
      if (!geminiVoice) geminiVoice = 'Leda';
      personaPrompt = 'You are a warm, articulate adult female teacher. Speak in a clear, educational adult female voice.';
    } else if (charId === 'char_ahmed' || (role === 'teacher' && isMale)) {
      if (!geminiVoice) geminiVoice = 'Fenrir';
      personaPrompt = 'You are a respected, friendly adult male teacher. Speak in a deep, warm, educational adult male voice.';
    } else if (isMale) {
      if (!geminiVoice) geminiVoice = role === 'teacher' ? 'Fenrir' : 'Puck';
      personaPrompt = role === 'teacher'
        ? 'You are an adult male teacher. Speak in a clear adult male voice.'
        : 'You are a young boy. Speak in a cheerful young boy voice.';
    } else {
      if (!geminiVoice) geminiVoice = role === 'teacher' ? 'Leda' : 'Aoede';
      personaPrompt = role === 'teacher'
        ? 'You are an adult female teacher. Speak in a clear adult female voice.'
        : 'You are a young girl. Speak in a cheerful young girl voice.';
    }

    // Attempt 1: Gemini TTS API (Primary Engine for Arabic & all supported languages)
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        const promptText = isArabic
          ? `${personaPrompt} Please speak the following text in clear, natural, fluent Arabic with proper diacritics and correct pronunciation: "${q}"`
          : `${personaPrompt} Please read the following text clearly: "${q}"`;

        const modelsToTry = ['gemini-2.5-flash', 'gemini-3.1-flash-tts-preview', 'gemini-2.0-flash'];

        for (const model of modelsToTry) {
          try {
            const aiRes = await ai.models.generateContent({
              model,
              contents: [{ parts: [{ text: promptText }] }],
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: geminiVoice }
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
              res.setHeader('X-TTS-Engine', 'Gemini-TTS');
              res.setHeader('X-TTS-Model', model);
              res.setHeader('X-TTS-Voice', geminiVoice);
              res.setHeader('X-Audio-Format', '24000Hz PCM WAV');
              res.setHeader('Cache-Control', 'public, max-age=86400');
              return res.send(wavBuffer);
            }
          } catch (mErr) {
            console.warn(`Gemini TTS model ${model} attempt failed:`, mErr);
          }
        }
      } catch (gErr) {
        console.warn('Gemini TTS engine initialization error:', gErr);
      }
    } else {
      console.warn('GEMINI_API_KEY environment variable is missing on server. Using fallback audio proxies.');
    }

    // Fallback Engine: Server Audio Proxy (StreamElements / Google Translate TTS)
    let fallbackVoice = 'Zeina';
    if (isArabic) {
      if (charId === 'char_lulu') fallbackVoice = 'Laila';
      else if (charId === 'char_noor') fallbackVoice = 'Salma';
      else if (charId === 'char_maryam') fallbackVoice = 'Zeina';
      else if (charId === 'char_sara') fallbackVoice = 'Hala';
      else if (charId === 'char_rashed') fallbackVoice = 'Tarik';
      else if (charId === 'char_ali') fallbackVoice = 'Tarik';
      else if (charId === 'char_ahmed') fallbackVoice = 'Maged';
      else fallbackVoice = isMale ? 'Maged' : 'Zeina';
    } else if (tl.includes('en')) {
      fallbackVoice = isMale ? 'Justin' : 'Ivy';
    }

    const externalProviders = [
      {
        url: `https://api.streamelements.com/kappa/v2/speech?voice=${fallbackVoice}&text=${encodeURIComponent(q)}`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'audio/mp3, audio/*;q=0.9, */*;q=0.8'
        }
      },
      {
        url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${encodeURIComponent(tl)}&client=tw-ob`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
          'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8'
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

    for (const provider of externalProviders) {
      try {
        const response = await fetch(provider.url, { headers: provider.headers });
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          if (arrayBuffer.byteLength > 200) {
            const buffer = Buffer.from(arrayBuffer);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('X-TTS-Engine', 'Server-Audio-Proxy');
            res.setHeader('X-TTS-Model', 'Translate-Proxy');
            res.setHeader('X-Audio-Format', 'MPEG Audio');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.send(buffer);
          }
        }
      } catch (e) {
        // continue
      }
    }

    return res.status(502).json({
      error: 'All server-side TTS audio generation methods failed.',
      hint: apiKey ? 'Check Gemini API quota or server network connectivity.' : 'Missing GEMINI_API_KEY env var on server.'
    });
  } catch (err: any) {
    console.error('TTS Endpoint Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

export default async function handler(req: any, res: any) {
  return handleTTSRequest(req, res);
}
