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
  Plus,
  Star,
  MessageCircle,
} from "lucide-react";
import { OrderItem, OrderStatus, cleanUsername } from "@/lib/adminStore";
import CreateManualOrderModal from "./CreateManualOrderModal";

interface OrderListViewProps {
  orders: OrderItem[];
  currentStatusFilter?: OrderStatus | "all";
  onSelectOrder: (order: OrderItem) => void;
  onQuickProcess: (order: OrderItem) => void;
  onRefreshData: () => void;
  onOrderCreated?: (newOrder: OrderItem) => void;
}

export default function OrderListView({
  orders,
  currentStatusFilter = "masuk",
  onSelectOrder,
  onQuickProcess,
  onRefreshData,
  onOrderCreated,
}: OrderListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickProcessedId, setQuickProcessedId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleSendReviewWA = (e: React.MouseEvent, order: OrderItem) => {
    e.stopPropagation();
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const trackingUrl = typeof window !== "undefined"
      ? `${window.location.origin}/tracking?order_code=${order.id}&review=true`
      : `https://vietblox.com/tracking?order_code=${order.id}&review=true`;

    const msg = encodeURIComponent(
      `Halo kak @${cleanUsername(order.username)}! 🎉\n\nPesanan Top Up ${order.robuxAmount.toLocaleString("id-ID")} Robux kamu (#${order.id}) telah selesai kami kirimkan dan Robux sudah masuk utuh ke akun Roblox kamu! ✨\n\nBoleh minta tolong luangkan waktu sebentar untuk beri ulasan & bintang 5 kepuasan kamu ya kak di link ini:\n⭐ ${trackingUrl}\n\nUlasan dari kakak sangat berharga bagi kami. Terima kasih banyak telah berbelanja di VietBlox! 💕`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
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

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] hover:opacity-95 text-white text-xs font-black shadow-md shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Order & Link Aktivasi</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#FF2E74] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar & Count Card (Matching Screenshot 3) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    <span className="text-base sm:text-lg font-black text-[#FF2E74] tracking-tight group-hover:underline font-mono">
                      #{order.id}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-black border shadow-2xs ${
                        order.status === "masuk"
                          ? "bg-amber-100/80 text-amber-900 border-amber-300"
                          : order.status === "diproses"
                          ? "bg-blue-100/80 text-blue-900 border-blue-300"
                          : order.status === "selesai"
                          ? "bg-emerald-100/80 text-emerald-900 border-emerald-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {order.statusLabel}
                    </span>
                  </div>

                  {/* Username, Date, Method Badge, Proof */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 flex-wrap">
                    <span className="font-black text-slate-900">@{cleanUsername(order.username)}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{order.date}</span>
                    <span className="text-slate-400">•</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide border shadow-2xs ${
                        order.paymentMethod === "WHATSAPP"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-pink-100 text-[#FF2E74] border-pink-300"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {order.paymentProof ? "• (Ada bukti bayar)" : "• (Tanpa foto)"}
                    </span>
                    {order.activationUrl && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs">
                        ⚡ Link ID 97K Siap
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Robux Amount, Price & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                  
                  {/* Robux Amount & Price */}
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900">
                      <div className="relative w-4.5 h-4.5 shrink-0">
                        <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
                      </div>
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

                    {/* Minta Review Button for Order Selesai */}
                    {order.status === "selesai" && (
                      <button
                        onClick={(e) => handleSendReviewWA(e, order)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-amber-800 font-black text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Kirim pesan minta review testimoni ke WhatsApp customer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Minta Review</span>
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

      {/* Create Manual Order Modal */}
      <CreateManualOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={(newOrder) => {
          if (onOrderCreated) {
            onOrderCreated(newOrder);
          } else {
            onRefreshData();
          }
        }}
      />

    </div>
  );
}
