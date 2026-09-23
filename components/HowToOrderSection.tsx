"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, QrCode, Sparkles, User, ShieldCheck } from "lucide-react";

interface HowToOrderSectionProps {
  onGuideClick?: () => void;
}

export default function HowToOrderSection({ onGuideClick }: HowToOrderSectionProps) {
  return (
    <section id="cara-order" className="py-10 sm:py-14 lg:py-16 bg-white/70 border-b border-pink-100/70">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="relative inline-block pb-1.5 sm:pb-2">
                Cara Order
                <span className="absolute bottom-0 left-0 w-10 sm:w-12 h-1 bg-[#FFB800] rounded-full" />
              </span>{" "}
              di VietBlox
            </h2>
          </div>

          <button
            onClick={onGuideClick}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF2E74] hover:text-[#E61E63] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Lihat Panduan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* STEP 1 */}
          <div className="flex flex-col gap-3 sm:gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-pink-100/90 shadow-[0_4px_20px_rgba(255,182,193,0.15)] hover:shadow-[0_8px_25px_rgba(255,182,193,0.25)] transition-all">
            {/* Header: Number & Text */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                1
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Masukkan Username
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Tanpa perlu login akun Roblox.
                </p>
              </div>
            </div>

            {/* Illustration Mockup Box */}
            <div className="relative w-full h-32 sm:h-36 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50/70 to-purple-50/60 border border-pink-100/80 p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 overflow-hidden shadow-inner">
              {/* Background ambient sparkles */}
              <div className="absolute top-2 right-2 text-pink-300 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-50" />
              </div>

              {/* Avatar Head Mockup */}
              <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full p-1 bg-white shadow-md border border-pink-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-pink-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo_background.PNG"
                    alt="Roblox Avatar"
                    fill
                    className="object-cover scale-125"
                  />
                </div>
              </div>

              {/* Username Input Card */}
              <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-pink-100 shadow-sm min-w-0">
                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 leading-tight">
                  Username Roblox
                </span>
                <div className="mt-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
                  contoh: <span className="text-[#FF2E74] font-bold">NotVietBlox</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex flex-col gap-3 sm:gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-pink-100/90 shadow-[0_4px_20px_rgba(255,182,193,0.15)] hover:shadow-[0_8px_25px_rgba(255,182,193,0.25)] transition-all">
            {/* Header: Number & Text */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                2
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Pilih Nominal & Bayar
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Gunakan metode pembayaran favorit kamu.
                </p>
              </div>
            </div>

            {/* Illustration Mockup Box */}
            <div className="relative w-full h-32 sm:h-36 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50/70 to-blue-50/60 border border-pink-100/80 p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 overflow-hidden shadow-inner">
              {/* Smartphone with QR Code */}
              <div className="relative w-20 sm:w-24 h-full bg-slate-900 rounded-xl p-1 sm:p-1.5 shadow-md flex flex-col items-center justify-between flex-shrink-0">
                <div className="w-6 sm:w-8 h-1 bg-slate-700 rounded-full mb-0.5 sm:mb-1" />
                <div className="w-full bg-white rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center">
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11">
                    <Image
                      src="/payments/qris.svg"
                      alt="QRIS"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[7px] sm:text-[8px] font-black text-slate-800 mt-0.5">
                    Scan & Bayar
                  </span>
                </div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-700 mt-0.5 sm:mt-1" />
              </div>

              {/* Floating Payment Badges */}
              <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 justify-center min-w-0">
                <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-white/95 border border-slate-100 shadow-xs">
                  <img src="/payments/dana.svg" alt="DANA" className="h-2.5 sm:h-3 w-auto object-contain" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-600">DANA</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-white/95 border border-slate-100 shadow-xs">
                  <img src="/payments/gopay.svg" alt="GoPay" className="h-2.5 sm:h-3 w-auto object-contain" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-600">GoPay</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-white/95 border border-slate-100 shadow-xs">
                  <img src="/payments/shopeepay.svg" alt="ShopeePay" className="h-2.5 sm:h-3 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="flex flex-col gap-3 sm:gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-pink-100/90 shadow-[0_4px_20px_rgba(255,182,193,0.15)] hover:shadow-[0_8px_25px_rgba(255,182,193,0.25)] transition-all">
            {/* Header: Number & Text */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                3
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Robux Masuk
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  Estimasi hanya 1-3 menit.
                </p>
              </div>
            </div>

            {/* Illustration Mockup Box */}
            <div className="relative w-full h-32 sm:h-36 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-pink-50/60 to-amber-50/60 border border-emerald-100/80 p-2.5 sm:p-3 flex items-center justify-between gap-2 overflow-hidden shadow-inner">
              {/* Success Notification Popup */}
              <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-emerald-200 shadow-sm flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 truncate">
                    Robux Terkirim!
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-emerald-600 mt-0.5 flex items-center gap-0.5 truncate">
                    <span className="text-emerald-500">+</span>1200 Robux
                  </span>
                </div>
              </div>

              {/* Celebrating Character Icon / Avatar */}
              <div className="relative w-14 sm:w-16 h-20 sm:h-24 flex-shrink-0 flex items-end">
                <Image
                  src="/logo_nobackground.PNG"
                  alt="Mascot Success"
                  fill
                  className="object-contain object-bottom scale-110"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
