import React, { useEffect } from 'react';
import { BcaSitePreview } from './components/BcaSitePreview';

export default function App() {
  useEffect(() => {
    let metaTheme = document.querySelector("meta[name='theme-color']");
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute('content', '#00528D');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 font-sans antialiased overflow-hidden">
      <div className="w-full max-w-[480px] h-[100dvh] max-h-[100dvh] bg-[#00528D] shadow-2xl relative overflow-hidden flex flex-col sm:border sm:border-white/10 sm:rounded-2xl">
        <BcaSitePreview />
      </div>
    </div>
  );
}
