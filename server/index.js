/**
 * SheCare Backend Server
 * 
 * Secure proxy for NVIDIA AI API.
 * The API key is NEVER exposed to the frontend.
 * 
 * Environment Variables:
 *   NVIDIA_API_KEY - Your NVIDIA API key (required)
 *   PORT - Server port (default: 3001)
 * 
 * Usage:
 *   1. Copy .env.example to .env and add your NVIDIA_API_KEY
 *   2. Run: node server/index.js
 *   3. The frontend will connect to /api/chat on this server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security: CORS - only allow same-origin requests in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'http://localhost:3000']
    : '*',
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiting (simple in-memory, use Redis in production)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean old entries
  const requests = (rateLimitMap.get(ip) || []).filter(t => t > windowStart);
  requests.push(now);
  rateLimitMap.set(ip, requests);

  if (requests.length > RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      retryAfter: Math.ceil((requests[0] + RATE_LIMIT_WINDOW - now) / 1000),
    });
  }
  next();
}

// Validate API key exists
function validateApiKey(req, res, next) {
  if (!process.env.NVIDIA_API_KEY) {
    console.error('ERROR: NVIDIA_API_KEY environment variable is not set!');
    return res.status(503).json({
      error: 'AI service is not configured. Please contact support.',
    });
  }
  next();
}

// System prompt for healthcare assistant behavior
const SYSTEM_PROMPT = `You are MediCare's AI Health Assistant — a warm, empathetic, and highly knowledgeable healthcare companion powered by advanced AI. You feel human-like, personalized, and genuinely caring. You support English, Hindi, and Hinglish fluently.

PERSONALITY & STYLE:
- You are warm, friendly, and conversational — like a knowledgeable friend who happens to be great with health topics.
- You remember context from the conversation and reference previous messages naturally.
- You use the user's name when appropriate and personalize responses.
- You show genuine concern and empathy.
- You use emojis naturally but not excessively (1-3 per response).
- You adapt your tone based on the user's mood and the seriousness of their query.

CONVERSATION MEMORY:
- Reference previous parts of the conversation naturally ("Earlier you mentioned...", "Building on what you said...").
- If the user shares personal details, remember and use them contextually.
- Follow up on topics the user seems concerned about.
- If the user seems anxious, be extra reassuring.

IMPORTANT SAFETY RULES:
1. You are NOT a doctor. Never diagnose conditions or prescribe medicines independently.
2. You CAN explain medical terms, help understand lab reports in simple language, provide general health tips, and guide users through the app.
3. Always encourage users to consult qualified healthcare professionals for medical decisions.
4. If a user describes emergency symptoms (chest pain, difficulty breathing, severe bleeding, loss of consciousness, suicidal thoughts), IMMEDIATELY advise them to call 112 (India's emergency number) or visit the nearest hospital. Make this prominent.
5. Never provide specific dosages or tell users to start/stop medications.
6. If asked about mental health crises, provide the NIMHANS helpline: 08046110007 and iCall: 9152987821.
7. Keep responses concise but thorough. Use bullet points for clarity.
8. For Hindi/Hinglish queries, respond in the same language/script naturally.

You help users with:
- Understanding general health symptoms (with appropriate disclaimers)
- Explaining medical report values in simple, relatable terms
- Medicine reminder guidance (when to take, general tips, food interactions)
- App navigation help (Dashboard, Reports, Prescriptions, Cycle tracking, etc.)
- Wellness tips (sleep, hydration, nutrition, exercise, stress management)
- Cycle tracking questions and predictions
- Emergency guidance and first aid basics
- Mental health support and coping strategies

RESPONSE FORMAT:
- Start with a warm acknowledgment of what the user shared
- Provide clear, structured information
- End with encouragement or a follow-up question when appropriate
- Use **bold** for key terms and bullet points for lists

Remember: You are a COMPANION, not a REPLACEMENT for medical professionals. Always prioritize user safety.`;

/**
 * POST /api/chat
 * 
 * Request body:
 *   - messages: Array of {role: 'user'|'assistant', content: string}
 *   - mode: 'simple' | 'genz' | 'detailed' (optional)
 *   - language: 'english' | 'hindi' | 'hinglish' (optional)
 *   - stream: boolean (optional, default: true)
 * 
 * Response: Streaming SSE or JSON
 */
app.post('/api/chat', rateLimit, validateApiKey, async (req, res) => {
  const { messages, mode = 'simple', language = 'english', stream = true } = req.body;

  // Validate input
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required and cannot be empty.' });
  }

  // Validate message structure
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return res.status(400).json({ error: 'Each message must have role and content.' });
    }
    if (!['user', 'assistant'].includes(msg.role)) {
      return res.status(400).json({ error: 'Message role must be "user" or "assistant".' });
    }
    if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }
  }

  // Build mode-specific instructions
  const modeInstructions = {
    simple: 'Respond in simple, easy-to-understand language. Use short sentences and bullet points.',
    genz: 'Respond in a casual, relatable Gen Z tone. Use modern slang appropriately, be fun but still informative. Include relevant emojis.',
    detailed: 'Respond with comprehensive, detailed explanations. Include medical context, reasoning, and thorough guidance.',
  };

  const languageInstructions = {
    english: 'Respond in English.',
    hindi: 'Respond in Hindi (Devanagari script).',
    hinglish: 'Respond in Hinglish (Hindi written in Roman/English script with English words mixed in).',
  };

  const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nCurrent mode: ${mode}. ${modeInstructions[mode]}\n${languageInstructions[language]}`;

  // Prepare messages for NVIDIA API
  const apiMessages = [
    { role: 'system', content: fullSystemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  try {
    if (stream) {
      // Streaming response using Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'minimaxai/minimax-m3.1-flash',
          messages: apiMessages,
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('NVIDIA API error:', response.status, errorText);
        
        let errorMessage = 'AI service is temporarily unavailable. Please try again.';
        if (response.status === 429) {
          errorMessage = 'AI service is busy. Please wait a moment and try again.';
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = 'AI service authentication failed. Please contact support.';
        }
        
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      }

      // Pipe the stream from NVIDIA to the client
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  res.write('data: [DONE]\n\n');
                } else {
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    if (content) {
                      res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    }
                  } catch (e) {
                    // Skip malformed JSON chunks
                  }
                }
              }
            }
          }
          res.end();
        } catch (streamError) {
          console.error('Stream error:', streamError);
          res.write(`data: ${JSON.stringify({ error: 'Connection interrupted. Please try again.' })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
        }
      };

      processStream();

      // Handle client disconnect
      req.on('close', () => {
        reader.cancel();
      });

    } else {
      // Non-streaming response
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'minimaxai/minimax-m3.1-flash',
          messages: apiMessages,
          stream: false,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error('NVIDIA API error:', response.status);
        return res.status(502).json({ error: 'AI service is temporarily unavailable. Please try again.' });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      res.json({ content, model: data.model });
    }

  } catch (error) {
    console.error('Server error:', error);
    
    if (stream) {
      res.write(`data: ${JSON.stringify({ error: 'An unexpected error occurred. Please try again.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SheCare AI Backend',
    aiConfigured: !!process.env.NVIDIA_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Serve static files in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`\n🌸 SheCare Backend Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔒 API Key configured: ${process.env.NVIDIA_API_KEY ? 'Yes ✓' : 'No ✗ (set NVIDIA_API_KEY in .env)'}`);
  console.log(`\n⚠️  Make sure NVIDIA_API_KEY is set in your .env file`);
  console.log(`   The key is NEVER exposed to the frontend.\n`);
});
