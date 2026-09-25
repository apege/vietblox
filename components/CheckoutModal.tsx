"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Phone,
  CheckCircle2,
  Upload,
  Loader2,
  MessageCircle,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  robuxAmount: number;
  price: string;
}

type PaymentMethod = "website" | "whatsapp" | null;
type Step = "detail" | "payment" | "qris" | "success";

const WA_NUMBER = "6281234567890";

export default function CheckoutModal({
  isOpen,
  onClose,
  username,
  robuxAmount,
  price,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("detail");
  const [waNumber, setWaNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waOpened, setWaOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mount portal target only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep("detail");
      setWaNumber("");
      setPaymentMethod(null);
      setUploadedFile(null);
      setUploadPreview(null);
      setIsSubmitting(false);
      setWaOpened(false);
    }, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProceed = () => {
    if (!waNumber.trim() || !paymentMethod) return;

    if (paymentMethod === "website") {
      setStep("qris");
    } else {
      // WhatsApp method
      const msg = encodeURIComponent(
        `Halo Admin VietBlox, saya ingin Top Up Robux:\n- Username Roblox: ${username}\n- Paket: ${robuxAmount.toLocaleString("id-ID")} Robux (${price})\n- No. WA: ${waNumber}\n\nMohon diproses ya kak!`
      );

      // Save new order to admin store
      try {
        const stored = JSON.parse(localStorage.getItem("vietblox_admin_orders_v2") || "[]");
        const newOrder = {
          id: `VBX${Math.floor(10000000 + Math.random() * 89999999)}`,
          username: username,
          robloxUserId: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
          avatarUrl: null,
          robuxAmount: robuxAmount,
          price: price,
          numericPrice: parseInt(price.replace(/[^0-9]/g, "")) || 0,
          paymentMethod: "WHATSAPP",
          status: "masuk",
          statusLabel: "Menunggu Bayar",
          date: `${new Date().getDate()} ${new Date().toLocaleString("id-ID", { month: "short" })}, ${new Date().getHours().toString().padStart(2, "0")}.${new Date().getMinutes().toString().padStart(2, "0")}`,
          fullDate: `${new Date().getDate()} ${new Date().toLocaleString("id-ID", { month: "long" })} 2026 pukul ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")} WIB`,
          phone: `+62${waNumber}`,
          customerNotes: "Pemesanan via WhatsApp Direct",
          adminNotes: "",
          paymentProof: null,
        };
        localStorage.setItem("vietblox_admin_orders_v1", JSON.stringify([newOrder, ...stored]));
      } catch (e) {
        console.error("Failed to save order", e);
      }

      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
      setWaOpened(true);
      setTimeout(() => setStep("success"), 800);
    }
  };

  const handleSubmitProof = () => {
    if (!uploadedFile) return;
    setIsSubmitting(true);

    // Save new order to admin store
    try {
      const stored = JSON.parse(localStorage.getItem("vietblox_admin_orders_v2") || "[]");
      const newOrder = {
        id: `VBX${Math.floor(10000000 + Math.random() * 89999999)}`,
        username: username,
        robloxUserId: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
        avatarUrl: null,
        robuxAmount: robuxAmount,
        price: price,
        numericPrice: parseInt(price.replace(/[^0-9]/g, "")) || 0,
        paymentMethod: "WEBSITE",
        status: "masuk",
        statusLabel: "Menunggu Bayar",
        date: `${new Date().getDate()} ${new Date().toLocaleString("id-ID", { month: "short" })}, ${new Date().getHours().toString().padStart(2, "0")}.${new Date().getMinutes().toString().padStart(2, "0")}`,
        fullDate: `${new Date().getDate()} ${new Date().toLocaleString("id-ID", { month: "long" })} 2026 pukul ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")} WIB`,
        phone: `+62${waNumber}`,
        customerNotes: "Pemesanan website QRIS (Bukti Transfer diunggah)",
        adminNotes: "",
        paymentProof: uploadPreview || "/payments/qris.svg",
      };
      localStorage.setItem("vietblox_admin_orders_v2", JSON.stringify([newOrder, ...stored]));
    } catch (e) {
      console.error("Failed to save order", e);
    }

    // Direct to WhatsApp to send confirmation & attach proof to admin
    const msg = encodeURIComponent(
      `Halo Admin VietBlox, saya sudah melakukan pembayaran via QRIS Website:\n- Username Roblox: ${username}\n- Paket: ${robuxAmount.toLocaleString("id-ID")} Robux (${price})\n- No. WA: +62${waNumber}\n\nSaya lampirkan bukti transfernya ya min. Mohon dicek dan diproses, terima kasih!`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");

    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 1000);
  };

  const canProceed = waNumber.trim().length >= 9 && paymentMethod !== null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[92vh] sm:max-h-[95vh] overflow-y-auto">
        
        {/* Mobile Pull Handle Indicator */}
        <div className="w-full pt-2.5 pb-1 flex items-center justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* STEP: detail — isi WA + pilih metode */}
        {/* ═══════════════════════════════════════ */}
        {step === "detail" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 pt-2 sm:pt-5 pb-3 sm:pb-4 border-b border-pink-100">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">Detail Pesanan</h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">Lengkapi info pembayaran kamu</p>
              </div>
              <button onClick={handleClose} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              </button>
            </div>

            <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex flex-col gap-3.5 sm:gap-4 pb-6 sm:pb-5">
              {/* Rekap Order */}
              <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#FFF0F5] border border-pink-100">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
                  <Image src="/robux.webp" alt="Robux" fill className="object-contain" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Username Roblox</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{username}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs sm:text-sm font-black text-[#FF2E74]">{robuxAmount.toLocaleString("id-ID")} Robux</span>
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-600">{price}</span>
                </div>
              </div>

              {/* Input No. WA */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF2E74]" />
                  Nomor WhatsApp Kamu
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:border-[#FF2E74] focus-within:ring-2 focus-within:ring-pink-100 bg-slate-50 transition-all">
                  <span className="text-xs font-bold text-slate-500 flex-shrink-0">+62</span>
                  <div className="w-px h-4 bg-slate-200 flex-shrink-0" />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="8123456789"
                    className="flex-1 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
                    maxLength={13}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium pl-1">Dipakai untuk konfirmasi pembayaran via admin</p>
              </div>

              {/* Pilih Metode Pembayaran */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-slate-800">Metode Pembayaran</label>

                {/* Via Website (QRIS) */}
                <button
                  onClick={() => setPaymentMethod("website")}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                    paymentMethod === "website"
                      ? "border-[#FF2E74] bg-[#FFF0F5]"
                      : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Globe className="w-5 h-5 text-[#FF2E74]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900">Bayar via Website</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">QRIS · Transfer · Upload bukti bayar</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <img src="/payments/qris.svg" alt="QRIS" className="h-5 w-auto" />
                    </div>
                    <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "website" ? "border-[#FF2E74] bg-[#FF2E74]" : "border-slate-300"}`}>
                      {paymentMethod === "website" && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                </button>

                {/* Via WhatsApp */}
                <button
                  onClick={() => setPaymentMethod("whatsapp")}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                    paymentMethod === "whatsapp"
                      ? "border-[#25D366] bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MessageCircle className="w-5 h-5 text-white fill-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900">Order via WhatsApp</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Chat admin langsung · Proses manual cepat</p>
                  </div>
                  <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === "whatsapp" ? "border-[#25D366] bg-[#25D366]" : "border-slate-300"}`}>
                    {paymentMethod === "whatsapp" && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </button>
              </div>

              {/* CTA */}
              <button
                onClick={handleProceed}
                disabled={!canProceed}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF6B6B] text-white font-black text-sm shadow-[0_6px_20px_rgba(255,46,116,0.35)] hover:shadow-[0_8px_25px_rgba(255,46,116,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all"
              >
                <span>Lanjut ke Pembayaran</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════ */}
        {/* STEP: qris — tampil QRIS + upload  */}
        {/* ═══════════════════════════════════ */}
        {step === "qris" && (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-pink-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Pembayaran QRIS</h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Scan QR · lalu upload bukti bayar</p>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Order Summary Strip */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FFF0F5] border border-pink-100">
                <span className="text-xs font-semibold text-slate-600">Total Bayar</span>
                <span className="text-sm font-black text-[#FF2E74]">{price}</span>
              </div>

              {/* QRIS Code */}
              <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 border-dashed border-pink-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scan QRIS Berikut</p>
                <div className="w-48 h-48 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
                  {/* QRIS placeholder — replace src with real QRIS image */}
                  <img
                    src="/payments/qris.svg"
                    alt="QRIS VietBlox"
                    className="w-40 h-40 object-contain p-2"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 w-full">
                  <p className="text-[11px] font-semibold text-slate-500">QRIS • Semua E-Wallet & Mobile Banking</p>
                </div>
              </div>

              {/* Upload Bukti Bayar (Wajib) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#FF2E74]" />
                    Upload Bukti Pembayaran <span className="text-[#FF2E74]">*</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${uploadedFile ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                    {uploadedFile ? "Sudah diupload" : "Wajib diupload"}
                  </span>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                    uploadPreview
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-300 bg-slate-50 hover:border-pink-300 hover:bg-pink-50/40"
                  }`}
                >
                  {uploadPreview ? (
                    <div className="relative w-full h-36">
                      <img src={uploadPreview} alt="Bukti bayar" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-emerald-700 font-bold text-xs shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Foto dipilih — klik untuk ganti
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-8 px-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 text-center">Klik untuk upload foto bukti transfer<br /><span className="font-normal text-[10px] text-slate-400">JPG, PNG, HEIC maks. 10MB</span></p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Submit Proof Button */}
              <button
                onClick={handleSubmitProof}
                disabled={!uploadedFile || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all ${
                  uploadedFile
                    ? "bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF6B6B] text-white shadow-[0_6px_20px_rgba(255,46,116,0.35)] hover:shadow-[0_8px_25px_rgba(255,46,116,0.5)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembayaran</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStep("detail")}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors text-center"
              >
                ← Kembali
              </button>
            </div>
          </>
        )}

        {/* ═══════════════════════════ */}
        {/* STEP: success               */}
        {/* ═══════════════════════════ */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-5 px-6 pt-8 pb-8 text-center">
            {/* Success Icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 text-xl animate-bounce">🎉</div>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black text-slate-900">Pesanan Terkirim!</h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {paymentMethod === "whatsapp"
                  ? "Admin kami akan segera memproses pesanan kamu. Cek WhatsApp untuk konfirmasi selanjutnya."
                  : "Detail pesanan sudah diarahkan ke WhatsApp Admin. Kirim bukti transfer di chat dan Robux akan segera diproses!"}
              </p>
            </div>

            {/* Order recap */}
            <div className="w-full p-4 rounded-2xl bg-[#FFF0F5] border border-pink-100 flex flex-col gap-2 text-left">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-semibold">Username</span>
                <span className="text-xs font-black text-slate-900">{username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-semibold">Paket</span>
                <span className="text-xs font-black text-[#FF2E74]">{robuxAmount.toLocaleString("id-ID")} Robux</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-semibold">Total</span>
                <span className="text-xs font-black text-emerald-600">{price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500 font-semibold">No. WA</span>
                <span className="text-xs font-black text-slate-900">+62{waNumber}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-medium">Estimasi masuk: <span className="font-bold text-slate-600">1–3 menit</span></p>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#FF6B6B] text-white font-black text-sm shadow-[0_6px_20px_rgba(255,46,116,0.35)] hover:opacity-90 transition-all"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
