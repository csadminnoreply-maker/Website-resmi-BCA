import React from 'react';
import { motion } from 'motion/react';
import { BrandInfo } from '../utils/luhn';

interface Card3DProps {
  isFlipped: boolean;
  cardNumber: string;
  brandInfo: BrandInfo;
  bankName: string;
  cardGradient: string;
  cvvValue: string;
  expiryValue: string;
}

export const Card3D: React.FC<Card3DProps> = ({
  isFlipped,
  cardNumber,
  brandInfo,
  bankName,
  cardGradient,
  cvvValue,
  expiryValue,
}) => {
  return (
    <div className="w-full my-3" style={{ perspective: '1000px', WebkitPerspective: '1000px' }}>
      <motion.div
        className="w-full h-44 sm:h-48 rounded-2xl text-white shadow-xl relative border border-white/20"
        style={{
          background: cardGradient || 'linear-gradient(135deg, #004d85, #0066AE)',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* FRONT CARD */}
        <div
          className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-white/10 to-transparent"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
            WebkitTransform: 'translateZ(1px)',
          }}
        >
          {/* Top row: Bank Name & Brand Info */}
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <span className="font-extrabold text-xs sm:text-sm tracking-wider block drop-shadow-md truncate">
                {bankName || 'BANK BCA'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-cyan-200 font-semibold tracking-wider uppercase block truncate">
                Paspor Digital / Debit
              </span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] sm:text-xs font-black tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs border border-white/30 uppercase whitespace-nowrap inline-block">
                {brandInfo.name}
              </span>
            </div>
          </div>

          {/* Chip & Contactless Icon */}
          <div className="flex items-center gap-2.5 my-1">
            <div className="w-9 h-6.5 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-500/50 shadow-xs flex items-center justify-center relative overflow-hidden shrink-0">
              <div className="w-full h-[1px] bg-amber-700/40 absolute top-2" />
              <div className="w-full h-[1px] bg-amber-700/40 absolute bottom-2" />
              <div className="h-full w-[1px] bg-amber-700/40 absolute left-2.5" />
            </div>
            <svg className="w-4.5 h-4.5 text-white/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 010-7.778M12.354 19.232a9.5 9.5 0 000-13.435M16.596 22.06a13.5 13.5 0 000-19.09" />
            </svg>
          </div>

          {/* Card Number */}
          <div className="min-w-0">
            <div className="text-xs sm:text-base font-mono tracking-wider sm:tracking-widest font-bold drop-shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            {/* Bottom Row: Expiry */}
            <div className="flex justify-between items-end mt-1.5 text-xs">
              <div>
                <span className="text-[8px] text-white/70 block uppercase font-medium">Berlaku S/D</span>
                <span className="font-mono font-bold tracking-wider text-[11px] sm:text-xs">{expiryValue || 'MM/YY'}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[8px] sm:text-[9px] font-bold text-white/90 bg-white/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                  BCA SECURE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK CARD */}
        <div
          className="absolute inset-0 pt-4 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-black/20 to-transparent"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            WebkitTransform: 'rotateY(180deg) translateZ(1px)',
          }}
        >
          <div className="w-full h-10 bg-slate-900 mt-2 shadow-inner" />

          <div className="px-5 my-2">
            <span className="text-[9px] text-white/70 block mb-1">OTORISASI CVV / CVC</span>
            <div className="w-full h-8 bg-white text-slate-900 font-mono font-bold flex items-center justify-end px-3 rounded text-sm tracking-widest shadow-inner">
              {cvvValue ? '•'.repeat(cvvValue.length) : '•••'}
            </div>
          </div>

          <div className="px-5 pb-3 text-[9px] text-white/70 leading-tight text-center">
            Kartu ini dilindungi enkripsi perbankan BCA. Jangan berikan kode CVV kepada siapapun.
          </div>
        </div>
      </motion.div>
    </div>
  );
};
