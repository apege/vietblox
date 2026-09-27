"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  User,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Sparkles,
  Wand2,
  RefreshCw,
  Star,
} from "lucide-react";
import { OrderItem, OrderStatus, cleanUsername } from "@/lib/adminStore";

interface OrderDetailViewProps {
  order: OrderItem;
  onBack: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onSaveAdminNotes: (orderId: string, notes: string) => void;
}

export default function OrderDetailView({
  order,
  onBack,
  onStatusChange,
  onSaveAdminNotes,
}: OrderDetailViewProps) {
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [activationUrl, setActivationUrl] = useState(order.activationUrl || "");
  const [resolvedUserId, setResolvedUserId] = useState<string>(order.robloxUserId || "");
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [isSavedNotes, setIsSavedNotes] = useState(false);
  const [isSavedActivation, setIsSavedActivation] = useState(false);
  const [isPreviewImageOpen, setIsPreviewImageOpen] = useState(false);

  // Fetch Roblox user ID if missing
  useEffect(() => {
    if (!resolvedUserId && order.username) {
      fetch(`/api/check-roblox?username=${encodeURIComponent(order.username)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.valid && d.id) {
            setResolvedUserId(String(d.id));
          }
        })
        .catch(() => {});
    }
  }, [order.username, resolvedUserId]);

  // Auto-fill activation URL on load if not set
  useEffect(() => {
    if (!activationUrl) {
      try {
        const savedConfig = localStorage.getItem("vietblox_store_config_v2");
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          if (parsed.defaultActivationUrl?.trim()) {
            setActivationUrl(parsed.defaultActivationUrl.trim());
            return;
          }
        }
      } catch {
        // ignore
      }

      const uid = resolvedUserId || order.robloxUserId;
      if (uid) {
        setActivationUrl(`https://www.roblox.com/users/${uid}/inventory#!/game-passes`);
      } else {
        setActivationUrl(`https://www.roblox.com/search/users?keyword=${encodeURIComponent(order.username)}`);
      }
    }
  }, [order.id, order.robloxUserId, order.username, resolvedUserId, activationUrl]);

  const handleCopyRobloxId = () => {
    navigator.clipboard.writeText(resolvedUserId || order.robloxUserId);
    setIsCopiedId(true);
    setTimeout(() => setIsCopiedId(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(order.phone);
    setIsCopiedPhone(true);
    setTimeout(() => setIsCopiedPhone(false), 2000);
  };

  const handleSaveNotes = () => {
    onSaveAdminNotes(order.id, adminNotes);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const handleSaveActivation = async (urlToSave?: string) => {
    const targetUrl = (typeof urlToSave === "string" ? urlToSave : activationUrl).trim();
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: order.id,
          activationUrl: targetUrl,
        }),
      });
    } catch (e) {
      console.error("Failed to save activation URL:", e);
    }
    setIsSavedActivation(true);
    setTimeout(() => setIsSavedActivation(false), 2000);
  };

  const handleApplyPreset = async (type: "gamepass" | "profile" | "default" | "wa") => {
    let url = "";
    let uid = resolvedUserId || order.robloxUserId;

    if (!uid && (type === "gamepass" || type === "profile")) {
      try {
        const res = await fetch(`/api/check-roblox?username=${encodeURIComponent(order.username)}`);
        const d = await res.json();
        if (d.valid && d.id) {
          uid = String(d.id);
          setResolvedUserId(uid);
        }
      } catch {}
    }

    if (type === "gamepass") {
      url = uid
        ? `https://www.roblox.com/users/${uid}/inventory#!/game-passes`
        : `https://www.roblox.com/users/${encodeURIComponent(order.username)}/inventory#!/game-passes`;
    } else if (type === "profile") {
      url = uid
        ? `https://www.roblox.com/users/${uid}/profile`
        : `https://www.roblox.com/search/users?keyword=${encodeURIComponent(order.username)}`;
    } else if (type === "default") {
      url = getPresetStoreDefault();
    } else if (type === "wa") {
      url = getPresetWaActivation();
    }

    if (url) {
      setActivationUrl(url);
      handleSaveActivation(url);
    }
  };

  const getPresetStoreDefault = () => {
    try {
      const savedConfig = localStorage.getItem("vietblox_store_config_v2");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.defaultActivationUrl?.trim()) {
          return parsed.defaultActivationUrl.trim();
        }
      }
    } catch {
      // ignore
    }
    return "";
  };

  const getPresetWaActivation = () => {
    return `https://wa.me/6281234567890?text=${encodeURIComponent(
      `Halo Admin VietBlox, saya ingin aktivasi ID 97K pesanan #${order.id} (Username: @${cleanUsername(order.username)})`
    )}`;
  };

  const handleOpenRobloxProfile = () => {
    window.open(
      `https://www.roblox.com/users/${order.robloxUserId}/profile`,
      "_blank"
    );
  };

  const [isCopiedTracking, setIsCopiedTracking] = useState(false);

  const getTrackingUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/tracking?order_code=${order.id}`;
    }
    return `https://vietblox.com/tracking?order_code=${order.id}`;
  };

  const handleCopyTrackingLink = () => {
    const url = getTrackingUrl();
    navigator.clipboard.writeText(url);
    setIsCopiedTracking(true);
    setTimeout(() => setIsCopiedTracking(false), 2000);
  };

  const handleSendTrackingWA = () => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const trackingUrl = getTrackingUrl();
    const msg = encodeURIComponent(
      `Halo kak @${cleanUsername(order.username)}! 👋\n\nPesanan Robux kamu di VietBlox:\n📦 Invoice: #${order.id}\n💎 Nominal: ${order.robuxAmount.toLocaleString("id-ID")} Robux\n📊 Status: ${order.statusLabel}\n\nKamu bisa langsung cek status pengiriman dan aktivasi Robux kamu di link ini:\n🔗 ${trackingUrl}\n\nTerima kasih sudah berbelanja di VietBlox! 💕`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  const handleSendReviewWA = () => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const trackingUrl = `${getTrackingUrl()}&review=true`;
    const msg = encodeURIComponent(
      `Halo kak @${cleanUsername(order.username)}! 🎉\n\nPesanan Top Up ${order.robuxAmount.toLocaleString("id-ID")} Robux kamu (#${order.id}) telah selesai kami kirimkan dan Robux sudah masuk utuh ke akun Roblox kamu! ✨\n\nBoleh minta tolong luangkan waktu sebentar untuk beri ulasan & bintang 5 kepuasan kamu ya kak di link ini:\n⭐ ${trackingUrl}\n\nUlasan dari kakak sangat berharga bagi kami. Terima kasih banyak telah berbelanja di VietBlox! 💕`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  const handleOpenTrackingPage = () => {
    window.open(`/tracking?order_code=${order.id}`, "_blank");
  };

  const handleChatCustomer = () => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Halo kak @${cleanUsername(order.username)}! Kami dari admin VietBlox terkait pesanan Robux #${order.id} (${order.robuxAmount.toLocaleString("id-ID")} Robux). Status pesanan kamu saat ini: ${order.statusLabel}. Ada yang bisa kami bantu?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Back Navigation Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-700 hover:text-[#FF2E74] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF2E74]" />
          <span>Kembali ke Order Masuk</span>
        </button>
      </div>

      {/* 2. Order Header & Quick Status Action Bar */}
      <div className="flex flex-col gap-4">
        
        {/* Title & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-black text-[#FF2E74] tracking-tight">
              ORDER #{order.id}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {order.fullDate}
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black border ${
                order.status === "masuk"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : order.status === "diproses"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : order.status === "selesai"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {order.statusLabel}
            </span>
          </div>
        </div>

        {/* Quick Status Buttons Row (Matching Screenshot 4) */}
        <div className="p-4 sm:p-4.5 rounded-3xl bg-white border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Ubah Status Cepat:
          </span>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            {/* Proses Pesanan */}
            <button
              onClick={() => onStatusChange(order.id, "diproses")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                order.status === "diproses"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/90"
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Proses Pesanan</span>
            </button>

            {/* Selesaikan Order */}
            <button
              onClick={() => onStatusChange(order.id, "selesai")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                order.status === "selesai"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/90"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Selesaikan Order</span>
            </button>

            {/* Batalkan */}
            <button
              onClick={() => onStatusChange(order.id, "dibatalkan")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                order.status === "dibatalkan"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90"
              }`}
            >
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Batalkan</span>
            </button>

            {/* Chat Pelanggan */}
            <button
              onClick={handleChatCustomer}
              className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white shrink-0" />
              <span>Chat Pelanggan</span>
            </button>

            {/* Kirim WA Minta Review (Only when order Selesai) */}
            {order.status === "selesai" && (
              <button
                onClick={handleSendReviewWA}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-300 text-amber-800 font-black text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                title="Kirim pesan WhatsApp minta review & testimoni kepuasan pelanggan"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span>Minta Review WA</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. Card 1: DETAIL PESANAN (Matching Screenshot 4) */}
      <div className="rounded-3xl bg-white border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] p-5 sm:p-7 flex flex-col gap-5">
        
        {/* Card Header with Icon */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-pink-100">
          <div className="w-7 h-7 rounded-lg bg-[#FFF0F5] border border-pink-200 flex items-center justify-center text-[#FF2E74]">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
            Detail Pesanan
          </h3>
        </div>

        {/* Table Header: PRODUK | HARGA */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
            <span>Produk</span>
            <span>Harga</span>
          </div>

          {/* Product Row */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0">
                <Image src="/robux.webp" alt="Robux" width={22} height={22} />
              </div>
              <span className="text-sm sm:text-base font-black text-slate-900">
                {order.robuxAmount.toLocaleString("id-ID")} Robux
              </span>
            </div>
            <span className="text-sm sm:text-base font-black text-slate-900">
              {order.price}
            </span>
          </div>

          {/* Metode Pembayaran Row */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <span className="text-xs sm:text-sm font-bold text-slate-600">
              Metode Pembayaran
            </span>
            <span
              className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                order.paymentMethod === "WHATSAPP"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-pink-50 text-[#FF2E74] border-pink-200"
              }`}
            >
              {order.paymentMethod}
            </span>
          </div>

          {/* Total Pembayaran Row */}
          <div className="flex items-center justify-between py-3 border-t border-slate-100">
            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
              Total Pembayaran
            </span>
            <span className="text-lg sm:text-xl font-black text-[#FF2E74]">
              {order.price}
            </span>
          </div>

          {/* Bukti Transfer Box */}
          <div className="pt-2">
            {order.paymentProof ? (
              <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    Bukti Pembayaran Terunggah:
                  </span>
                  <button
                    onClick={() => setIsPreviewImageOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF2E74] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Ukuran Penuh</span>
                  </button>
                </div>
                <div
                  onClick={() => setIsPreviewImageOpen(true)}
                  className="relative w-32 h-32 rounded-xl overflow-hidden border border-pink-200 bg-white cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={order.paymentProof}
                    alt="Bukti Transfer"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xs font-medium text-slate-400">
                  Foto bukti transfer telah dibersihkan oleh sistem retensi atau tidak diunggah.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 4. Card 2: INFORMASI PELANGGAN (Matching Screenshot 5) */}
      <div className="rounded-3xl bg-white border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] p-5 sm:p-7 flex flex-col gap-4">
        
        {/* Card Header with Icon */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-pink-100">
          <div className="w-7 h-7 rounded-lg bg-[#FFF0F5] border border-pink-200 flex items-center justify-center text-[#FF2E74]">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
            Informasi Pelanggan
          </h3>
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-slate-100 text-xs sm:text-sm">
          
          {/* Username */}
          <div className="flex items-center justify-between py-3">
            <span className="font-bold text-slate-500">Username</span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-[#FF2E74]">@{cleanUsername(order.username)}</span>
              <button
                onClick={handleOpenRobloxProfile}
                title="Buka profil Roblox"
                className="text-slate-400 hover:text-[#FF2E74] transition-colors p-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* User ID Roblox */}
          <div className="flex items-center justify-between py-3">
            <span className="font-bold text-slate-500">User ID Roblox</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 font-mono">
                {order.robloxUserId}
              </span>
              <button
                onClick={handleCopyRobloxId}
                title="Salin User ID"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-pink-100 text-slate-600 hover:text-[#FF2E74] flex items-center justify-center transition-all cursor-pointer"
              >
                {isCopiedId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* No. WhatsApp */}
          <div className="flex items-center justify-between py-3">
            <span className="font-bold text-slate-500">No. WhatsApp</span>
            <div className="flex items-center gap-2">
              <div
                onClick={handleChatCustomer}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-extrabold text-xs cursor-pointer transition-colors"
              >
                <MessageCircle className="w-3 h-3 fill-emerald-600 text-white" />
                <span>{order.phone}</span>
              </div>
              <button
                onClick={handleCopyPhone}
                title="Salin Nomor WhatsApp"
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-all cursor-pointer"
              >
                {isCopiedPhone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Catatan Pelanggan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3">
            <span className="font-bold text-slate-500">Catatan Pelanggan</span>
            <span className="font-semibold text-slate-800 text-left sm:text-right">
              {order.customerNotes || "-"}
            </span>
          </div>

        </div>
      </div>

      {/* 4.5 Card: LINK CEK ORDER & TRACKING PELANGGAN */}
      <div className="rounded-3xl bg-gradient-to-br from-pink-50/70 via-white to-rose-50/50 border-2 border-pink-200 shadow-[0_6px_25px_rgba(255,46,116,0.12)] p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF2E74] text-white flex items-center justify-center font-bold shadow-xs">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Link Cek Order Pelanggan
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Kirimkan link ini ke pembeli agar mereka bisa langsung melihat status order & aktivasi ID 97K
              </p>
            </div>
          </div>
        </div>

        {/* Link Box & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-pink-200 font-mono text-xs font-bold text-slate-800 select-all truncate shadow-2xs">
            {getTrackingUrl()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTrackingLink}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-pink-200 hover:border-pink-300 text-[#FF2E74] font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
            >
              {isCopiedTracking ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleSendTrackingWA}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Kirim ke WA</span>
            </button>

            <button
              onClick={handleOpenTrackingPage}
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              title="Pratinjau Halaman Cek Order"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Card: LINK AKTIVASI / GAMEPASS (Untuk Halaman Tracking Customer) */}
      <div className="rounded-3xl bg-white border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] border border-pink-200 flex items-center justify-center text-[#FF2E74]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
                  Link Aktivasi ID 97K / Gamepass
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-[#FF2E74] text-[10px] font-black">
                  Otomatis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Link ini otomatis aktif pada tombol <strong>Aktivasi ID 97K Sekarang</strong> di halaman Tracking customer.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Auto-Generate Presets Toolbar */}
        <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#FF2E74]" />
              Pilihan Cepat / Auto-Generate Link (1-Klik):
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Klik untuk mengisi otomatis</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Preset 1: Roblox Gamepass Inventory */}
            <button
              type="button"
              onClick={() => handleApplyPreset("gamepass")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-pink-200 hover:border-[#FF2E74] hover:bg-pink-50/50 text-slate-800 hover:text-[#FF2E74] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <span>🎮 Gamepass Roblox @{order.username}</span>
            </button>

            {/* Preset 2: Roblox Profile */}
            <button
              type="button"
              onClick={() => handleApplyPreset("profile")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <span>👤 Profil Roblox</span>
            </button>

            {/* Preset 3: Default Toko */}
            {getPresetStoreDefault() && (
              <button
                type="button"
                onClick={() => handleApplyPreset("default")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-300 hover:bg-pink-100 text-[#FF2E74] text-xs font-extrabold shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <span>⭐ Pakai Link Default Toko</span>
              </button>
            )}

            {/* Preset 4: WA CS */}
            <button
              type="button"
              onClick={() => handleApplyPreset("wa")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <span>💬 Direct WA CS</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={activationUrl}
              onChange={(e) => setActivationUrl(e.target.value)}
              placeholder="https://roblox.com/game-pass/... atau https://..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#FF2E74] text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-pink-100 transition-all font-mono"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => handleSaveActivation()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              {isSavedActivation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Aktivasi Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Link Aktivasi</span>
              )}
            </button>

            {activationUrl && (
              <a
                href={activationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#FF2E74] hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all"
              >
                <span>Tes Buka Link Aktivasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 6. Card 3: CATATAN ADMIN (Matching Screenshot 5) */}
      <div className="rounded-3xl bg-white border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] p-5 sm:p-7 flex flex-col gap-4">
        
        {/* Card Header with Icon */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-pink-100">
          <div className="w-7 h-7 rounded-lg bg-[#FFF0F5] border border-pink-200 flex items-center justify-center text-[#FF2E74]">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
            Catatan Admin
          </h3>
        </div>

        {/* Textarea Input */}
        <div className="flex flex-col gap-3">
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
            placeholder="Tulis catatan untuk order ini (hanya admin)..."
            className="w-full p-4 rounded-2xl bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#FF2E74] text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-pink-100 transition-all resize-none"
          />

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSaveNotes}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,46,116,0.3)] hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              {isSavedNotes ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Catatan Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Catatan</span>
              )}
            </button>

            {isSavedNotes && (
              <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                ✓ Berhasil disimpan
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Proof Image Fullscreen Modal */}
      {isPreviewImageOpen && order.paymentProof && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsPreviewImageOpen(false)}
        >
          <div className="relative max-w-xl w-full bg-white rounded-3xl p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-3">
              <h4 className="text-sm font-black text-slate-900">Bukti Pembayaran #{order.id}</h4>
              <button
                onClick={() => setIsPreviewImageOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full h-80 relative flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden">
              <img
                src={order.paymentProof}
                alt="Bukti Transfer Penuh"
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
