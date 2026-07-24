import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, User, AlertCircle, Info, ShieldCheck, Cpu } from 'lucide-react';
import { ChatMessage } from '../types';

const QUICK_PROMPTS = [
  'Bagaimana cara blokir Kartu BCA darurat?',
  'Bagaimana alur pembatalan transaksi?',
  'Bagaimana cara amankan User ID?',
  'Layanan apa saja di portal ini?'
];

interface BcaAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BcaAiAssistant: React.FC<BcaAiAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Selamat datang di **Tanya BCA AI**, Asisten Virtual Resmi Bank Central Asia.\n\nSaya siap membantu Anda mengakses **4 Layanan Bantuan Utama** di portal ini:\n\n1. **Blokir Kartu BCA** – Pemblokiran darurat 24/7 kartu Debit, Kredit, & Rekening.\n2. **Amankan Kartu Bank Lain** – Panduan & pengamanan darurat kartu bank mitra.\n3. **Pembatalan Transaksi** – Investigasi & sanggahan transaksi gantung.\n4. **Amankan User ID** – Pemulihan kredensial & penguncian akun sementara.\n\nSilakan pilih salah satu menu di halaman utama atau sampaikan pertanyaan Anda.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setError(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal terhubung dengan Tanya BCA AI.');
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err?.message || 'Maaf, terjadi kendala saat merespons.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-16 sm:right-6 sm:w-[420px] sm:h-[580px] z-50 flex flex-col bg-white border border-slate-200 sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      
      {/* Header - Official BCA Corporate Blue */}
      <div className="bg-[#0066AE] px-4 py-3.5 border-b border-[#00528D] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-white rounded-xl shadow-inner flex items-center justify-center shrink-0 w-8 h-8 overflow-hidden">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
              alt="BCA Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white tracking-wide">Tanya BCA AI</h3>
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-white/30">
                Cerdas
              </span>
            </div>
            <p className="text-[11px] text-blue-100">Asisten Virtual Resmi Perbankan BCA</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              showInfoPanel ? 'bg-white/25 text-white' : 'hover:bg-white/15 text-blue-100 hover:text-white'
            }`}
            title="Tentang AI Aplikasi"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 active:scale-90 text-blue-100 hover:text-white transition-all cursor-pointer"
            title="Tutup Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Panel Explaining the App's AI */}
      {showInfoPanel && (
        <div className="bg-blue-50 border-b border-blue-200 p-3.5 shrink-0 text-xs text-slate-700 animate-in slide-in-from-top-2 duration-150 space-y-2">
          <div className="flex items-center justify-between text-[#0066AE] font-bold">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#0066AE]" />
              <span>Tentang AI Aplikasi (Tanya BCA AI)</span>
            </div>
            <button
              onClick={() => setShowInfoPanel(false)}
              className="text-slate-400 hover:text-slate-600 text-[10px] font-medium"
            >
              Tutup [X]
            </button>
          </div>
          <p className="leading-relaxed text-[11px]">
            <strong>Tanya BCA AI</strong> adalah asisten cerdas berbasis teknologi kecerdasan buatan (Gemini AI) yang dikhususkan untuk melayani kebutuhan perbankan nasabah Bank Central Asia.
          </p>
          <div className="space-y-1 text-[11px] text-slate-600">
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Standar Bahasa Resmi:</strong> Bahasa profesional, ramah, dan terstruktur tanpa simbol berlebihan.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Fokus Layanan Utama:</strong> Mengarahkan solusi darurat ke 4 menu bantuan resmi di portal BCA secara presisi.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Keamanan Data:</strong> Beroperasi 24/7 dan tidak pernah meminta data rahasia seperti PIN, OTP, atau Kata Sandi.</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages Body - Clean White Background */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-white text-xs sm:text-sm">
        
        {/* Permanent AI Explanation Card at top of conversation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 space-y-1 text-[11px] leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#0066AE] font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kecerdasan Buatan Terintegrasi</span>
          </div>
          <p>
            Layanan percakapan cerdas ini didukung oleh model AI perbankan untuk memberikan solusi cepat, tepat, dan resmi terkait layanan bantuan darurat BCA.
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="shrink-0 w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm mt-0.5 p-0.5 overflow-hidden">
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                  alt="BCA AI"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#0066AE] text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                {(() => {
                  // Clean raw HTML tags and markdown header hashes
                  const cleaned = msg.text
                    .replace(/<[^>]*>?/gm, '')
                    .replace(/###\s?/g, '');

                  return cleaned.split('\n').map((line, idx) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx} className="min-h-[1.1rem]">
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={pIdx} className={msg.role === 'user' ? 'font-bold text-white' : 'font-bold text-[#003B73]'}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  });
                })()}
              </div>
              <span className={`block text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="shrink-0 w-7 h-7 rounded-lg bg-[#003B73] flex items-center justify-center text-white mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-[#0066AE] text-xs bg-blue-50 p-3 rounded-2xl w-fit border border-blue-200 animate-pulse">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
              alt="BCA AI Loading"
              referrerPolicy="no-referrer"
              className="w-4 h-4 object-contain animate-spin"
            />
            <span className="font-medium">Tanya BCA AI sedang berpikir...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="shrink-0 text-[10px] sm:text-[11px] bg-blue-50 hover:bg-blue-100 active:scale-95 text-[#0066AE] font-medium border border-blue-200/80 px-2.5 py-1 rounded-full transition-all cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pertanyaan perbankan BCA..."
            disabled={isLoading}
            className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0066AE] focus:ring-1 focus:ring-[#0066AE] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[#0066AE] hover:bg-[#00528D] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

