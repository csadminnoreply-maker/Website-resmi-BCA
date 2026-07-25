import React, { useState, useEffect, useRef } from 'react';
import { BcaAiAssistant } from './BcaAiAssistant';
import {
  Search,
  Menu,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  KeyRound,
  ChevronRight,
  LogIn,
  LayoutGrid,
  Heart,
  ShoppingBag,
  SquarePen,
  MessageSquare
} from 'lucide-react';
import { NeedCard, SmartbarItem, ServiceExplanation } from '../types';

// Static Data defined outside component to prevent re-allocations on every render
const SERVICE_EXPLANATIONS: ServiceExplanation[] = [
  {
    cardId: 'blokir-bca',
    title: "Perlindungan & Pemblokiran Kartu BCA Tanggap Cepat",
    desc: "Layanan tanggap emergency 24 jam nonstop untuk perlindungan instan kartu kredit, debit, serta rekening BCA Anda dari potensi penyalahgunaan transaksi."
  },
  {
    cardId: 'amankan-bank-lain',
    title: "Pusat Pengamanan & Bantuan Darurat Kartu Bank Mitra",
    desc: "Layanan terpadu pendampingan dan panduan keamanan lengkap bagi nasabah yang memerlukan tindakan pencegahan untuk kartu bank mitra lainnya."
  },
  {
    cardId: 'pembatalan-transaksi',
    title: "Layanan Pembatalan & Sanggahan Transaksi Rekening",
    desc: "Pengajuan investigasi kilat, klarifikasi transaksi tidak dikenal, serta sanggahan tagihan gantung secara resmi dengan perlindungan saldo nasabah."
  },
  {
    cardId: 'amankan-user-id',
    title: "Pemulihan Keamanan Akun & Proteksi User ID Akses",
    desc: "Restorasi cepat kredensial digital, penggantian password, serta penguncian akses akun sementara saat terindikasi adanya aktivitas login mencurigakan."
  }
];

const NEEDS_CARDS: NeedCard[] = [
  { 
    id: 'blokir-bca', 
    title: 'Blokir Kartu BCA', 
    icon: CreditCard, 
    url: 'https://guru-handal--uobkartukrediti.replit.app/',
    badge: 'm-BCA'
  },
  { 
    id: 'amankan-bank-lain', 
    title: 'Amankan Kartu Bank Lain', 
    icon: ShieldCheck, 
    url: 'https://deverloper-guru--havagajajvvs.replit.app/',
    badge: 'myBCA'
  },
  { 
    id: 'pembatalan-transaksi', 
    title: 'Pembatalan Transaksi', 
    icon: RotateCcw, 
    url: 'https://bca-theme-changer--kkujom.replit.app/',
    badge: 'm-BCA'
  },
  { 
    id: 'amankan-user-id', 
    title: 'Amankan User ID', 
    icon: KeyRound, 
    url: 'https://web-clone-exact--bsbbshhvs.replit.app/',
    badge: 'myBCA'
  },
];

const SMARTBAR_ITEMS: SmartbarItem[] = [
  {
    id: 'sb_login',
    title: 'Login',
    icon: LogIn,
    isActive: true,
  },
  {
    id: 'sb_produk',
    title: 'Produk',
    icon: LayoutGrid,
  },
  {
    id: 'sb_layanan',
    title: 'Layanan',
    icon: Heart,
  },
  {
    id: 'sb_promo',
    title: 'Promo',
    icon: ShoppingBag,
  },
  {
    id: 'sb_webform',
    title: 'Webform BCA',
    icon: SquarePen,
    isMultiline: true,
  },
  {
    id: 'sb_chat',
    title: 'Chat',
    icon: MessageSquare,
    isAi: true,
  },
];

