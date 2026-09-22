"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Zap, ShieldCheck, Users, Play, ArrowRight, Heart, CheckCircle2, User, Wallet, Headphones } from "lucide-react";

interface HeroBannerProps {
  onTopUpClick?: () => void;
  onHowToOrderClick?: () => void;
}

export default function HeroBanner({ onTopUpClick, onHowToOrderClick }: HeroBannerProps) {
  const [username, setUsername] = useState("");
  const [selectedNominal, setSelectedNominal] = useState(1200);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<string | null>(null);
  
  // Custom Slider & Scroll Sync
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const robuxPackages = [
    { amount: 400, price: "Rp 30.500", popular: false },
    { amount: 800, price: "Rp 69.000", popular: false },
    { amount: 1200, price: "Rp 104.000", popular: true },
    { amount: 1600, price: "Rp 138.000", popular: false },
    { amount: 2500, price: "Rp 209.000", popular: false },
    { amount: 5000, price: "Rp 409.000", popular: false },
    { amount: 10000, price: "Rp 810.000", popular: false },
  ];

  const paymentLogos = [
    { name: "QRIS", src: "/payments/qris.svg" },
    { name: "DANA", src: "/payments/dana.svg" },
    { name: "OVO", src: "/payments/ovo.svg" },
    { name: "GoPay", src: "/payments/gopay.svg" },
    { name: "ShopeePay", src: "/payments/shopeepay.svg" },
    { name: "BCA", src: "/payments/bca.svg" },
  ];

  const quickFeatures = [
    {
      title: "Proses Instan",
      subtitle: "Rata-rata 1-3 menit",
      icon: Zap,
      iconColor: "text-amber-500 fill-amber-500",
      bgColor: "bg-amber-50/90 border-amber-100",
    },
    {
      title: "Harga Lebih Hemat",
      subtitle: "Karena region Vietnam",
      icon: Wallet,
      iconColor: "text-[#FF2E74] fill-[#FF2E74]/20",
      bgColor: "bg-pink-50/90 border-pink-100",
    },
    {
      title: "100% Aman",
      subtitle: "Tanpa perlu login akun",
      icon: ShieldCheck,
      iconColor: "text-emerald-500 fill-emerald-500/20",
      bgColor: "bg-emerald-50/90 border-emerald-100",
    },
    {
      title: "CS 24/7",
      subtitle: "Siap membantu kamu",
      icon: Headphones,
      iconColor: "text-fuchsia-500",
      bgColor: "bg-fuchsia-50/90 border-fuchsia-100",
    },
  ];

  const handleCheckUser = () => {
    if (!username.trim()) return;
    setIsCheckingUser(true);
    setTimeout(() => {
      setIsCheckingUser(false);
      setVerifiedUser(username.trim());
    }, 600);
  };

  const handleQuickOrder = () => {
    const target = verifiedUser || username.trim() || "kamu";
    const selectedPkg = robuxPackages.find((p) => p.amount === selectedNominal);
    const message = encodeURIComponent(
      `Halo Admin VietBlox, saya ingin Top Up Robux:\n- Username Roblox: ${target}\n- Paket: ${selectedNominal} Robux (${selectedPkg?.price})\nMohon diproses ya kak!`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  // Update slider progress on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollPercent(scrollLeft / maxScroll);
    }
  };

  // Slider bar click to scroll
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: ratio * maxScroll,
      behavior: "smooth",
    });
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section id="beranda" className="relative w-full overflow-hidden isolate">
      {/* 1. Full-width Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner_background.jpg"
          alt="VietBlox Roblox City Banner Background"
          fill
          className="object-cover object-center lg:object-right"
          priority
        />
        {/* Subtle horizontal gradient overlay for optimal readability on left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent lg:from-white/90 lg:via-white/50 lg:to-transparent" />
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FFF5F8] to-transparent" />
      </div>

      {/* 2. Ambient Floating Robux Coins in Sky */}
      <div className="absolute top-6 left-[42%] z-10 animate-float-slow pointer-events-none hidden lg:block">
        <div className="relative w-12 h-12 drop-shadow-[0_8px_16px_rgba(255,184,0,0.6)]">
          <Image src="/robux.webp" alt="Floating Robux Coin" fill className="object-contain" />
        </div>
      </div>

      {/* 3. Hero Upper Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 pb-0 lg:pt-6 lg:pb-0 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start pb-4">
            
            {/* Region Star Badge with Authentic Vietnam Flag */}
            <div className="inline-flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF3B7D] via-[#FF5388] to-[#FF75A2] border border-white/60 shadow-[0_4px_14px_rgba(255,59,125,0.35)] mb-3 hover:scale-105 transition-transform">
              <div className="relative w-5 h-5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm border border-white/80">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <defs>
                    <linearGradient id="vnRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EA1B23" />
                      <stop offset="100%" stopColor="#C40E18" />
                    </linearGradient>
                    <linearGradient id="vnStar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFF475" />
                      <stop offset="50%" stopColor="#FFD000" />
                      <stop offset="100%" stopColor="#E59D00" />
                    </linearGradient>
                  </defs>
                  {/* Red circular flag background */}
                  <circle cx="16" cy="16" r="16" fill="url(#vnRed)" />
                  {/* Yellow Star of Vietnam */}
                  <polygon
                    points="16,6.2 19,12.8 26.2,13.2 20.8,17.8 22.4,24.8 16,21 9.6,24.8 11.2,17.8 5.8,13.2 13,12.8"
                    fill="url(#vnStar)"
                  />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs font-black text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                Distributor Resmi Region Vietnam
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-black tracking-tight text-slate-900 leading-[1.08] mb-2.5">
              Top Up Robux <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF7A59]">
                lebih hemat,
              </span>{" "}
              <br />
              proses instan!
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-md mb-4">
              Robux masuk hanya dengan username Roblox. Aman, cepat, dan terpercaya.
            </p>

            {/* Trust Badges Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {/* Pill 1 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-amber-100 shadow-[0_2px_8px_rgba(255,184,0,0.15)] text-slate-800 text-xs font-bold hover:scale-105 transition-transform">
                <div className="w-4 h-4 rounded-md bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap className="w-3 h-3 fill-amber-500" />
                </div>
                <span>1-3 Menit</span>
              </div>

              {/* Pill 2 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.15)] text-slate-800 text-xs font-bold hover:scale-105 transition-transform">
                <div className="w-4 h-4 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <span>100% Aman</span>
              </div>

              {/* Pill 3 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_2px_8px_rgba(255,46,116,0.15)] text-slate-800 text-xs font-bold hover:scale-105 transition-transform">
                <div className="w-4 h-4 rounded-md bg-pink-100 flex items-center justify-center text-[#FF2E74]">
                  <Users className="w-3 h-3" />
                </div>
                <span>Ribuan Pelanggan</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-5 w-full sm:w-auto">
              <button
                onClick={onTopUpClick || handleQuickOrder}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF2E74] via-[#FF4588] to-[#FF6B6B] text-white font-extrabold text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,46,116,0.4)] hover:shadow-[0_8px_25px_rgba(255,46,116,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <span>Top Up Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onHowToOrderClick}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 sm:py-3 rounded-full bg-white/95 backdrop-blur-md border border-pink-200/90 text-slate-800 font-bold text-xs sm:text-sm shadow-xs hover:bg-pink-50 hover:border-pink-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-[#FF2E74]">
                  <Play className="w-2.5 h-2.5 fill-[#FF2E74]" />
                </div>
                <span>Lihat Cara Order</span>
              </button>
            </div>

            {/* Payment Methods */}
            <div className="w-full pt-3 border-t border-pink-200/60">
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Metode Pembayaran Lengkap
              </span>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {paymentLogos.map((payment) => (
                  <div
                    key={payment.name}
                    className="h-7 px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-xs flex items-center justify-center hover:scale-105 transition-transform"
                    title={payment.name}
                  >
                    <img
                      src={payment.src}
                      alt={`${payment.name} Logo`}
                      className="h-full w-auto max-h-4 object-contain"
                    />
                  </div>
                ))}
                <span className="text-[11px] font-semibold text-slate-500">
                  dan lainnya...
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Character standing in scene */}
          <div className="lg:col-span-6 xl:col-span-5 relative flex items-end justify-center lg:justify-end">
            
            {/* Character Wrapper */}
            <div className="relative w-full max-w-[440px] sm:max-w-[500px] h-[380px] sm:h-[450px] lg:h-[500px] flex items-end justify-center translate-y-4 sm:translate-y-8 lg:translate-y-12">
              
              {/* Mascot Image */}
              <div className="relative w-full h-full">
                <Image
                  src="/logo_nobackground.PNG"
                  alt="VietBlox Mascot Character"
                  fill
                  className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(255,46,116,0.3)]"
                  priority
                />
              </div>

              {/* Floating Robux Coin Top Left */}
              <div className="absolute top-2 -left-2 z-30 animate-float-slow pointer-events-none hidden sm:block">
                <div className="relative w-12 h-12 drop-shadow-[0_8px_16px_rgba(255,184,0,0.6)]">
                  <Image src="/robux.webp" alt="Robux Coin" fill className="object-contain" />
                </div>
              </div>

              {/* Floating Badge: More Robux More Happiness */}
              <div className="absolute top-[38%] -right-2 sm:right-1 z-30 animate-float-reverse pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-[0_6px_16px_rgba(255,46,116,0.2)] border border-pink-100 flex items-center gap-1 text-[11px] font-black text-[#FF2E74]">
                  <span>More Robux More Happiness!</span>
                  <Heart className="w-3 h-3 fill-[#FF2E74]" />
                </div>
              </div>

              {/* Floating Trust Badge: 10.000+ Players */}
              <div className="absolute bottom-14 sm:bottom-16 right-0 sm:right-2 z-30">
                <div className="px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-pink-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Trusted by
                    </span>
                    <span className="text-[11px] font-black text-slate-800 leading-tight">
                      10.000+ Player Indonesia ❤️
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 4. Floating Quick Top Up Widget Bar & Feature Cards (id="pricelist") */}
      <div id="pricelist" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 pt-0 pb-6 flex flex-col gap-3.5 scroll-mt-24">
        
        {/* Main Quick Top Up Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-[0_12px_35px_rgba(255,105,180,0.18)] border border-pink-100/90 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Quick Input: Username Roblox */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF2E74]" />
                  Mulai Top Up Sekarang
                </span>
                {verifiedUser && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                  </span>
                )}
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setVerifiedUser(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckUser()}
                  placeholder="Masukkan username Roblox kamu..."
                  className="w-full pl-9 pr-20 py-2.5 bg-slate-50/90 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#FF2E74] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                />
                <button
                  onClick={handleCheckUser}
                  disabled={isCheckingUser || !username.trim()}
                  className="absolute right-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-bold text-xs shadow-xs hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isCheckingUser ? "Cek..." : "Cek"}
                </button>
              </div>
            </div>

            {/* Robux Nominal Quick Selector List with Clean Custom Slider */}
            <div className="lg:col-span-8 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
                  Pilih Nominal Robux
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Geser kartu untuk melihat semua nominal
                </span>
              </div>

              {/* Horizontal Scrollable Packages Container */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-2 pb-1.5 cursor-grab active:cursor-grabbing select-none scroll-smooth"
              >
                {robuxPackages.map((pkg) => {
                  const isSelected = selectedNominal === pkg.amount;
                  return (
                    <button
                      key={pkg.amount}
                      onClick={() => setSelectedNominal(pkg.amount)}
                      className={`relative flex-shrink-0 flex flex-col items-center justify-center min-w-[105px] sm:min-w-[115px] py-2 px-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF0F5] border-[#FF2E74] shadow-[0_4px_12px_rgba(255,46,116,0.22)] scale-102 ring-1 ring-[#FF2E74]"
                          : "bg-white border-slate-200/80 hover:border-pink-200 hover:bg-pink-50/40"
                      }`}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black tracking-wider uppercase shadow-xs">
                          🔥 Populer
                        </div>
                      )}

                      {/* Robux Logo + Nominal */}
                      <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-slate-900">
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Image
                            src="/robux.webp"
                            alt="Robux"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span>{pkg.amount.toLocaleString("id-ID")}</span>
                      </div>
                      
                      {/* Price */}
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-0.5">
                        {pkg.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Minimal Clean Custom Slider Bar Indicator */}
              <div className="flex items-center justify-center pt-1">
                <div
                  onClick={handleSliderClick}
                  className="group relative w-28 sm:w-36 h-1.5 bg-slate-100 hover:bg-pink-100/80 rounded-full cursor-pointer transition-colors overflow-hidden"
                  title="Klik atau geser untuk scroll"
                >
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-[#FF2E74] to-[#FF5588] rounded-full transition-all duration-100"
                    style={{
                      width: "35%",
                      left: `${scrollPercent * 65}%`,
                    }}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 4 Feature Cards Below Top Up Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-100/80 shadow-[0_4px_16px_rgba(255,182,193,0.12)] hover:shadow-[0_6px_20px_rgba(255,182,193,0.22)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Circular Icon Container */}
                <div className={`w-11 h-11 rounded-full ${item.bgColor} border flex items-center justify-center flex-shrink-0 shadow-xs`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col">
                  <h4 className="text-xs sm:text-[13px] font-black text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-tight">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
