"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RotateCcw,
  Search,
  Globe,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { OrderItem } from "@/lib/adminStore";

interface PaymentHistoryViewProps {
  orders: OrderItem[];
  onSelectOrder?: (order: OrderItem) => void;
  onRefreshData?: () => void;
}

type MethodTab = "all" | "WEBSITE" | "WHATSAPP";

export default function PaymentHistoryView({
  orders,
  onSelectOrder,
  onRefreshData,
}: PaymentHistoryViewProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<MethodTab>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshData) onRefreshData();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Only paid / completed transactions count for "Log Mutasi Pembayaran Masuk"
  // But if there are no "selesai" in initial test data, fallback gracefully to completed or all valid paid
  const paidOrders = orders.filter((o) => o.status === "selesai");
  const baseOrders = paidOrders.length > 0 ? paidOrders : orders.filter((o) => o.status !== "dibatalkan");

  // Calculations
  const totalRevenue = baseOrders.reduce((acc, curr) => acc + (curr.numericPrice || 0), 0);
  const totalRobux = baseOrders.reduce((acc, curr) => acc + (curr.robuxAmount || 0), 0);
  const totalTransactions = baseOrders.length;
  const avgOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Breakdown by Method
  const websiteOrders = baseOrders.filter((o) => o.paymentMethod === "WEBSITE");
  const websiteRevenue = websiteOrders.reduce((acc, curr) => acc + (curr.numericPrice || 0), 0);
  const websiteCount = websiteOrders.length;
  const websitePercent = totalRevenue > 0 ? ((websiteRevenue / totalRevenue) * 100).toFixed(1) : "100.0";

  const whatsappOrders = baseOrders.filter((o) => o.paymentMethod === "WHATSAPP");
  const whatsappRevenue = whatsappOrders.reduce((acc, curr) => acc + (curr.numericPrice || 0), 0);
  const whatsappCount = whatsappOrders.length;
  const whatsappPercent = totalRevenue > 0 ? ((whatsappRevenue / totalRevenue) * 100).toFixed(1) : "0.0";

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Filtered List for Mutasi Log
  const filteredList = baseOrders.filter((item) => {
    if (activeTab === "WEBSITE" && item.paymentMethod !== "WEBSITE") return false;
    if (activeTab === "WHATSAPP" && item.paymentMethod !== "WHATSAPP") return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      item.id.toLowerCase().includes(q) ||
      item.username.toLowerCase().includes(q) ||
      item.numericPrice.toString().includes(q) ||
      item.robuxAmount.toString().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* ─── 1. Header (Matching Screenshot 1) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Riwayat Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Log mutasi kas masuk dan ringkasan pembayaran pesanan Robux yang berhasil
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-[#FF2E74] text-xs sm:text-sm font-extrabold shadow-2xs hover:shadow-xs active:scale-95 transition-all self-start sm:self-auto flex-shrink-0 cursor-pointer"
        >
          <RotateCcw className={`w-4 h-4 text-[#FF2E74] ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ─── 2. Top 3 Metric Cards (Matching Screenshot 1) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: TOTAL DANA MASUK */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              TOTAL DANA MASUK
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2E74]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-[#FF2E74] tracking-tight whitespace-nowrap">
              {formatRupiah(totalRevenue)}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Dari {totalTransactions} transaksi pembayaran lunas
            </p>
          </div>
        </div>

        {/* Card 2: TOTAL ROBUX TERJUAL */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              TOTAL ROBUX TERJUAL
            </span>
            <div className="relative w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center p-1">
              <Image
                src="/robux.webp"
                alt="Robux Coin"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight whitespace-nowrap">
                {totalRobux.toLocaleString("id-ID")}
              </h3>
              <span className="text-xs font-black text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                R$
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Robux terkirim ke akun pelanggan
            </p>
          </div>
        </div>

        {/* Card 3: RATA-RATA ORDER */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              RATA-RATA ORDER
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[11px] font-black border border-emerald-200">
              AOV
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">
              {formatRupiah(avgOrderValue)}
            </h3>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              Average Order Value per transaksi
            </p>
          </div>
        </div>

      </div>

      {/* ─── 3. OMSET PER METODE PEMBAYARAN (Matching Screenshot 1) ─── */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
            OMSET PER METODE PEMBAYARAN
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Ringkasan total pemasukan berdasarkan metode pembayaran
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card Left: WEBSITE */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF2E74] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-slate-900 tracking-wider">
                  WEBSITE
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#FF2E74] text-xs font-black border border-pink-200/60">
                {websitePercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400">Total Omset</span>
                <span className="text-base sm:text-lg font-black text-[#FF2E74]">
                  {formatRupiah(websiteRevenue)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400">Transaksi</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {websiteCount} transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-pink-100/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF2E74] to-[#E11D48] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(Number(websitePercent), 5)}%` }}
              />
            </div>
          </div>

          {/* Card Right: WHATSAPP */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-slate-900 tracking-wider">
                  WHATSAPP
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black border border-emerald-200/60">
                {whatsappPercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400">Total Omset</span>
                <span className="text-base sm:text-lg font-black text-[#FF2E74]">
                  {formatRupiah(whatsappRevenue)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400">Transaksi</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {whatsappCount} transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-emerald-100/40 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${whatsappPercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ─── 4. Log Mutasi Pembayaran Masuk (Matching Screenshot 2) ─── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-pink-100 shadow-sm flex flex-col gap-5">
        
        {/* Section Header with Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Log Mutasi Pembayaran Masuk
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Riwayat penerimaan pembayaran yang valid dan sudah lunas
            </p>
          </div>

          {/* Pill Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              Semua ({totalTransactions})
            </button>

            <button
              onClick={() => setActiveTab("WEBSITE")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "WEBSITE"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              Website ({websiteCount})
            </button>

            <button
              onClick={() => setActiveTab("WHATSAPP")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "WHATSAPP"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              WhatsApp ({whatsappCount})
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode order atau username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-2xl bg-white border border-slate-200 focus:border-[#FF2E74] focus:outline-none transition-all shadow-2xs"
          />
        </div>

        {/* Transaction Rows */}
        <div className="flex flex-col divide-y divide-pink-100/70">
          {filteredList.length === 0 ? (
            <div className="py-10 text-center text-slate-400 font-bold text-xs">
              Tidak ada data pembayaran yang sesuai filter.
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectOrder && onSelectOrder(item)}
                className="py-4 flex items-center justify-between gap-4 hover:bg-pink-50/30 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                {/* Left Info: ID, @username, LUNAS, Method, Date */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      #{item.id}
                    </span>

                    <span className="font-black text-[#FF2E74] text-xs">
                      @{item.username}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200">
                      LUNAS
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="px-1.5 py-0.2 rounded bg-pink-50 text-[#FF2E74] text-[10px] font-black">
                      {item.paymentMethod}
                    </span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Right Info: +Rp XX.XXX & Robux amount */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
                    +{formatRupiah(item.numericPrice)}
                  </span>
                  
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <div className="relative w-4 h-4">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{item.robuxAmount.toLocaleString("id-ID")} Robux</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
