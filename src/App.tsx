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
    metaTheme.setAttribute('content', '#004070');
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-[#00529C] sm:bg-slate-950 flex items-center justify-center text-slate-100 font-sans antialiased overflow-hidden select-none">
      <div className="w-full h-full sm:h-[92vh] sm:max-h-[850px] max-w-[480px] bg-[#00529C] shadow-2xl relative overflow-hidden flex flex-col sm:border sm:border-white/10 sm:rounded-2xl crisp-gpu">
        <BcaSitePreview />
      </div>
    </div>
  );
}
