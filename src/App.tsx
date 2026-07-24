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
    <div className="min-h-screen bg-[#00528D] text-slate-100 font-sans antialiased">
      <BcaSitePreview />
    </div>
  );
}
