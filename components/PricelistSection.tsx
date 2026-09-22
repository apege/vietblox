"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Flame, Shield, Zap } from "lucide-react";

export default function PricelistSection() {
  const [activeCategory, setActiveCategory] = useState<"standard" | "vip">("standard");

  const standardPackages = [
    { amount: 400, price: "Rp 30.500", bonus: "+0 Robux", popular: false, save: "Hemat 25%" },
    { amount: 800, price: "Rp 69.000", bonus: "+20 Robux", popular: false, save: "Hemat 30%" },
    { amount: 1200, price: "Rp 104.000", bonus: "+50 Robux", popular: true, save: "Best Seller" },
    { amount: 1600, price: "Rp 138.000", bonus: "+75 Robux", popular: false, save: "Hemat 35%" },
    { amount: 2000, price: "Rp 172.000", bonus: "+100 Robux", popular: false, save: "Hemat 38%" },
    { amount: 2500, price: "Rp 209.000", bonus: "+150 Robux", popular: false, save: "Hemat 40%" },
    { amount: 5000, price: "Rp 409.000", bonus: "+300 Robux", popular: true, save: "Hemat 45%" },
    { amount: 10000, price: "Rp 810.000", bonus: "+700 Robux", popular: false, save: "Sultan Pack" },
  ];

  const handleOrder = (amount: number, price: string) => {
    const msg = encodeURIComponent(`Halo Admin VietBlox, saya ingin membeli paket ${amount} Robux (${price}). Mohon panduannya!`);
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
  };

  return (
    <section id="pricelist" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#FF2E74] text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5" /> Daftar Harga Resmi
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pricelist Robux <span className="text-[#FF2E74]">Termurah</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            Pilih paket Robux sesuai kebutuhan kamu dengan garansi harga paling bersaing
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standardPackages.map((pkg) => (
            <div
              key={pkg.amount}
              className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${
                pkg.popular
                  ? "border-[#FF2E74] shadow-[0_10px_30px_rgba(255,46,116,0.2)] ring-2 ring-pink-100"
                  : "border-slate-200/80 hover:border-pink-200 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  pkg.popular
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {pkg.save}
                </span>
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-500" /> Instan 1-3 Mnt
                </span>
              </div>

              {/* Amount & Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {pkg.amount.toLocaleString("id-ID")}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Robux Points
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-slate-500 font-semibold">Harga</span>
                  <span className="text-xl font-black text-[#FF2E74]">{pkg.price}</span>
                </div>

                <button
                  onClick={() => handleOrder(pkg.amount, pkg.price)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    pkg.popular
                      ? "bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white shadow-md hover:opacity-90"
                      : "bg-slate-900 hover:bg-[#FF2E74] text-white shadow-sm"
                  }`}
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
