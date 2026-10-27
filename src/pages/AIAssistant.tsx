import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Globe, BookOpen, Zap, MessageSquare, Trash2, AlertCircle, WifiOff } from 'lucide-react';

type Mode = 'simple' | 'genz' | 'detailed';
type Lang = 'english' | 'hindi' | 'hinglish';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const modeConfig = {
  simple: { icon: BookOpen, label: 'Simple', desc: 'Easy to understand' },
  genz: { icon: Zap, label: 'Gen Z', desc: 'Casual & relatable' },
  detailed: { icon: MessageSquare, label: 'Detailed', desc: 'In-depth explanations' },
};

const langConfig = {
  english: { flag: '🇬🇧', label: 'English' },
  hindi: { flag: '🇮🇳', label: 'हिंदी' },
  hinglish: { flag: '💬', label: 'Hinglish' },
};

// Fallback responses when backend is unavailable
const sampleResponses: Record<Mode, Record<Lang, string[]>> = {
  simple: {
    english: [
      "Based on your symptoms, it sounds like you might be experiencing a common cold. Here's what I suggest:\n\n• Rest well (7-8 hours)\n• Drink plenty of warm fluids\n• Take steam inhalation\n• Eat light, nutritious food\n\n⚠️ If symptoms persist beyond 5 days or you develop a high fever, please consult a doctor.",
      "Your iron levels are slightly below normal. This is very common and manageable! Here's what helps:\n\n• Take your iron supplement daily\n• Eat iron-rich foods (spinach, dates, jaggery)\n• Pair with vitamin C (lemon water, oranges)\n• Avoid tea/coffee 1 hour before meals\n\nYou're already on the right track with your supplements 💪",
    ],
    hindi: [
      "आपके लक्षणों के आधार पर, यह सामान्य सर्दी-जुकाम लग रहा है। मेरी सलाह:\n\n• अच्छी नींद लें (7-8 घंटे)\n• गर्म तरल पदार्थ पिएं\n• भाप लें\n• हल्का और पौष्टिक खाना खाएं\n\n⚠️ अगर 5 दिन से ज्यादा हो जाए या तेज बुखार आए, तो डॉक्टर से मिलें।",
    ],
    hinglish: [
      "Aapke symptoms dekh ke lagta hai ye common cold hai. Kuch suggestions:\n\n• Achi neend lo (7-8 hours)\n• Warm fluids zyada piyo\n• Steam lo\n• Light aur healthy khao\n\n⚠️ Agar 5 din se zyada ho jaye ya high fever aaye, toh doctor se milo zaroor.",
    ],
  },
  genz: {
    english: [
      "bestie, based on what you're telling me, it's giving common cold energy 🤧 but don't stress!\n\nthe vibe check:\n• sleep is your bestie rn — get those 8hrs ✨\n• hydrate like it's your job 💧\n• steam session = self care 🧖‍♀️\n• eat light but make it cute (khichdi slays)\n\nlowkey if it's still acting up after 5 days, go see a doc. no googling at 3am bestie 💀",
    ],
    hindi: [
      "bestie, tumhare symptoms dekh ke lag raha hai ye basic cold hai 🤧 but tension mat lo!\n\nplan simple hai:\n• 8 ghante so jao ✨\n• paani piyo jaise kaam ho 💧\n• steam lo = self care 🧖‍♀️\n• light khao but tasty (khichdi hits different)\n\n5 din baad bhi theek na ho toh doctor ke paas jao.",
    ],
    hinglish: [
      "bestie, tumhare symptoms dekh ke clearly common cold vibes aa rahi hain 🤧 but chill!\n\nthe plan:\n• 8 hours sleep — non-negotiable ✨\n• hydrate like your skin depends on it 💧\n• steam session = main character energy 🧖‍♀️\n\n5 din baad bhi same situation then doctor visit zaroor.",
    ],
  },
  detailed: {
    english: [
      "Based on your reported symptoms, here's my assessment:\n\n**Likely:** Upper Respiratory Tract Infection (URTI) — Common Cold\n\n**Recommended Management:**\n1. Rest: 8-10 hours of sleep\n2. Hydration: 2.5-3L fluids daily\n3. Symptomatic Relief: Steam inhalation 2-3x daily, salt water gargle\n4. Nutrition: Vitamin C-rich foods, warm soups\n\n**Red Flags — Seek medical attention if:**\n- Temperature exceeds 102°F\n- Symptoms worsen after day 5\n- Difficulty breathing\n\n*Note: This is informational guidance. Please consult your healthcare provider.*",
    ],
    hindi: [
      "आपके बताए गए लक्षणों के आधार पर:\n\n**संभावित:** ऊपरी श्वसन पथ संक्रमण — सामान्य सर्दी\n\n**प्रबंधन:**\n1. विश्राम: 8-10 घंटे नींद\n2. हाइड्रेशन: 2.5-3L तरल\n3. लक्षण राहत: भाप, गरारे\n\n*नोट: यह सूचनात्मक मार्गदर्शन है। डॉक्टर से परामर्श करें।*",
    ],
    hinglish: [
      "Aapke symptoms ke basis pe:\n\n**Likely:** URTI — Common Cold\n\n**Management:**\n1. Rest: 8-10 hours sleep\n2. Hydration: 2.5-3L fluids\n3. Relief: Steam, gargle\n\n*Note: Ye informational hai. Doctor se consult karein.*",
    ],
  },
};

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi there! 💗 I'm your AI Health Assistant. I can help you understand symptoms, explain medical terms, and give health tips. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('simple');
  const [lang, setLang] = useState<Lang>('english');
  const [isTyping, setIsTyping] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend availability
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/health', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          setBackendAvailable(data.aiConfigured !== false);
        } else {
          setBackendAvailable(false);
        }
      } catch {
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  const sendMessageViaAPI = async (userContent: string) => {
    const assistantId = `assistant-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(true);

    try {
      abortControllerRef.current = new AbortController();

      // Build message history
      const history = [...messages, { id: 'temp', role: 'user' as const, content: userContent, timestamp: new Date() }]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, mode, language: lang, stream: true }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Streaming not supported');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
                );
              }
            } catch (e) {
              if (e instanceof Error && !e.message.includes('JSON')) throw e;
            }
          }
        }
      }

      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: fullContent || 'No response generated.', isStreaming: false } : m)
      );

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      // Fallback to sample response
      useFallbackResponse(userContent, assistantId);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const useFallbackResponse = (userContent: string, assistantId: string) => {
    setTimeout(() => {
      const responses = sampleResponses[mode][lang];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, content: response, isStreaming: false } : m)
      );
    }, 800);
  };

  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setError(null);

    if (backendAvailable) {
      sendMessageViaAPI(userInput);
    } else {
      // Use fallback
      const assistantId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }]);
      setIsTyping(true);
      useFallbackResponse(userInput, assistantId);
      setTimeout(() => setIsTyping(false), 1000);
    }
  }, [input, isTyping, backendAvailable, mode, lang, messages]);

  const clearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([{
      id: 'new-welcome',
      role: 'assistant',
      content: "Chat cleared! 💗 How can I help you today?",
      timestamp: new Date(),
    }]);
    setError(null);
  };

  const quickQuestions = [
    "I have a headache and feel tired",
    "Explain my low hemoglobin",
    "Tips for better sleep",
    "When should I see a doctor?",
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* Mode & Language Selector */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blush-500" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Mode:</span>
          {(Object.entries(modeConfig) as [Mode, typeof modeConfig.simple][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === key ? 'gradient-blush text-white' : ''}`}
              style={mode !== key ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
            >
              {config.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Globe className="w-4 h-4 text-blush-500" />
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Lang:</span>
          {(Object.entries(langConfig) as [Lang, typeof langConfig.english][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${lang === key ? 'gradient-blush text-white' : ''}`}
              style={lang !== key ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
            >
              {config.flag} {config.label}
            </button>
          ))}
        </div>
        {/* Backend status */}
        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Clear chat">
            <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </button>
          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            backendAvailable === false ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}>
            {backendAvailable === false ? <><WifiOff className="w-3 h-3" /> Fallback Mode</> : <><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> AI Connected</>}
          </span>
        </div>
      </div>

      {/* Backend notice */}
      {backendAvailable === false && (
        <div className="p-3 rounded-xl flex items-start gap-2 mb-4" style={{ background: 'var(--bg-secondary)' }}>
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <strong>Running in fallback mode.</strong> Start the backend server with your NVIDIA API key for real AI responses. See README for setup.
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 card p-4 overflow-y-auto mb-4" style={{ minHeight: '400px' }}>
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'gradient-blush text-white' : ''}`}
                style={msg.role !== 'user' ? { background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 animate-pulse rounded-sm" style={{ background: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'var(--accent)' }}></span>
                )}
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : ''}`}
                  style={msg.role !== 'user' ? { color: 'var(--text-muted)' } : {}}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="px-3 py-2 rounded-xl text-xs flex items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <AlertCircle className="w-3 h-3" /> {error}
                <button onClick={() => setError(null)} className="underline">Dismiss</button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about your health..."
          className="input-field flex-1"
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={!input.trim() || isTyping} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>

      <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
        ⚠️ AI responses are for informational purposes only. Always consult a healthcare professional for medical advice.
      </p>
    </div>
  );
};

export default AIAssistant;
