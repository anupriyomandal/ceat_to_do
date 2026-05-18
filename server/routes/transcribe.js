import { Router } from 'express';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    if (!req.body || !req.body.audio) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // Decode base64 audio data
    const base64Audio = req.body.audio.split(',')[1] || req.body.audio;
    const buffer = Buffer.from(base64Audio, 'base64');

    // Write to temp file
    const tmpFile = join(tmpdir(), `whisper-${Date.now()}.webm`);
    writeFileSync(tmpFile, buffer);

    // Send to OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    unlinkSync(tmpFile);

    if (!response.ok) {
      const error = await response.json();
      console.error('Whisper API error:', error);
      return res.status(response.status).json({ error: error.error?.message || 'Transcription failed' });
    }

    const data = await response.json();
    res.json({ text: data.text });
  } catch (err) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

export default router;
