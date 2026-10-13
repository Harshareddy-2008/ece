import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Volume2, VolumeX, Sparkles, RefreshCw, Copy, Check, Mic, MicOff, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../../types';

interface AiAssistantProps {
  initialPrompt?: string;
  context?: any;
}

const SUGGESTED_PROMPTS = [
  'Derive Op-Amp Inverting Amplifier gain using virtual ground concept.',
  'Why do we use non-blocking (<=) in sequential Verilog instead of blocking (=)?',
  'Generate 5 Viva Voce exam questions with solutions for PN Diode experiment.',
  'Explain Nyquist Sampling Theorem, Aliasing, and Anti-Aliasing filters.',
  'How to bias a BJT Common Emitter amplifier for maximum symmetric output swing?'
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ initialPrompt, context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `### Welcome to ECE LabHub AI Engineering Tutor! ⚡\n\nI am your specialized AI engineering assistant for **Electronics & Communication Engineering (ECE)**.\n\nI can help you with:\n* **Mathematical Derivations**: Step-by-step Fourier, Laplace, Maxwell equations, and circuit laws.\n* **Code & RTL Debugging**: Verilog, VHDL, C/C++, and MATLAB scripts.\n* **Lab Viva Voce Prep**: Comprehensive questions and answers for your practical exams.\n* **Hardware Insights**: BJT/MOSFET biasing, Op-Amps, PCB microstrips, and FPGA architecture.\n\n*Select an explanation depth mode or type your question below:*`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Clean markdown hashes/backticks for clean speech
    const clean = text.replace(/[#*`_~\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          level,
          context,
          history: messages.slice(-5)
        })
      });

      const data = await response.json();
      const botReply = data.reply || data.error || 'Failed to retrieve response.';

      const modelMsg: ChatMessage = {
        id: 'msg-model-' + Date.now(),
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString(),
        source: data.source
      };

      setMessages(prev => [...prev, modelMsg]);
      speakText(botReply);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'model',
        content: `Error connecting to backend AI service: ${err.message}. Please check server connectivity.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[740px]">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              AI ECE Engineering Tutor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Step-by-step derivations, code debugging & viva exam prep</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Explanation Mode Selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <span className="text-[10px] text-slate-400 px-2 font-medium">Depth:</span>
            {(['beginner', 'intermediate', 'advanced'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setLevel(m)}
                className={`px-2.5 py-1 rounded-md capitalize text-[11px] transition-all ${
                  level === m
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Voice Audio Toggle */}
          <button
            onClick={() => {
              if (ttsEnabled) window.speechSynthesis?.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`p-2 rounded-lg border transition-colors ${
              ttsEnabled ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={ttsEnabled ? 'Voice read-aloud active' : 'Enable voice read-aloud'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 text-[11px] transition-all whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 border-b border-slate-800/60 pb-1">
                <span>{msg.role === 'user' ? 'You' : 'AI ECE Professor'} • {msg.timestamp}</span>
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-slate-200 transition-colors flex items-center gap-1"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {/* Message text with basic Markdown formatting */}
              <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
                {msg.content}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin text-cyan-400" />
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-300">Formulating step-by-step engineering solution...</div>
              <div className="text-[11px] text-slate-500">Checking mathematical equations, Verilog syntax, and circuit laws.</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about EDC, signals, Verilog, Op-Amps, KCL/KVL, Maxwell equations, or paste code..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Mode: {level.toUpperCase()} • Context: {context ? JSON.stringify(context.tool || 'Workspace') : 'General ECE'}</span>
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
      </div>
    </div>
  );
};
