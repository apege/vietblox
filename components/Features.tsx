"use client";

import React from "react";
import { BadgePercent, Clock, ShieldCheck, UserCheck, Headset, Sparkles } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: BadgePercent,
      title: "Harga Jauh Lebih Murah",
      desc: "Memanfaatkan kurs resmi region Vietnam sehingga harga Robux jauh lebih hemat dibanding top up biasa.",
      color: "bg-pink-100 text-[#FF2E74]",
    },
    {
      icon: Clock,
      title: "Pengiriman Super Instan",
      desc: "Sistem otomatisasi modern mengirim Robux langsung ke akun kamu hanya dalam 1 - 3 menit.",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: UserCheck,
      title: "Cukup Username Saja",
      desc: "Tidak memerlukan kata sandi / login akun sama sekali. Akun Roblox kamu 100% terlindungi dan aman.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: ShieldCheck,
      title: "Legal & Anti Banned",
      desc: "Semua metode pengisian resmi dan legal sesuai ketentuan Roblox Corporation, bebas resiko roll-back.",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Headset,
      title: "Customer Support 24/7",
      desc: "Admin standby 24 jam nonstop siap membantu pesanan atau konsultasi kamu kapan saja.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Sparkles,
      title: "Bonus & Promo Rutin",
      desc: "Dapatkan cashback, promo mingguan, dan giveaway Robux gratis untuk pelanggan setia kami.",
      color: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <section className="py-16 bg-white/60 border-y border-pink-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#FF2E74] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Kenapa Memilih Kami?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Keunggulan Top Up di <span className="text-[#FF2E74]">VietBlox</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Layanan top up Robux terbaik, termurah, dan terpercaya nomor 1 di Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-3xl bg-white border border-pink-100/80 shadow-[0_4px_20px_rgba(255,182,193,0.15)] hover:shadow-[0_8px_30px_rgba(255,182,193,0.3)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-4 font-bold`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
