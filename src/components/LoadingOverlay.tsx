import React from 'react';

interface LoadingOverlayProps {
  countdown: number;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  countdown,
  message = 'Memproses Permintaan Anda...',
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4 border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#0066AE] animate-spin" />
          <span className="absolute text-xl font-extrabold text-[#0066AE]">
            {countdown}
          </span>
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-800">{message}</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Mohon jangan tutup halaman ini. Data Anda sedang dikirim dan diverifikasi secara aman.
          </p>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#0066AE] h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, ((6 - countdown) / 6) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
