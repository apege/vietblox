"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";

interface WhyVietnamSectionProps {
  onReadMore?: () => void;
}

function CatMascot() {
  return (
    <svg
      viewBox="0 0 200 180"
      className="w-40 h-36 sm:w-44 sm:h-40 drop-shadow-[0_10px_20px_rgba(255,182,193,0.3)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cat Ears */}
      {/* Left Ear */}
      <path
        d="M50 75C40 45 42 25 58 32C74 38 78 58 78 70"
        fill="#FFFFFF"
        stroke="#4A2E2B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M52 68C46 50 48 36 58 40C68 45 70 58 70 66"
        fill="#FFB6C1"
      />

      {/* Right Ear */}
      <path
        d="M150 75C160 45 158 25 142 32C126 38 122 58 122 70"
        fill="#FFFFFF"
        stroke="#4A2E2B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M148 68C154 50 152 36 142 40C132 45 130 58 130 66"
        fill="#FFB6C1"
      />

      {/* White Cat Head Base */}
      <ellipse
        cx="100"
        cy="110"
        rx="62"
        ry="52"
        fill="#FFFFFF"
        stroke="#4A2E2B"
        strokeWidth="3.5"
      />

      {/* Yellow Cap / Hat */}
      <path
        d="M55 85C55 50 80 40 100 40C120 40 145 50 145 85C130 82 70 82 55 85Z"
        fill="#FFD23F"
        stroke="#4A2E2B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Cap Visor */}
      <path
        d="M48 85C48 85 75 98 100 98C125 98 152 85 152 85C155 92 140 105 100 105C60 105 45 92 48 85Z"
        fill="#FFC107"
        stroke="#4A2E2B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Cap Front Emblem (Little white circle badge) */}
      <ellipse cx="100" cy="65" rx="14" ry="11" fill="#FFFFFF" />
      <circle cx="95" cy="64" r="1.5" fill="#4A2E2B" />
      <circle cx="105" cy="64" r="1.5" fill="#4A2E2B" />
      <path d="M98 67C99 68.5 101 68.5 102 67" stroke="#4A2E2B" strokeWidth="1" strokeLinecap="round" />

      {/* Cat Face Features */}
      {/* Happy Closed Eyes (Arcs) */}
      <path
        d="M75 120C79 114 85 114 89 120"
        stroke="#4A2E2B"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M111 120C115 114 121 114 125 120"
        stroke="#4A2E2B"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Pink Blush Cheeks */}
      <ellipse cx="68" cy="126" rx="8" ry="4.5" fill="#FF8BA7" opacity="0.8" />
      <ellipse cx="132" cy="126" rx="8" ry="4.5" fill="#FF8BA7" opacity="0.8" />

      {/* Nose */}
      <path
        d="M97 122C97 120 103 120 103 122L100 125Z"
        fill="#FF8BA7"
      />

      {/* Open Mouth with Tongue */}
      <path
        d="M93 126C93 134 107 134 107 126"
        fill="#E11D48"
        stroke="#4A2E2B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M96 130C98 133 102 133 104 130"
        fill="#FFA4BA"
      />

      {/* Whiskers */}
      <path d="M52 118L64 121" stroke="#4A2E2B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 126L64 126" stroke="#4A2E2B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M148 118L136 121" stroke="#4A2E2B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 126L136 126" stroke="#4A2E2B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function WhyVietnamSection({ onReadMore }: WhyVietnamSectionProps) {
  return (
    <section id="kenapa-vietnam" className="py-10 lg:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Main Card: Explanation + Mascot Illustration */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-9 border border-pink-100/90 shadow-[0_12px_40px_rgba(255,105,180,0.12)] flex flex-col md:flex-row items-center justify-between gap-6 relative">
            
            {/* Left Copywriting */}
            <div className="flex-1 flex flex-col items-start z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-[1.25] mb-3">
                <span className="relative inline-block pb-2">
                  Kenapa Robux
                  <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#FFB800] rounded-full" />
                </span>{" "}
                <br />
                <span className="block mt-0.5">Vietnam Lebih Murah?</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6 max-w-md">
                Harga Robux di Vietnam memang lebih rendah dibandingkan region lain. VietBlox memanfaatkan harga regional tersebut melalui metode resmi, sehingga kamu bisa mendapatkan Robux dengan harga lebih hemat, aman, dan legal.
              </p>

              <button
                onClick={onReadMore || (() => {
                  window.open("https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20mau%20tanya%20detail%20tentang%20Robux%20Region%20Vietnam", "_blank");
                })}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-pink-300 text-[#FF2E74] font-extrabold text-xs sm:text-sm bg-pink-50/40 hover:bg-pink-100/70 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <span>Baca Penjelasan Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Mascot with Speech Bubbles Artwork (Properly centered & not zoomed) */}
            <div className="relative w-64 sm:w-72 h-56 flex-shrink-0 flex items-center justify-center">
              
              {/* Floating Star 1 */}
              <div className="absolute top-4 left-6 text-[#FFB800] animate-float-slow text-base">
                ★
              </div>
              {/* Floating Star 2 */}
              <div className="absolute bottom-5 right-6 text-[#FFB800] animate-float-reverse text-base">
                ★
              </div>

              {/* Speech Bubble 1: Legal & Aman */}
              <div className="absolute top-1 left-2 z-20 animate-float-slow">
                <div className="px-3 py-1.5 rounded-2xl bg-[#FFF9E6] border border-amber-200/90 shadow-xs text-[11px] font-black text-amber-900">
                  Legal & Aman
                </div>
              </div>

              {/* Speech Bubble 2: Region Vietnam */}
              <div className="absolute top-0 right-1 z-20 animate-float-reverse">
                <div className="px-3 py-1.5 rounded-2xl bg-[#E8F8F0] border border-emerald-200/90 shadow-xs text-[11px] font-black text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Region Vietnam</span>
                </div>
              </div>

              {/* Speech Bubble 3: Harga Lebih Hemat */}
              <div className="absolute bottom-6 right-0 z-20 animate-float-slow">
                <div className="px-3 py-1.5 rounded-2xl bg-[#FFF5E5] border border-amber-200/90 shadow-xs text-[11px] font-black text-amber-900">
                  Harga Lebih Hemat
                </div>
              </div>

              {/* Standalone Vector Cat Mascot with Cap */}
              <div className="relative z-10 flex items-center justify-center">
                <CatMascot />
              </div>

            </div>

          </div>

          {/* Right Stats Card (Compact, snug fit without empty vertical gaps) */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-pink-100/90 shadow-[0_12px_40px_rgba(255,105,180,0.12)] flex flex-col justify-center gap-3">
            
            {/* Top Row: 10K+ & 4.9* */}
            <div className="grid grid-cols-2 gap-3">
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center hover:border-pink-200 transition-colors">
                <span className="text-2xl sm:text-3xl font-black text-[#FF2E74] tracking-tight">
                  10K+
                </span>
                <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Order Selesai
                </span>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center hover:border-pink-200 transition-colors">
                <div className="flex items-center gap-0.5 text-2xl sm:text-3xl font-black text-[#FF2E74] tracking-tight">
                  <span>4.9</span>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF2E74] text-[#FF2E74]" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Customer Rating
                </span>
              </div>
            </div>

            {/* Bottom Row: 24/7 Fast Response */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center hover:border-pink-200 transition-colors">
              <span className="text-2xl sm:text-3xl font-black text-[#FF2E74] tracking-tight">
                24/7
              </span>
              <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                Fast Response
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