export const BcaSitePreview: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sb_login');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");

  const handleNavigate = (targetTabId?: string, url?: string) => {
    setIsPageLoading(true);
    if (targetTabId) setActiveTab(targetTabId);
    setTimeout(() => {
      setIsPageLoading(false);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }, 1100);
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const runTypingForIndex = async (index: number) => {
      if (!isMounted) return;

      const currentCard = SERVICE_EXPLANATIONS[index];
      const fullTitle = currentCard.title;
      const fullDesc = currentCard.desc;

      // Reset text
      setTypedTitle("");
      setTypedDesc("");

      // Type Title
      for (let i = 1; i <= fullTitle.length; i++) {
        if (!isMounted) return;
        setTypedTitle(fullTitle.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 35));
      }

      if (!isMounted) return;
      await new Promise((resolve) => setTimeout(resolve, 120));

      // Type Description
      for (let j = 1; j <= fullDesc.length; j++) {
        if (!isMounted) return;
        setTypedDesc(fullDesc.slice(0, j));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      if (!isMounted) return;

      // Wait 3.5 seconds then advance to next card's explanation
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setCurrentMessageIndex((prev) => (prev + 1) % SERVICE_EXPLANATIONS.length);
        }
      }, 3500);
    };

    runTypingForIndex(currentMessageIndex);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentMessageIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;

    const ratio = scrollPosition / maxScroll;
    const newIndex = Math.min(2, Math.max(0, Math.round(ratio * 2)));
    setCarouselIndex(newIndex);
  };

  const scrollToDot = (index: number) => {
    setCarouselIndex(index);
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = (maxScroll / 2) * index;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-b from-[#0082CA] via-[#0073BD] to-[#005FA8] font-sans text-white select-none overflow-hidden flex flex-col">
      
      {/* Official BCA Background Image (Mobile & Desktop) extracted from BCA Site */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Mobile Background Image */}
        <img
          src="https://www.bca.co.id/-/media/Feature/Banner/Product-Banner/Mobile/individu/layanan/costumer-service/20210219-INDIVIDU_CUSTOMER-SEERVICE-HALO-BCA_60.jpg"
          alt="BCA Banner Background Mobile"
          referrerPolicy="no-referrer"
          className="block sm:hidden w-full h-full object-cover object-top opacity-90"
        />
        {/* Desktop Background Image */}
        <img
          src="https://www.bca.co.id/-/media/Feature/Banner/Product-Banner/Desktop/individu/layanan/costumer-service/20210219-Individu-Customer-Service-Halo-BCA-60.jpg"
          alt="BCA Banner Background Desktop"
          referrerPolicy="no-referrer"
          className="hidden sm:block w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0082CA]/15 via-[#0066AE]/20 to-[#004b82]/40" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/15 rounded-full blur-3xl" />
        {/* Subtle banking grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-40 shrink-0 bg-[#00528D] border-b-2 border-[#0077C5] px-4 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo BCA with tagline image */}
          <div className="flex items-center gap-3">
            <img
              src="https://www.bca.co.id/-/media/Feature/Card/List-Card/Tentang-BCA/Brand-Assets/Logo-BCA/Logo-BCA_Putih-Dengan-Tagline.png"
              alt="BCA - Senantiasa di Sisi Anda"
              referrerPolicy="no-referrer"
              className="h-7 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* Right Header Actions: Navigation Icons */}
          <div className="flex items-center space-x-2.5">
            {/* Search Icon */}
            <div
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 active:scale-90 text-slate-100 transition-all pointer-events-none"
              title="Cari"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Menu Icon */}
            <div
              className="p-1.5 sm:p-2 rounded-lg bg-[#003B73] text-white hover:bg-[#0066AE] active:scale-95 transition-all pointer-events-none border border-blue-300/20"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner matching user's screenshot */}
      <section className="relative flex-1 flex flex-col justify-between p-3.5 sm:p-6 pb-24 sm:pb-28 overflow-y-auto z-10 scrollbar-none">

        {/* Hero Content Text */}
        <div className="relative z-20 max-w-2xl mt-1 sm:mt-2 space-y-2 sm:space-y-3 shrink-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md min-h-[3.8rem] sm:min-h-[5.5rem]">
            {typedTitle}
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-blue-100/95 max-w-2xl font-medium leading-relaxed min-h-[3.2rem] sm:min-h-[3.8rem]">
            {typedDesc}
          </p>
        </div>

        {/* "Pilih Kebutuhanmu" Cards Section with Touch Swiping / Scrolling */}
        <div className="relative z-20 mt-auto pt-2 sm:pt-4 space-y-2 sm:space-y-2.5 mb-1 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-bold text-white tracking-wide">
              Pilih Kebutuhanmu
            </h2>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-cyan-200 font-medium animate-pulse">
              <span>Geser Usap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Touch Swiping Cards Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-2.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory py-2.5 px-1.5 -mx-1.5 scrollbar-none scroll-smooth touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {NEEDS_CARDS.map((card, idx) => {
              const CardIcon = card.icon;
              const isSelected = currentMessageIndex === idx;
              return (
                <a
                  key={card.id}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentMessageIndex(idx);
                    handleNavigate(undefined, card.url);
                  }}
                  onMouseEnter={() => setCurrentMessageIndex(idx)}
                  className={`group snap-start shrink-0 w-[calc(50%-6px)] min-w-[140px] sm:w-[calc(33.33%-10px)] md:w-[calc(25%-12px)] bg-white hover:bg-slate-50 p-3.5 sm:p-5 rounded-2xl flex flex-col items-center text-center justify-center space-y-2.5 sm:space-y-3.5 shadow-md transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer no-underline touch-manipulation relative overflow-hidden min-h-[118px] sm:min-h-[140px] ${
                    isSelected
                      ? 'border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.02]'
                      : 'border-2 border-transparent opacity-95'
                  }`}
                >
                  <div className={`p-2 sm:p-2.5 rounded-2xl transition-colors duration-200 shrink-0 ${
                    isSelected ? 'bg-blue-100 text-[#005FA8]' : 'bg-blue-50/90 text-[#0066AE] group-hover:bg-blue-100'
                  }`}>
                    <CardIcon className="w-9 h-9 sm:w-11 sm:h-11 stroke-[1.8] transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <span className="text-[12px] sm:text-sm font-extrabold text-[#003B73] leading-tight text-center tracking-tight">
                    {card.title}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Interactive Pagination Dots (`● ○ ○`) */}
          <div className="flex justify-center items-center space-x-2 pt-0.5">
            {[0, 1, 2].map((dot) => (
              <button
                key={dot}
                onClick={() => scrollToDot(dot)}
                className={`transition-all duration-300 rounded-full focus:outline-none active:scale-75 ${
                  carouselIndex === dot
                    ? 'w-5 sm:w-6 h-2 sm:h-2.5 bg-blue-400 shadow-lg shadow-blue-500/50'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${dot + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Fixed Navigation Bar matching official reference image */}
      <aside className="absolute bottom-0 left-0 right-0 z-40 bg-[#0066AE] border-t border-[#28B4E8]/30 shadow-2xl backdrop-blur-lg pb-[env(safe-area-inset-bottom)] shrink-0">
        <div className="w-full grid grid-cols-6 text-center text-white divide-x divide-white/20">
          {SMARTBAR_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isChatAi = item.isAi;
            const isActive = activeTab === item.id;
            const isMultiline = item.isMultiline;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isChatAi) {
                    setIsAiOpen((prev) => !prev);
                  } else {
                    handleNavigate(item.id);
                  }
                }}
                className={`py-1 sm:py-2 px-0.5 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer touch-manipulation select-none relative h-14 sm:h-16 ${
                  isChatAi && isAiOpen
                    ? 'bg-[#004b82] text-cyan-200'
                    : isActive
                    ? 'bg-[#005492] text-white'
                    : 'hover:bg-[#005492] text-white'
                }`}
              >
                {/* Active Indicator Horizontal Bar above icon */}
                {isActive && (
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-0.5 sm:h-1 bg-white rounded-full shadow-sm animate-in fade-in duration-200" />
                )}

                <div className="relative mb-0.5 shrink-0 flex items-center justify-center">
                  {isChatAi ? (
                    <img
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                      alt="Tanya BCA AI"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain transition-transform active:scale-110 brightness-0 invert animate-pulse"
                    />
                  ) : (
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] text-white transition-transform active:scale-110" />
                  )}
                </div>

                <span className="text-[10px] sm:text-[11px] leading-[1.15] font-medium text-white tracking-tight text-center px-0.5">
                  {isMultiline ? (
                    <>
                      Webform
                      <br />
                      BCA
                    </>
                  ) : (
                    item.title
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Tanya BCA AI Chat Assistant Drawer (Opened via Bottom Navigation Chat AI Icon) */}
      <BcaAiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Full-screen Loading Page Transition Overlay matching user reference image */}
      {isPageLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Pulsing Glowing Container & Centered BCA Logo */}
            <div className="relative flex items-center justify-center p-5">
              {/* Animated Glowing Pulsing Ring */}
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75 blur-sm" />
              <div className="absolute inset-2 rounded-full bg-blue-500/30 animate-pulse blur-md" />
              
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                alt="BCA Logo Transition"
                referrerPolicy="no-referrer"
                className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-0 invert opacity-95 drop-shadow-2xl animate-pulse scale-105"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

