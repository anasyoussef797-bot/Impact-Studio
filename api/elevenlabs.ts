import type { Request, Response } from 'express';

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  labels?: {
    gender?: string;
    accent?: string;
    age?: string;
    use_case?: string;
    description?: string;
    language?: string;
    [key: string]: string | undefined;
  };
  preview_url?: string;
  high_quality_base_model_ids?: string[];
}

export async function handleElevenLabsVoices(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(400).json({
      error: 'ELEVENLABS_API_KEY is missing on server environment.',
      hint: 'Please configure ELEVENLABS_API_KEY in server environment settings.'
    });
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.statusText}`,
        details: errText
      });
    }

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.json(data);
  } catch (err: any) {
    console.error('[ElevenLabs Voices API Error]:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch ElevenLabs voices' });
  }
}

export async function generateElevenLabsAudio(text: string, voiceId: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY environment variable is missing on server.');
  }

  const cleanVoiceId = (voiceId || '').trim();
  if (!cleanVoiceId) {
    throw new Error('Missing ElevenLabs Voice ID');
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${cleanVoiceId}?output_format=mp3_44100_128`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`ElevenLabs API HTTP ${response.status}: ${errBody}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
