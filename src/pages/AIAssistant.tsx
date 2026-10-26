import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Globe, BookOpen, Zap, MessageSquare } from 'lucide-react';

type Mode = 'simple' | 'genz' | 'detailed';
type Lang = 'english' | 'hindi' | 'hinglish';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

const sampleResponses: Record<Mode, Record<Lang, string[]>> = {
  simple: {
    english: [
      "Based on your symptoms, it sounds like you might be experiencing a common cold. Here's what I suggest:\n\n• Rest well (7-8 hours)\n• Drink plenty of warm fluids\n• Take steam inhalation\n• Eat light, nutritious food\n\n⚠️ If symptoms persist beyond 5 days or you develop a high fever, please consult a doctor.",
      "Your iron levels are slightly below normal. This is very common and manageable! Here's what helps:\n\n• Take your iron supplement daily\n• Eat iron-rich foods (spinach, dates, jaggery)\n• Pair with vitamin C (lemon water, oranges)\n• Avoid tea/coffee 1 hour before meals\n\nYou're already on the right track with your supplements 💪",
    ],
    hindi: [
      "आपके लक्षणों के आधार पर, यह सामान्य सर्दी-जुकाम लग रहा है। मेरी सलाह:\n\n• अच्छी नींद लें (7-8 घंटे)\n• गर्म तरल पदार्थ पिएं\n• भाप लें\n• हल्का और पौष्टिक खाना खाएं\n\n⚠️ अगर 5 दिन से ज्यादा हो जाए या तेज बुखार आए, तो डॉक्टर से मिलें।",
      "आपका आयरन लेवल थोड़ा कम है। यह बहुत आम बात है! ये उपाय करें:\n\n• रोज आयरन सप्लीमेंट लें\n• आयरन वाले खाने खाएं (पालक, खजूर, गुड़)\n• विटामिन C के साथ लें (नींबू पानी, संतरा)\n• खाने से 1 घंटे पहले चाय/कॉफी न पिएं\n\nआप सही रास्ते पर हैं 💪",
    ],
    hinglish: [
      "Aapke symptoms dekh ke lagta hai ye common cold hai. Kuch suggestions:\n\n• Achi neend lo (7-8 hours)\n• Warm fluids zyada piyo\n• Steam lo\n• Light aur healthy khao\n\n⚠️ Agar 5 din se zyada ho jaye ya high fever aaye, toh doctor se milo zaroor.",
      "Aapka iron level thoda low hai, but don't worry — ye bahut common hai! Try karo:\n\n• Daily iron supplement lo\n• Iron-rich foods khao (palak, dates, gud)\n• Vitamin C ke saath lo (lemon water)\n• Khana se pehle chai/coffee avoid karo\n\nYou're doing great already 💪",
    ],
  },
  genz: {
    english: [
      "bestie, based on what you're telling me, it's giving common cold energy 🤧 but don't stress!\n\nthe vibe check:\n• sleep is your bestie rn — get those 8hrs ✨\n• hydrate like it's your job 💧\n• steam session = self care 🧖‍♀️\n• eat light but make it cute (khichdi slays)\n\nlowkey if it's still acting up after 5 days, go see a doc. no googling at 3am bestie 💀",
      "okay so your iron is a lil low but that's totally normal, don't panic! 💅\n\nthe glow-up plan:\n• pop that iron supplement daily (non-negotiable bestie)\n• iron foods era: spinach, dates, jaggery\n• vitamin C = iron's best friend (lemon water slaps)\n• skip the chai before meals (yes even that one ☕)\n\nyou're literally doing amazing, keep going!! 💗",
    ],
    hindi: [
      "bestie, tumhare symptoms dekh ke lag raha hai ye basic cold hai 🤧 but tension mat lo!\n\nplan simple hai:\n• 8 ghante so jao ✨\n• paani piyo jaise kaam ho 💧\n• steam lo = self care 🧖‍♀️\n• light khao but tasty (khichdi hits different)\n\n5 din baad bhi theek na ho toh doctor ke paas jao. 3am ko Google mat karo 💀",
    ],
    hinglish: [
      "bestie, tumhare symptoms dekh ke clearly common cold vibes aa rahi hain 🤧 but chill!\n\nthe plan:\n• 8 hours sleep — non-negotiable ✨\n• hydrate like your skin depends on it 💧\n• steam session = main character energy 🧖‍♀️\n• light khao but make it aesthetic\n\n5 din baad bhi same situation then doctor visit zaroor. No 3am WebMD sessions 💀",
    ],
  },
  detailed: {
    english: [
      "Based on your reported symptoms (nasal congestion, mild sore throat, low-grade fever of 99.2°F, and fatigue for 2 days), here's my clinical assessment:\n\n**Likely Diagnosis:** Upper Respiratory Tract Infection (URTI) — Common Cold\n\n**Pathophysiology:** Viral infection of the nasal passages and throat, typically caused by rhinoviruses. The inflammatory response causes your symptoms.\n\n**Recommended Management:**\n1. **Rest:** 8-10 hours of sleep to support immune function\n2. **Hydration:** 2.5-3L of fluids daily (warm water, herbal teas, clear soups)\n3. **Symptomatic Relief:**\n   - Steam inhalation 2-3x daily (10 min each)\n   - Salt water gargle (warm water + 1/2 tsp salt) 3x daily\n   - Paracetamol 500mg if fever > 100°F\n4. **Nutrition:** Vitamin C-rich foods, warm soups, avoid cold/oily foods\n\n**Red Flags — Seek immediate medical attention if:**\n- Temperature exceeds 102°F\n- Symptoms worsen after day 5\n- Difficulty breathing\n- Severe headache with neck stiffness\n\n**Expected Recovery:** 5-7 days with proper care.\n\n*Note: This is informational guidance, not a medical diagnosis. Please consult your healthcare provider for personalized medical advice.*",
    ],
    hindi: [
      "आपके बताए गए लक्षणों (नाक बंद, हल्का गला खराब, 99.2°F हल्का बुखार, और 2 दिन से थकान) के आधार पर:\n\n**संभावित निदान:** ऊपरी श्वसन पथ संक्रमण (URTI) — सामान्य सर्दी\n\n**वैज्ञानिक व्याख्या:** राइनोवायरस के कारण नाक और गले में वायरल संक्रमण। सूजन प्रतिक्रिया आपके लक्षणों का कारण बनती है।\n\n**विस्तृत प्रबंधन योजना:**\n1. **विश्राम:** प्रतिरक्षा समर्थन के लिए 8-10 घंटे नींद\n2. **हाइड्रेशन:** दैनिक 2.5-3L तरल\n3. **लक्षण राहत:**\n   - दिन में 2-3 बार भाप (10 मिनट)\n   - नमक पानी से गरारे (दिन में 3 बार)\n   - 100°F से अधिक बुखार पर पैरासिटामोल 500mg\n4. **पोषण:** विटामिन C युक्त खाद्य पदार्थ\n\n**चेतावनी संकेत:** 102°F से अधिक तापमान, 5 दिन बाद बिगड़ते लक्षण, सांस लेने में कठिनाई\n\n*नोट: यह सूचनात्मक मार्गदर्शन है, चिकित्सा निदान नहीं।*",
    ],
    hinglish: [
      "Aapke symptoms (blocked nose, mild sore throat, 99.2°F low fever, 2 din se fatigue) ke basis pe:\n\n**Likely Diagnosis:** Upper Respiratory Tract Infection (URTI) — Common Cold\n\n**Kya ho raha hai body mein:** Rhinovirus ne nasal passages aur throat mein infection kiya hai. Inflammatory response se symptoms aa rahe hain.\n\n**Detailed Management:**\n1. **Rest:** 8-10 hours sleep — immune system ko support karna zaroori hai\n2. **Hydration:** 2.5-3L fluids daily (warm water, herbal teas, clear soups)\n3. **Symptomatic Relief:**\n   - Steam inhalation 2-3x daily (10 min each)\n   - Salt water gargle 3x daily\n   - Paracetamol 500mg if temp > 100°F\n4. **Nutrition:** Vitamin C foods, warm soups\n\n**Red Flags:** 102°F+ temp, 5 din baad worsening, breathing difficulty\n\n*Note: Ye informational guidance hai, medical diagnosis nahi. Doctor se consult karein.*",
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = sampleResponses[mode][lang];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
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
      </div>

      {/* Chat Area */}
      <div className="flex-1 card p-4 overflow-y-auto mb-4" style={{ minHeight: '400px' }}>
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'gradient-blush text-white' : ''}`}
                style={msg.role !== 'user' ? { background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : ''}`}
                  style={msg.role !== 'user' ? { color: 'var(--text-muted)' } : {}}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
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
        />
        <button onClick={handleSend} className="btn-primary flex items-center gap-2">
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
