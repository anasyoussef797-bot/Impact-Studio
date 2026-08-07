import { GoogleGenAI, Modality } from '@google/genai';
import { generateElevenLabsAudio } from './elevenlabs';

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

function getGeminiVoiceConfig(requestedVoice: string, gender: string, role: string, charId: string) {
  const req = (requestedVoice || '').trim();
  const isMale = gender === 'male' || charId.includes('ahmed') || charId.includes('adam') || charId.includes('spark') || charId.includes('rashed') || charId.includes('ali');

  if (req === 'Aoede') {
    return {
      voiceName: 'Aoede',
      personaPrompt: 'You are Aoede. Speak in a warm, expressive, high-pitched youthful female voice.'
    };
  }
  if (req === 'Puck') {
    return {
      voiceName: 'Puck',
      personaPrompt: 'You are Puck. Speak in an energetic, lively, cheerful young boy voice.'
    };
  }
  if (req === 'Callisto') {
    return {
      voiceName: 'Aoede',
      personaPrompt: 'You are Callisto. Speak in a sweet, cheerful, melodic young girl voice.'
    };
  }
  if (req === 'Pegasus') {
    return {
      voiceName: 'Puck',
      personaPrompt: 'You are Pegasus. Speak in a friendly, cheerful, bright young boy voice.'
    };
  }
  if (req === 'Zephyr') {
    return {
      voiceName: 'Aoede',
      personaPrompt: 'You are Zephyr. Speak in a gentle, soft, light young girl voice.'
    };
  }
  if (req === 'Leda') {
    return {
      voiceName: 'Kore',
      personaPrompt: 'You are Leda. Speak in a clear, articulate, professional adult female teacher voice.'
    };
  }
  if (req === 'Fenrir') {
    return {
      voiceName: 'Fenrir',
      personaPrompt: 'You are Fenrir. Speak in a deep, warm, educational adult male teacher voice.'
    };
  }
  if (req === 'Kore') {
    return {
      voiceName: 'Kore',
      personaPrompt: 'You are Kore. Speak in a balanced, articulate female voice.'
    };
  }
  if (req === 'Charon') {
    return {
      voiceName: 'Charon',
      personaPrompt: 'You are Charon. Speak in a deep, resonant, narrative male voice.'
    };
  }
  if (req === 'Orpheus') {
    return {
      voiceName: 'Fenrir',
      personaPrompt: 'You are Orpheus. Speak in a warm, gentle, friendly adult male voice.'
    };
  }
  if (req === 'Miranda') {
    return {
      voiceName: 'Aoede',
      personaPrompt: 'You are Miranda. Speak in a bright, energetic young girl voice.'
    };
  }
  if (req === 'Umbriel') {
    return {
      voiceName: 'Puck',
      personaPrompt: 'You are Umbriel. Speak in a calm, thoughtful young boy voice.'
    };
  }

  // Fallback by role & gender
  if (role === 'teacher' || charId === 'char_ahmed' || charId === 'char_maryam') {
    if (isMale) {
      return { voiceName: 'Fenrir', personaPrompt: 'You are an adult male teacher. Speak in a deep, clear adult male voice.' };
    }
    return { voiceName: 'Kore', personaPrompt: 'You are an adult female teacher. Speak in a clear, articulate adult female voice.' };
  }

  if (isMale) {
    return { voiceName: 'Puck', personaPrompt: 'You are a young boy. Speak in a cheerful, energetic young boy voice.' };
  }

  return { voiceName: 'Aoede', personaPrompt: 'You are a young girl. Speak in a sweet, cheerful young girl voice.' };
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
    const provider = (query.provider || body.provider || 'gemini').toString().toLowerCase();
    const fallbackSetting = (query.fallback || body.fallback || 'off').toString().toLowerCase();

    if (!q) {
      return res.status(400).json({ error: 'Missing required parameter "q" or "text"' });
    }

    // Provider 1: ElevenLabs
    if (provider === 'elevenlabs') {
      try {
        console.log(`[TTS DEBUG] Using ElevenLabs Provider | VoiceID: "${voiceParam}" | Text: "${q.slice(0, 30)}..."`);
        const audioBuffer = await generateElevenLabsAudio(q, voiceParam);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('X-TTS-Engine', 'ElevenLabs-TTS');
        res.setHeader('X-TTS-Model', 'eleven_multilingual_v2');
        res.setHeader('X-TTS-Voice', voiceParam || 'Default');
        res.setHeader('X-TTS-Provider', 'ElevenLabs');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.send(audioBuffer);
      } catch (elErr: any) {
        console.error('[ElevenLabs TTS Error]:', elErr.message);
        if (fallbackSetting === 'on') {
          console.warn('[ElevenLabs Fallback] Falling back to Gemini TTS as fallback=on');
        } else {
          return res.status(502).json({
            error: `ElevenLabs TTS failed: ${elErr.message}`,
            provider: 'elevenlabs',
            hint: 'You can enable "Fallback to Gemini if ElevenLabs fails" in Settings or verify your ElevenLabs API Key.'
          });
        }
      }
    }

    const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(q) || tl.includes('ar');

    const isMale = gender === 'male' || charId.includes('ahmed') || charId.includes('adam') || charId.includes('spark') || charId.includes('rashed') || charId.includes('ali');

    // Gemini Voice Selection Strategy per character identity
    const voiceConfig = getGeminiVoiceConfig(voiceParam, gender, role, charId);
    const geminiVoice = voiceConfig.voiceName;
    const personaPrompt = voiceConfig.personaPrompt;

    console.log(`[TTS DEBUG] Text: "${q.slice(0, 30)}..." | Requested Voice: "${voiceParam}" | Final Gemini Voice: "${geminiVoice}" | Char: "${charId}"`);

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

        const modelsToTry = ['gemini-2.0-flash'];

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
              res.setHeader('X-TTS-Requested-Voice', voiceParam || 'Default');
              res.setHeader('X-Audio-Format', '24000Hz PCM WAV');
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              return res.send(wavBuffer);
            } else {
              console.warn(`[TTS DEBUG] Gemini model ${model} returned no audio data.`);
            }
          } catch (mErr) {
            console.warn(`[TTS DEBUG] Gemini TTS model ${model} attempt failed:`, mErr);
          }
        }
      } catch (gErr) {
        console.warn('[TTS DEBUG] Gemini TTS engine initialization error:', gErr);
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
