"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { OrderItem, OrderStatus } from "@/lib/adminStore";

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
  const [isCopiedId, setIsCopiedId] = useState(false);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [isSavedNotes, setIsSavedNotes] = useState(false);
  const [isPreviewImageOpen, setIsPreviewImageOpen] = useState(false);

  const handleCopyRobloxId = () => {
    navigator.clipboard.writeText(order.robloxUserId);
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

  const handleOpenRobloxProfile = () => {
    window.open(
      `https://www.roblox.com/users/${order.robloxUserId}/profile`,
      "_blank"
    );
  };

  const handleChatCustomer = () => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Halo kak @${order.username}! Kami dari admin VietBlox terkait pesanan Robux #${order.id} (${order.robuxAmount.toLocaleString("id-ID")} Robux). Status pesanan kamu saat ini: ${order.statusLabel}. Ada yang bisa kami bantu?`
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Proses Pesanan */}
            <button
              onClick={() => onStatusChange(order.id, "diproses")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                order.status === "diproses"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/90"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Proses Pesanan</span>
            </button>

            {/* Selesaikan Order */}
            <button
              onClick={() => onStatusChange(order.id, "selesai")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                order.status === "selesai"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/90"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selesaikan Order</span>
            </button>

            {/* Batalkan */}
            <button
              onClick={() => onStatusChange(order.id, "dibatalkan")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                order.status === "dibatalkan"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Batalkan</span>
            </button>

            {/* Chat Pelanggan */}
            <button
              onClick={handleChatCustomer}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
              <span>Chat Pelanggan</span>
            </button>
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
              <span className="font-black text-[#FF2E74]">@{order.username}</span>
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

      {/* 5. Card 3: CATATAN ADMIN (Matching Screenshot 5) */}
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
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
