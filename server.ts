import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/live' });

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

// Live Voice WebSocket Server for gemini-3.8-live
wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Live API] Client connected to live voice stream');
  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: `You are J.A.R.V.I.S., an intelligent, polite, and technically sharp voice AI assistant built into Arjun A's portfolio.
Arjun A is a final-year Computer Science Engineering student graduating in 2026 from Akshaya College of Engineering and Technology, Coimbatore, Tamil Nadu, India.
He is an expert in AR/VR Development, Blender 3D photorealistic digital twins, Three.js/WebXR, and Autonomous Quad-Rotor Drones (Python & OpenCV).
He completed verified internships at Praya Labs (1:1 facility digital twin), Ozhli Academy (VR Interviewer simulation chamber), and Novitech.
Keep your answers conversational, concise, natural, articulate, and welcoming. Explain his engineering achievements, skills, and background when visitors speak with you.`,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          // Check for audio output chunk
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }

          // Check for model output transcription
          const outputText = (message.serverContent as any)?.outputTranscription?.text;
          if (outputText) {
            clientWs.send(JSON.stringify({ type: 'transcript_model', text: outputText }));
          }

          // Check for user input transcription
          const inputText = (message.serverContent as any)?.inputTranscription?.text;
          if (inputText) {
            clientWs.send(JSON.stringify({ type: 'transcript_user', text: inputText }));
          }

          // Check for turn completion
          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turn_complete' }));
          }

          // Check for interruption
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }
        },
        onerror: (err: any) => {
          console.error('[Live API] Session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', message: err?.message || 'Live session error' }));
          }
        },
        onclose: () => {
          console.log('[Live API] Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'session_ready', message: 'Connected to gemini-3.8-live' }));
  } catch (err: any) {
    console.error('[Live API] Failed to initialize live session:', err);
    clientWs.send(JSON.stringify({ type: 'error', message: err?.message || 'Could not start gemini-3.8-live session' }));
    clientWs.close();
    return;
  }

  clientWs.on('message', (data: any) => {
    try {
      const parsed = JSON.parse(data.toString());

      if (parsed.type === 'audio' && parsed.audio && session) {
        // Send PCM 16kHz base64 audio to gemini-3.8-live
        session.sendRealtimeInput({
          audio: {
            data: parsed.audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } else if (parsed.type === 'text' && parsed.text && session) {
        session.sendRealtimeInput({
          text: parsed.text,
        });
      }
    } catch (err) {
      console.warn('[Live API] Error parsing message from client:', err);
    }
  });

  clientWs.on('close', () => {
    console.log('[Live API] Client disconnected');
    if (session) {
      try {
        session.close();
      } catch (e) {
        // ignore
      }
    }
  });
});

async function start() {
  const isDev = process.env.NODE_ENV !== 'production';
  const PORT = 3000;

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
