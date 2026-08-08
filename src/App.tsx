import React, { useState, useEffect } from 'react';
import { BcaSitePreview } from './components/BcaSitePreview';
import { ShieldCheck, PhoneCall, Monitor } from 'lucide-react';

export default function App() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return (
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  });

  useEffect(() => {
    let metaTheme = document.querySelector("meta[name='theme-color']");
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', '#004070');

    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#002D58] md:bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden select-none">
      {/* Mobile Layout: Uses flex-col for mobile with fixed bottom navigation bar */}
      {isMobile ? (
        <div className="flex flex-col w-full h-[100dvh] bg-[#00529C] relative overflow-hidden crisp-gpu">
          <BcaSitePreview />
        </div>
      ) : (
        /* Desktop Layout: Uses grid / layout samping for desktop view */
        <div className="w-full h-[100dvh] flex items-center justify-center p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-6xl h-full max-h-[880px] grid grid-cols-1 md:grid-cols-12 gap-6 items-center justify-center">
            
            {/* Desktop Left / Side Panel (Branding & Overview) */}
            <div className="hidden md:flex md:col-span-5 lg:col-span-6 flex-col justify-center space-y-6 text-white p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#003B73]/90 to-[#001D38]/95 border border-white/10 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center gap-3">
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                  alt="Bank BCA Logo"
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <div className="h-6 w-px bg-cyan-300/30" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Portal Resmi</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                  Pusat Bantuan & Layanan Tanggap Darurat BCA
                </h1>
                <p className="text-sm text-blue-100/90 leading-relaxed">
                  Platform integrasi layanan pemblokiran kartu, bantuan perbankan darurat, pembatalan transaksi, dan pengamanan User ID KlikBCA 24 jam nonstop.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Sistem Enkripsi</span>
                    <span className="text-[10px] text-blue-200">Enkripsi 256-bit</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Halo BCA</span>
                    <span className="text-[10px] text-blue-200">1500888</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-cyan-200/80 font-medium">
                <Monitor className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Tampilan Desktop Responsive (Mode Grid & Layout Samping)</span>
              </div>
            </div>

            {/* Desktop Right / Mobile Screen Preview Frame */}
            <div className="col-span-1 md:col-span-7 lg:col-span-6 h-full max-h-[850px] w-full max-w-[480px] mx-auto bg-[#00529C] shadow-2xl relative overflow-hidden flex flex-col md:border md:border-white/15 md:rounded-3xl crisp-gpu">
              <BcaSitePreview />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

