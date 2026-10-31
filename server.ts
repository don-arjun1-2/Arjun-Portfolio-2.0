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

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

// Multi-turn text chat API for JARVIS chatbot using gemini-3.8-flash
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const systemInstruction = `You are J.A.R.V.I.S., the advanced, polite, and technically sharp artificial intelligence assistant embedded directly into Arjun A's portfolio.
Identity & Persona:
- Name: J.A.R.V.I.S. (Just A Rather Very Intelligent System).
- Tone: Highly articulate, sophisticated, welcoming, concise, technically astute, and supportive of Arjun.
- Role: Introduce Arjun, elaborate on his engineering achievements, explain his technical stack, and answer visitor inquiries.

Key Information About Arjun A:
- Current Status: Final-Year B.E. Computer Science and Engineering student (Semester VII Exam Candidate) at Akshaya College of Engineering and Technology, Coimbatore, Tamil Nadu, India (Batch of 2020 – 2026).
- Core Specialization: AR/VR Development, 3D Digital Twins, Procedural WebXR/Three.js spatial computing, Mobile App Development, and Autonomous Systems (Computer Vision & Drone Telemetry).
- Languages Spoken: Tamil (Native), English (Fluent / Public Speaking), Hindi (Advanced), Malayalam (Advanced).
- Verified Internships:
  1. Praya Labs (Sep 2026): Onsite Junior Intern in AR/VR. Built a 1:1 millimeter-accurate architectural digital twin in Blender with baked PBR global illumination.
  2. Ozhli Academy: AR/VR Intern. Modeled 3D mock interview environment chamber, student training modules, and spatial interaction mechanics.
  3. Novitech: Software Intern. Collaborative development in agile engineering sprints.
- Featured Projects:
  1. ARVR Interviewer: Immersive VR Mock Interview Chamber in Blender, WebXR, Three.js, Spatial Audio API, React, TypeScript.
  2. Praya Labs Office Digital Twin: 1:1 photorealistic digital twin with baked lighting and spatial WebGL navigation.
  3. Autonomous Observation Quad-Rotor Drone: Python, OpenCV, computer vision obstacle avoidance, waypoint telemetry, and PID motor stabilization.
  4. Student Collaborative Learning Mobile App: React Native, TypeScript, Node.js, offline study sync.
- Contact Details:
  - Phone: +91 7305715012
  - Emails: 23cs012@acetcbe.edu.in, arjun4275120@gmail.com
  - Location: Coimbatore, Tamil Nadu, India

Style Guidelines:
- Address the visitor warmly as J.A.R.V.I.S.
- Keep responses concise (typically 2-4 sentences or structured bullet points).
- If asked about hiring, collaborations, or contact details, provide Arjun's phone number or emails politely.`;

    // Convert client message history into Gemini Contents structure
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am online and ready to assist you.';
    res.json({ reply });
  } catch (error: any) {
    console.error('[JARVIS Chat API Error]:', error);
    res.status(500).json({ error: error?.message || 'JARVIS failed to process the request' });
  }
});

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
