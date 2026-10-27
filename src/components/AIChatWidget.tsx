import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Trash2, Sparkles, AlertCircle, Loader2, Bot, User, WifiOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const AIChatWidget: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! 💗 I'm your SheCare AI assistant. I can help you with:\n\n• General health questions\n• Understanding medical reports\n• Medicine reminder tips\n• App navigation help\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if backend is available
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setError(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    // Prepare message history for API (last 10 messages)
    const messageHistory = [...messages, userMessage]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messageHistory,
          mode: 'simple',
          language: 'english',
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Handle streaming response
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
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantMessage.id
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }
            } catch (e) {
              if (e instanceof Error && e.message !== 'Streaming not supported') {
                // Skip parse errors for individual chunks
              }
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? { ...m, content: fullContent || 'I apologize, but I could not generate a response. Please try again.', isStreaming: false }
            : m
        )
      );

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      const errorMessage = err.message || 'Something went wrong';
      setError(errorMessage);

      // Remove the empty assistant message and show error
      setMessages(prev =>
        prev.filter(m => m.id !== assistantMessage.id)
      );

      // If backend not available, show helpful message
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
        setBackendAvailable(false);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, messages]);

  const clearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: "Chat cleared! 💗 How can I help you today?",
      timestamp: new Date(),
    }]);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    'Explain my blood report',
    'Tips for better sleep',
    'When to see a doctor?',
    'Help me track my cycle',
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all group"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
              boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
            }}
            aria-label="Open AI Chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse-soft"></span>
            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow)' }}>
              Ask me anything 💗
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(20, 184, 166, 0.1)',
            }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-blush flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>SheCare AI</h3>
                  <p className="text-xs flex items-center gap-1" style={{ color: backendAvailable === false ? '#ef4444' : 'var(--text-muted)' }}>
                    {backendAvailable === false ? (
                      <><WifiOff className="w-3 h-3" /> Backend offline</>
                    ) : (
                      <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft"></span> Online</>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
                <button
                  onClick={() => { setIsOpen(false); abortControllerRef.current?.abort(); }}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Close"
                >
                  <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '250px', maxHeight: '50vh' }}>
              {backendAvailable === false && (
                <div className="p-3 rounded-xl flex items-start gap-2 mb-4" style={{ background: 'var(--bg-secondary)' }}>
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Backend server not connected</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      To use the AI assistant, start the backend server with your NVIDIA API key. See README for setup instructions.
                    </p>
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'gradient-navy' : 'gradient-teal'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {/* Message bubble */}
                    <div className={`px-3 py-2 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'rounded-tr-sm text-white'
                        : 'rounded-tl-sm'
                    }`}
                      style={msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)' }
                        : { background: 'var(--bg-secondary)', color: 'var(--text-primary)' }
                      }
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 animate-pulse rounded-sm" style={{ background: 'var(--accent)' }}></span>
                      )}
                      <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : ''}`}
                        style={msg.role !== 'user' ? { color: 'var(--text-muted)' } : {}}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full gradient-blush flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex justify-center">
                  <div className="px-3 py-2 rounded-xl text-xs flex items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    <AlertCircle className="w-3 h-3" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-1 underline">Dismiss</button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts (show when only welcome message) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border-color)' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={backendAvailable === false ? "Backend not connected..." : "Ask about your health..."}
                disabled={backendAvailable === false || isLoading}
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || backendAvailable === false}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)' }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* Footer disclaimer */}
            <div className="px-4 pb-2">
              <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
                ⚠️ Not a substitute for professional medical advice
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
