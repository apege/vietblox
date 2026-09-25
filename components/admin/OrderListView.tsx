"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  RotateCcw,
  Search,
  ArrowRight,
  Sparkles,
  Check,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { OrderItem, OrderStatus } from "@/lib/adminStore";

interface OrderListViewProps {
  orders: OrderItem[];
  currentStatusFilter?: OrderStatus | "all";
  onSelectOrder: (order: OrderItem) => void;
  onQuickProcess: (order: OrderItem) => void;
  onRefreshData: () => void;
}

export default function OrderListView({
  orders,
  currentStatusFilter = "masuk",
  onSelectOrder,
  onQuickProcess,
  onRefreshData,
}: OrderListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickProcessedId, setQuickProcessedId] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleProcessClick = (e: React.MouseEvent, order: OrderItem) => {
    e.stopPropagation();
    onQuickProcess(order);
    setQuickProcessedId(order.id);
    setTimeout(() => setQuickProcessedId(null), 1500);
  };

  // Filter orders
  const filteredList = useMemo(() => {
    return orders.filter((order) => {
      // Status match
      if (currentStatusFilter !== "all" && order.status !== currentStatusFilter) {
        return false;
      }
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          order.id.toLowerCase().includes(q) ||
          order.username.toLowerCase().includes(q) ||
          order.robloxUserId.includes(q) ||
          order.phone.includes(q)
        );
      }
      return true;
    });
  }, [orders, currentStatusFilter, searchQuery]);

  // Dynamic titles
  const getHeaderTitle = () => {
    switch (currentStatusFilter) {
      case "masuk":
        return "Order Masuk";
      case "diproses":
        return "Order Diproses";
      case "selesai":
        return "Order Selesai";
      case "dibatalkan":
        return "Order Dibatalkan";
      default:
        return "Semua Pesanan";
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      
      {/* 1. Page Header (Matching Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {getHeaderTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Kelola dan proses seluruh pesanan Robux baru yang masuk ke VietBlox
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-[#FF2E74] ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Search Bar & Count Card (Matching Screenshot 3) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter order atau username..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#FF2E74] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Menampilkan <span className="font-black text-slate-800">{filteredList.length}</span> pesanan
        </span>
      </div>

      {/* 3. Orders List Cards (Matching Screenshot 3) */}
      {filteredList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-pink-100 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] border border-pink-200 flex items-center justify-center text-[#FF2E74]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-800">Tidak ada pesanan ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Tidak ada transaksi yang cocok dengan filter atau kata kunci saat ini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredList.map((order) => {
            const isJustProcessed = quickProcessedId === order.id;

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-100/90 shadow-[0_4px_20px_rgba(255,182,193,0.12)] hover:shadow-[0_8px_25px_rgba(255,182,193,0.22)] hover:border-pink-200 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
              >
                {/* Left: ID, Status, Username, Date, Payment Tag, Proof indicator */}
                <div className="flex flex-col gap-1.5 min-w-0">
                  {/* Order ID & Status Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-[#FF2E74] tracking-tight group-hover:underline">
                      #{order.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black border ${
                        order.status === "masuk"
                          ? "bg-amber-50 text-amber-700 border-amber-200/90"
                          : order.status === "diproses"
                          ? "bg-blue-50 text-blue-700 border-blue-200/90"
                          : order.status === "selesai"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/90"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {order.statusLabel}
                    </span>
                  </div>

                  {/* Username, Date, Method Badge, Proof */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
                    <span className="font-extrabold text-slate-900">@{order.username}</span>
                    <span>•</span>
                    <span>{order.date}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${
                        order.paymentMethod === "WHATSAPP"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-pink-50 text-[#FF2E74] border-pink-200"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {order.paymentProof ? "(Ada bukti bayar)" : "(Tanpa foto)"}
                    </span>
                  </div>
                </div>

                {/* Right: Robux Amount, Price & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  
                  {/* Robux Amount & Price */}
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900">
                      <Image src="/robux.webp" alt="Robux" width={16} height={16} />
                      <span>{order.robuxAmount.toLocaleString("id-ID")} Robux</span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-[#FF2E74] mt-0.5">
                      {order.price}
                    </span>
                  </div>

                  {/* Action Buttons: Proses / Selesai & Detail */}
                  <div className="flex items-center gap-2">
                    {/* Quick Process Button for Order Masuk */}
                    {order.status === "masuk" && (
                      <button
                        onClick={(e) => handleProcessClick(e, order)}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {isJustProcessed ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Diproses</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-blue-600" />
                            <span>Proses</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Quick Complete Button for Order Diproses */}
                    {order.status === "diproses" && (
                      <button
                        onClick={(e) => handleProcessClick(e, order)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {isJustProcessed ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Selesai!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Selesai</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Detail Button */}
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-extrabold text-xs shadow-xs hover:shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
