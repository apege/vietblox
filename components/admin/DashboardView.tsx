"use client";

import React from "react";
import Image from "next/image";
import {
  TrendingUp,
  Inbox,
  Clock,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Zap,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Users,
} from "lucide-react";
import { OrderItem } from "@/lib/adminStore";

interface DashboardViewProps {
  orders: OrderItem[];
  onManageOrdersClick: () => void;
  onSelectOrder: (order: OrderItem) => void;
  onViewAllOrders: () => void;
}

export default function DashboardView({
  orders,
  onManageOrdersClick,
  onSelectOrder,
  onViewAllOrders,
}: DashboardViewProps) {
  // Compute dynamic stats
  const masukCount = orders.filter((o) => o.status === "masuk").length;
  const diprosesCount = orders.filter((o) => o.status === "diproses").length;
  const selesaiCount = orders.filter((o) => o.status === "selesai").length;

  // Total Omset calculation
  const totalOmset = orders
    .filter((o) => o.status === "selesai" || o.status === "diproses" || o.status === "masuk")
    .reduce((acc, curr) => acc + curr.numericPrice, 0);

  const formattedOmset = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalOmset || 1302000).replace("Rp", "Rp ");

  // 5 Latest Orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 1. Hero Welcome Banner (Clean, Spacious, Flush Bottom Mascot)     */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden border border-pink-200/90 shadow-[0_12px_35px_rgba(255,105,180,0.18)] isolate min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center">
        
        {/* Full-width City Banner Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner_background.jpg"
            alt="Roblox City Background"
            fill
            className="object-cover object-center lg:object-right"
            priority
          />
          {/* Subtle horizontal gradient overlay for crisp readability on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40 lg:from-white/95 lg:via-white/70 lg:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FFF5F8]/90 to-transparent" />
        </div>

        {/* Ambient Floating Robux Coins in Sky */}
        <div className="absolute top-5 left-[42%] z-10 animate-float-slow pointer-events-none hidden lg:block">
          <div className="relative w-11 h-11 drop-shadow-[0_8px_16px_rgba(255,184,0,0.6)]">
            <Image src="/robux.webp" alt="Floating Robux" fill className="object-contain" />
          </div>
        </div>

        {/* 3D Mascot Character Standing Flush on Bottom Edge */}
        <div className="absolute right-0 sm:right-4 lg:right-8 bottom-0 z-10 w-[240px] sm:w-[320px] lg:w-[380px] h-[300px] sm:h-[370px] lg:h-[410px] pointer-events-none flex items-end justify-center">
          <div className="relative w-full h-full flex items-end justify-center">
            
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
            <div className="absolute top-8 left-0 sm:left-4 z-20 animate-float-slow hidden sm:block">
              <div className="relative w-11 h-11 drop-shadow-[0_8px_16px_rgba(255,184,0,0.6)]">
                <Image src="/robux.webp" alt="Robux Coin" fill className="object-contain" />
              </div>
            </div>

            {/* Floating Pill Badge: More Robux More Happiness */}
            <div className="absolute top-[26%] right-0 sm:right-2 z-20 animate-float-reverse scale-90 sm:scale-100 origin-right">
              <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-[0_6px_18px_rgba(255,46,116,0.22)] border border-pink-100 flex items-center gap-1.5 text-[11px] font-black text-[#FF2E74]">
                <span>More Robux More Happiness!</span>
                <Heart className="w-3 h-3 fill-[#FF2E74]" />
              </div>
            </div>

          </div>
        </div>

        {/* Banner Content (Left Column) */}
        <div className="relative z-20 p-5 sm:p-7 lg:p-9 max-w-xl lg:max-w-2xl flex flex-col items-start justify-center py-6 sm:py-8">
          
          {/* Vietnam Distributor Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 pl-1 pr-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF3B7D] via-[#FF5388] to-[#FF75A2] border border-white/80 shadow-[0_4px_14px_rgba(255,59,125,0.35)] mb-3 hover:scale-105 transition-transform">
            <div className="relative w-4.5 h-4.5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs border border-white/80">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <defs>
                  <linearGradient id="adminVnRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA1B23" />
                    <stop offset="100%" stopColor="#C40E18" />
                  </linearGradient>
                  <linearGradient id="adminVnStar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFF475" />
                    <stop offset="50%" stopColor="#FFD000" />
                    <stop offset="100%" stopColor="#E59D00" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="16" fill="url(#adminVnRed)" />
                <polygon
                  points="16,6.2 19,12.8 26.2,13.2 20.8,17.8 22.4,24.8 16,21 9.6,24.8 11.2,17.8 5.8,13.2 13,12.8"
                  fill="url(#adminVnStar)"
                />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-black text-white tracking-tight drop-shadow-xs">
              VietBlox Admin Control Center
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black text-slate-900 tracking-tight leading-[1.12] mb-2.5">
            Selamat Datang di <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF7A59]">
              Panel Admin VietBlox!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-lg mb-4">
            Pantau transaksi top up Robux, proses aktivasi pesanan secara instan, dan kelola katalog produk toko dengan mudah.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-amber-100 shadow-[0_2px_8px_rgba(255,184,0,0.15)] text-slate-800 text-[11px] sm:text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Proses 1-3 Mnt</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.15)] text-slate-800 text-[11px] sm:text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Aman</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_2px_8px_rgba(255,46,116,0.15)] text-slate-800 text-[11px] sm:text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-[#FF2E74]" />
              <span>10.000+ Pelanggan</span>
            </div>
          </div>

          {/* Action Button: Kelola Order */}
          <button
            onClick={onManageOrdersClick}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF6B6B] text-white font-black text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,46,116,0.4)] hover:shadow-[0_8px_25px_rgba(255,46,116,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>Kelola Order Masuk ({masukCount})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 2. 3 Quick Action / Feature Cards (Clean Row Below Banner)        */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Transaksi Cepat */}
        <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_18px_rgba(255,182,193,0.12)] hover:shadow-[0_6px_22px_rgba(255,182,193,0.2)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-200/80 flex items-center justify-center text-[#FF2E74] flex-shrink-0 shadow-2xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs sm:text-sm font-black text-slate-900">Transaksi Cepat</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Pantau top up Robux secara real-time.
            </p>
          </div>
        </div>

        {/* Card 2: Aktivasi Instan */}
        <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_18px_rgba(255,182,193,0.12)] hover:shadow-[0_6px_22px_rgba(255,182,193,0.2)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 flex-shrink-0 shadow-2xs">
            <Zap className="w-5 h-5 fill-amber-500/30" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs sm:text-sm font-black text-slate-900">Aktivasi Instan</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Proses pesanan otomatis dan cepat.
            </p>
          </div>
        </div>

        {/* Card 3: Kelola Katalog */}
        <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_18px_rgba(255,182,193,0.12)] hover:shadow-[0_6px_22px_rgba(255,182,193,0.2)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-[#FF2E74] flex-shrink-0 shadow-2xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-xs sm:text-sm font-black text-slate-900">Kelola Katalog</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Atur produk dan stok dengan mudah.
            </p>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 3. 4 Metric Cards (Clean, No-Wrap, Equal Height)                  */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
        
        {/* Metric 1: Total Omset */}
        <div className="p-4.5 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_6px_25px_rgba(255,182,193,0.14)] min-h-[135px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Total Omset
            </span>
            <div className="w-8 h-8 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-[#FF2E74] flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <h3 className="text-base sm:text-lg lg:text-[1.4rem] font-black text-slate-900 tracking-tight whitespace-nowrap truncate" title={formattedOmset}>
              {formattedOmset}
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1 whitespace-nowrap">
              <span>↑</span> Transaksi sukses
            </span>
          </div>
        </div>

        {/* Metric 2: Order Masuk */}
        <div
          onClick={onManageOrdersClick}
          className="p-4.5 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_6px_25px_rgba(255,182,193,0.14)] min-h-[135px] flex flex-col justify-between hover:-translate-y-1 hover:border-amber-200 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Order Masuk
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight whitespace-nowrap">
              {masukCount}
            </h3>
            <span className="text-[11px] font-bold text-amber-600 mt-1 group-hover:underline flex items-center gap-0.5 whitespace-nowrap">
              <span>Perlu diproses</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 3: Sedang Diproses */}
        <div className="p-4.5 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_6px_25px_rgba(255,182,193,0.14)] min-h-[135px] flex flex-col justify-between hover:-translate-y-1 hover:border-blue-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Sedang Diproses
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight whitespace-nowrap">
              {diprosesCount}
            </h3>
            <span className="text-[11px] font-bold text-blue-600 mt-1 flex items-center gap-0.5 whitespace-nowrap">
              <span>Dalam antrean gamepass</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 4: Order Selesai */}
        <div className="p-4.5 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_6px_25px_rgba(255,182,193,0.14)] min-h-[135px] flex flex-col justify-between hover:-translate-y-1 hover:border-emerald-200 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Order Selesai
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight whitespace-nowrap">
              {selesaiCount}
            </h3>
            <span className="text-[11px] font-bold text-slate-400 mt-1 whitespace-nowrap">
              Dari {orders.length} total order
            </span>
          </div>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 4. Pesanan Terbaru Card (Matching Screenshot 2)                   */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_8px_30px_rgba(255,182,193,0.15)] p-6 sm:p-7 flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100/80">
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Pesanan Terbaru
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              5 transaksi terakhir yang masuk ke sistem
            </p>
          </div>

          <button
            onClick={onViewAllOrders}
            className="text-xs font-black text-[#FF2E74] hover:text-[#E62A6B] flex items-center gap-1 group transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* List of Recent 5 Transactions */}
        <div className="flex flex-col divide-y divide-pink-50">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="flex items-center justify-between py-4 px-3 sm:px-4 rounded-2xl hover:bg-[#FFF5F8] transition-all cursor-pointer group"
            >
              {/* Left: Robux Icon + Order Details */}
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Gold Hex Robux Coin Icon */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image
                    src="/robux.webp"
                    alt="Robux Coin"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm sm:text-base font-black text-[#FF2E74] group-hover:underline">
                    #{order.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 truncate">
                    <span className="text-slate-900 font-bold">@{order.username}</span>
                    <span>•</span>
                    <span>{order.robuxAmount.toLocaleString("id-ID")} Robux</span>
                  </div>
                </div>
              </div>

              {/* Right: Price & Payment Method Tag */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-sm sm:text-base font-black text-slate-900">
                  {order.price}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wide uppercase border ${
                    order.paymentMethod === "WHATSAPP"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-pink-50 text-[#FF2E74] border-pink-200"
                  }`}
                >
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
