import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, AlertCircle, Phone, ShieldAlert, Copy, ExternalLink, FileText, Headphones, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { triggerHaptic } from '../utils/haptics';

const formatMessageContent = (text: string, role: 'user' | 'assistant') => {
  const cleaned = text.replace(/<[^>]*>?/gm, '').replace(/###\s?/g, '');
  return cleaned.split('\n').map((line, idx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} className="min-h-[1.1rem]">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className={role === 'user' ? 'font-bold text-white' : 'font-bold text-[#003B73]'}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
};

const BcaBotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1" fill="currentColor" />
    <rect x="8" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <rect x="14" y="9" width="2" height="2" rx="0.5" fill="currentColor" />
    <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="2" y="10" width="2" height="4" rx="1" fill="currentColor" />
    <rect x="20" y="10" width="2" height="4" rx="1" fill="currentColor" />
  </svg>
);

const QUICK_OPTIONS = [
  'Blokir Kartu BCA',
  'Pembatalan Transaksi',
  'Amankan User ID',
  'Produk & Promo',
  'Layanan Halo BCA'
];

interface InChatButton {
  label: string;
  icon: React.ReactNode;
  actionType: 'call' | 'copy' | 'prompt';
  value: string;
}

const getInChatActionButtons = (text: string): InChatButton[] => {
  const lower = text.toLowerCase();
  const buttons: InChatButton[] = [];

  if (lower.includes('blokir') || lower.includes('kartu') || lower.includes('darurat')) {
    buttons.push({
      label: 'Proses Blokir Kartu',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
      actionType: 'prompt',
      value: 'Bagaimana cara langsung blokir kartu Debit/Kredit saya sekarang?'
    });
    buttons.push({
      label: 'Hubungi Halo BCA 1500888',
      icon: <Phone className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'call',
      value: '1500888'
    });
  } else if (lower.includes('saldo') || lower.includes('mutasi') || lower.includes('rekening')) {
    buttons.push({
      label: 'Langkah Cek Saldo myBCA',
      icon: <ExternalLink className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'prompt',
      value: 'Tampilkan langkah-langkah akses mutasi dan info saldo di myBCA'
    });
    buttons.push({
      label: 'Hubungi Halo BCA',
      icon: <Phone className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'call',
      value: '1500888'
    });
  } else if (lower.includes('transfer') || lower.includes('bi-fast') || lower.includes('limit')) {
    buttons.push({
      label: 'Info Limit Transfer',
      icon: <FileText className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'prompt',
      value: 'Berapa limit harian transfer antarbank dan BI-FAST?'
    });
    buttons.push({
      label: 'Hubungi CS BCA',
      icon: <Headphones className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'call',
      value: '1500888'
    });
  } else {
    buttons.push({
      label: 'Salin Jawaban',
      icon: <Copy className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'copy',
      value: text
    });
    buttons.push({
      label: 'Hubungi Halo BCA 1500888',
      icon: <Phone className="w-3.5 h-3.5 text-[#004070]" />,
      actionType: 'call',
      value: '1500888'
    });
  }

  return buttons;
};

interface BcaAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BcaAiAssistant: React.FC<BcaAiAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleActionButtonClick = (btn: InChatButton) => {
    triggerHaptic(12);
    if (btn.actionType === 'call') {
      window.open(`tel:${btn.value}`, '_self');
      showNotification(`Menghubungi Halo BCA ${btn.value}...`);
    } else if (btn.actionType === 'copy') {
      navigator.clipboard?.writeText(btn.value);
      showNotification('Teks berhasil disalin ke papan klip!');
    } else if (btn.actionType === 'prompt') {
      handleSendMessage(btn.value);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInput('');
      setError(null);
    } else {
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleClose = () => {
    triggerHaptic(10);
    setMessages([]);
    setInput('');
    setError(null);
    onClose();
  };

  const handleSendMessage = async (textToSend?: string) => {
    triggerHaptic(14);
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
        throw new Error(data.error || 'Gagal terhubung dengan Live Chat BCA.');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="absolute inset-0 z-50 flex flex-col bg-[#F2F4F8] overflow-hidden font-sans"
        >
          {/* Top Header matching 1:1 screenshot */}
      <header className="bg-[#FFFFFF] shrink-0 border-b border-slate-200 shadow-xs">
        {/* Row 1: BCA Logo & Hamburger / Close Button */}
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
              alt="BCA Logo"
              referrerPolicy="no-referrer"
              className="h-8 sm:h-9 object-contain"
            />
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-95 text-[#00529C] transition-all cursor-pointer font-bold"
            aria-label="Tutup Chat"
          >
            <X className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Row 2: Avatar, Title "Live Chat BCA", & "Online" status */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#00529C] flex items-center justify-center text-white shrink-0 shadow-sm relative">
              <BcaBotIcon className="w-6 h-6 text-white" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                  Tanya BCA Virtual Assistant
                </h2>
                <CheckCircle2 className="w-4 h-4 text-[#00529C] fill-blue-100 shrink-0" />
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs font-bold">
                <span className="text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Online 24/7
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold">CS Resmi Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-slate-900 text-sm">
        
        {/* Default Welcome Message Cards matching screenshot 1:1 */}
        <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-sm border border-slate-200/90 max-w-[92%] leading-relaxed text-slate-900 font-semibold">
          Halo! Selamat datang di Tanya BCA Virtual Assistant. Saya siap memandu Anda mengenai seluruh layanan yang tersedia di aplikasi ini. 😊
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl p-4 shadow-sm border border-slate-200/90 max-w-[92%] leading-relaxed text-slate-900 font-semibold">
          Silakan pilih layanan bantuan aplikasi yang Anda butuhkan:
        </div>

        {/* Quick Option Pills matching 1:1 screenshot */}
        <div className="flex flex-wrap gap-2.5 pt-1 max-w-[98%] pb-1">
          {QUICK_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSendMessage(opt)}
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-[#FFFFFF] border-2 border-[#00529C] text-[#00529C] font-extrabold text-xs sm:text-sm shadow-xs hover:bg-blue-50 active:bg-[#00529C] active:text-white transition-all duration-75 active:scale-90 cursor-pointer disabled:opacity-50"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Dynamic Chat Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] px-4 py-3 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#00529C] text-white rounded-tr-none font-semibold'
                  : 'bg-[#FFFFFF] text-slate-900 font-medium rounded-tl-none border border-slate-200/90'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                {formatMessageContent(msg.text, msg.role)}
              </div>
              <span className={`block text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {/* In-Chat Interactive Action Buttons for Assistant Responses */}
            {msg.role === 'assistant' && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {getInChatActionButtons(msg.text).map((btn, btnIdx) => (
                  <button
                    key={btnIdx}
                    onClick={() => handleActionButtonClick(btn)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[#00529C] font-bold text-xs shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {btn.icon}
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-2xl w-fit shadow-xs border border-slate-100/80 text-[#00529C] text-xs font-medium animate-pulse">
            <BcaBotIcon className="w-5 h-5 text-[#00529C] animate-bounce" />
            <span>Virtual Assistant sedang mengetik...</span>
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

      {/* Action Toast Notification */}
      {toastMessage && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#00529C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl border border-cyan-300/40 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Input Bar matching 1:1 screenshot */}
      <footer className="p-3.5 sm:p-4 bg-[#F2F4F8] border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda..."
            disabled={isLoading}
            className="flex-1 bg-[#FFFFFF] border border-slate-300 rounded-full px-5 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:border-[#00529C] focus:ring-1 focus:ring-[#00529C] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
              input.trim() && !isLoading
                ? 'bg-[#00529C] text-white hover:bg-[#00407A]'
                : 'bg-slate-200/90 text-slate-400'
            }`}
            aria-label="Kirim Pesan"
          >
            <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
          </button>
        </form>
      </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


