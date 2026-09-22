"use client";

import React from "react";
import { X, User, ShoppingBag, CreditCard, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface HowToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToOrderModal({ isOpen, onClose }: HowToOrderModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      number: "01",
      title: "Masukkan Username Roblox",
      description: "Hanya butuh username kamu tanpa password. 100% aman & anti-hack.",
      icon: User,
      color: "bg-pink-100 text-[#FF2E74]",
    },
    {
      number: "02",
      title: "Pilih Nominal Robux",
      description: "Pilih nominal 400 hingga 10.000+ Robux dengan harga resmi termurah.",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-600",
    },
    {
      number: "03",
      title: "Selesaikan Pembayaran",
      description: "Bayar via QRIS (Semua E-Wallet/Bank), DANA, OVO, GoPay, ShopeePay, atau BCA.",
      icon: CreditCard,
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: "04",
      title: "Robux Masuk Instan!",
      description: "Proses cepat 1-3 menit langsung masuk ke saldo akun Roblox kamu.",
      icon: Sparkles,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[95vh] overflow-y-auto no-scrollbar flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 text-[#FF2E74] text-[11px] font-bold mb-1.5 border border-pink-100">
            <CheckCircle2 className="w-3 h-3" /> Panduan Mudah
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Cara Order di VietBlox
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Top up praktis tanpa ribet dalam 4 langkah cepat
          </p>
        </div>

        {/* 4 Steps List */}
        <div className="flex flex-col gap-2.5 my-1">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all group"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 truncate">
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-black text-[#FF2E74] bg-pink-100/70 px-1.5 py-0.2 rounded-md flex-shrink-0">
                      {step.number}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Action */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF6B6B] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Saya Mengerti, Mulai Top Up!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
