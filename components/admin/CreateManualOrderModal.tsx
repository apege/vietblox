"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  User,
  Plus,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Loader2,
  ShieldCheck,
  Link as LinkIcon,
  Phone,
  Layers,
  Wand2,
} from "lucide-react";
import { OrderItem, RobuxPackage, cleanUsername } from "@/lib/adminStore";

interface CreateManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (newOrder: OrderItem) => void;
  packages?: RobuxPackage[];
}

export default function CreateManualOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
  packages = [],
}: CreateManualOrderModalProps) {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isCheckingAvatar, setIsCheckingAvatar] = useState(false);
  const [phone, setPhone] = useState("");
  const [robuxAmount, setRobuxAmount] = useState<number>(1200);
  const [price, setPrice] = useState<string>("Rp 104.000");
  const [status, setStatus] = useState<"diproses" | "masuk" | "selesai">("diproses");
  const [activationUrl, setActivationUrl] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"WHATSAPP" | "WEBSITE">("WHATSAPP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Auto-fill activation link from default store config on open
  useEffect(() => {
    if (isOpen && !activationUrl) {
      try {
        const saved = localStorage.getItem("vietblox_store_config_v2");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.defaultActivationUrl?.trim()) {
            setActivationUrl(parsed.defaultActivationUrl.trim());
          }
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, activationUrl]);

  // Check Roblox avatar when username changes
  useEffect(() => {
    if (!username.trim() || username.length < 3) {
      setAvatarUrl(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingAvatar(true);
      try {
        const res = await fetch(`/api/check-roblox?username=${encodeURIComponent(username.trim())}`);
        const data = await res.json();
        if (data.valid && data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        } else {
          setAvatarUrl(null);
        }
      } catch {
        setAvatarUrl(null);
      } finally {
        setIsCheckingAvatar(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Preset packages
  const presets = [
    { robux: 400, price: "Rp 35.000" },
    { robux: 800, price: "Rp 70.000" },
    { robux: 1200, price: "Rp 104.000" },
    { robux: 2000, price: "Rp 175.000" },
    { robux: 5000, price: "Rp 435.000" },
    { robux: 10000, price: "Rp 850.000" },
  ];

  const handleSelectPreset = (p: { robux: number; price: string }) => {
    setRobuxAmount(p.robux);
    setPrice(p.price);
  };

  const handleReset = () => {
    setUsername("");
    setAvatarUrl(null);
    setPhone("");
    setRobuxAmount(1200);
    setPrice("Rp 104.000");
    setStatus("diproses");
    setActivationUrl("");
    setCreatedOrder(null);
    setIsCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSubmitting(true);

    const statusMap = {
      diproses: "processing",
      masuk: "pending",
      selesai: "completed",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robloxUsername: username.trim(),
          customerPhone: phone.trim() ? (phone.startsWith("+62") ? phone : `+62${phone.replace(/^0/, "")}`) : "-",
          robuxAmount: robuxAmount,
          price: price,
          paymentMethod: paymentMethod,
          orderStatus: statusMap[status],
          paymentStatus: status === "masuk" ? "pending" : "paid",
          activationUrl: activationUrl.trim() || null,
          customerNotes: `Order manual via ${paymentMethod} oleh Admin`,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        const numericPrice = typeof price === "number" ? price : parseInt(String(price).replace(/[^0-9]/g, "")) || 0;
        const now = new Date();
        const shortDate = `${now.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][now.getMonth()]}, ${String(now.getHours()).padStart(2,"0")}.${String(now.getMinutes()).padStart(2,"0")}`;

        const statusLabels: Record<string, string> = {
          masuk: "Menunggu Bayar",
          diproses: "Sedang Diproses",
          selesai: "Selesai",
        };

        const newOrderItem: OrderItem = {
          id: data.order.orderCode,
          username: username.trim(),
          robloxUserId: "",
          avatarUrl: avatarUrl,
          robuxAmount: robuxAmount,
          price: typeof price === "string" && price.startsWith("Rp") ? price : `Rp ${numericPrice.toLocaleString("id-ID")}`,
          numericPrice: numericPrice,
          paymentMethod: paymentMethod,
          status: status,
          statusLabel: statusLabels[status],
          date: shortDate,
          fullDate: shortDate,
          phone: phone,
          customerNotes: "Order manual oleh Admin",
          activationUrl: activationUrl.trim() || null,
        };

        onOrderCreated(newOrderItem);
        setCreatedOrder(newOrderItem);
      } else {
        alert(data.error || "Gagal membuat pesanan manual");
      }
    } catch (err: any) {
      console.error("Failed to create manual order:", err);
      alert("Terjadi kesalahan saat menyimpan pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTrackingUrl = () => {
    if (!createdOrder) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vietblox.store";
    return `${origin}/tracking?q=${encodeURIComponent(createdOrder.username)}`;
  };

  const handleCopyLink = () => {
    const url = getTrackingUrl();
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendWA = () => {
    if (!createdOrder) return;
    const url = getTrackingUrl();
    const cleanPhone = createdOrder.phone ? createdOrder.phone.replace(/[^0-9]/g, "") : "";
    const msg = encodeURIComponent(
      `Halo kak @${cleanUsername(createdOrder.username)}! 👋\n\nPesanan Top Up ${createdOrder.robuxAmount.toLocaleString("id-ID")} Robux kamu (#${createdOrder.id}) sedang kami proses.\n\nSilakan cek status pesanan & panduan aktivasi ID 97K kamu di link berikut:\n🔗 ${url}\n\nTerima kasih telah order di VietBlox!`
    );

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${msg}`
      : `https://wa.me/?text=${msg}`;

    window.open(waUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-pink-100 shadow-2xl flex flex-col gap-4 p-6 sm:p-7 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF2E74] to-[#FF5588] text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                {createdOrder ? "Link Tracking Berhasil Dibuat!" : "Buat Order Manual & Link Aktivasi"}
              </h2>
              <p className="text-[11px] font-medium text-slate-400">
                {createdOrder
                  ? "Bagikan link di bawah ke customer WhatsApp"
                  : "Input pesanan dari WA untuk langsung generate link aktivasi"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body or Success View */}
        {createdOrder ? (
          /* SUCCESS VIEW: Link Box + WhatsApp Direct Button */
          <div className="flex flex-col gap-4 py-2">
            <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-pink-200 flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white border border-pink-200 flex-shrink-0 flex items-center justify-center shadow-xs">
                {createdOrder.avatarUrl ? (
                  <Image src={createdOrder.avatarUrl} alt={createdOrder.username} fill className="object-cover" />
                ) : (
                  <User className="w-6 h-6 text-pink-400" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-black text-[#FF2E74] font-mono">#{createdOrder.id}</span>
                <span className="text-sm font-black text-slate-900 truncate">@{cleanUsername(createdOrder.username)}</span>
                <span className="text-xs font-bold text-slate-600">
                  {createdOrder.robuxAmount.toLocaleString("id-ID")} Robux • {createdOrder.price}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                {createdOrder.statusLabel}
              </span>
            </div>

            {/* Link Box */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#FF2E74]" />
                Link Tracking Pelanggan:
              </label>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 select-all break-all shadow-inner">
                <span>{getTrackingUrl()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-300 text-[#FF2E74] font-black text-xs sm:text-sm shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600">Link Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendWA}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Kirim Link ke WhatsApp</span>
              </button>
            </div>

            <a
              href={getTrackingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF2E74] transition-colors text-center"
            >
              <span>Buka Pratinjau Halaman Tracking</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleReset}
              className="w-full mt-2 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              + Buat Order Lain
            </button>
          </div>
        ) : (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Username Roblox with Avatar Preview */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF2E74]" />
                Username Roblox <span className="text-[#FF2E74]">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="misal: crasiel"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#FF2E74] rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                  />
                </div>

                {/* Avatar Preview Box */}
                <div className="w-10 h-10 rounded-xl border border-pink-200 bg-pink-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {isCheckingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF2E74]" />
                  ) : avatarUrl ? (
                    <Image src={avatarUrl} alt={username} fill className="object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-pink-300" />
                  )}
                </div>
              </div>
            </div>

            {/* Preset Robux Packages */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2E74]" />
                Pilih Nominal Paket Robux:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => {
                  const isSelected = robuxAmount === p.robux;
                  return (
                    <button
                      key={p.robux}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-xl border-2 text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#FF2E74] bg-[#FFF0F5] shadow-2xs"
                          : "border-slate-200 bg-white hover:border-pink-200"
                      }`}
                    >
                      <span className={`text-xs font-black ${isSelected ? "text-[#FF2E74]" : "text-slate-800"}`}>
                        {p.robux.toLocaleString("id-ID")} R$
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">{p.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Nominal & Price Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-600">Jumlah Robux</span>
                <input
                  type="number"
                  value={robuxAmount}
                  onChange={(e) => setRobuxAmount(parseInt(e.target.value) || 0)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF2E74]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-600">Harga / Total Bayar</span>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Rp 104.000"
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF2E74]"
                />
              </div>
            </div>

            {/* Nomor WA Customer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FF2E74]" />
                Nomor WhatsApp Customer (Opsional):
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-400">+62</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="8123456789"
                  className="flex-1 text-xs font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Status Awal Order */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF2E74]" />
                Status Awal Pesanan:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("diproses")}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                    status === "diproses"
                      ? "border-blue-500 bg-blue-50 text-blue-800 shadow-2xs"
                      : "border-slate-200 text-slate-600 hover:border-blue-200"
                  }`}
                >
                  ⚡ Diproses (Aktivasi ID 97K)
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("masuk")}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                    status === "masuk"
                      ? "border-amber-500 bg-amber-50 text-amber-800 shadow-2xs"
                      : "border-slate-200 text-slate-600 hover:border-amber-200"
                  }`}
                >
                  🕒 Menunggu Bayar
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("selesai")}
                  className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                    status === "selesai"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs"
                      : "border-slate-200 text-slate-600 hover:border-emerald-200"
                  }`}
                >
                  ✓ Selesai
                </button>
              </div>
            </div>

            {/* Link Aktivasi ID 97K */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#FF2E74]" />
                  Link Aktivasi ID 97K / Gamepass:
                </label>
                <span className="text-[10px] text-[#FF2E74] font-bold">Otomatis / Opsional</span>
              </div>
              <input
                type="text"
                value={activationUrl}
                onChange={(e) => setActivationUrl(e.target.value)}
                placeholder="https://roblox.com/game-pass/... atau https://..."
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#FF2E74] rounded-xl text-xs font-mono font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {username.trim() && (
                  <button
                    type="button"
                    onClick={() => setActivationUrl(`https://www.roblox.com/search/users?keyword=${encodeURIComponent(cleanUsername(username))}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-[#FF2E74] text-slate-600 text-[10px] font-bold transition-all"
                  >
                    🎮 Gamepass @{cleanUsername(username)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem("vietblox_store_config_v2");
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed.defaultActivationUrl) setActivationUrl(parsed.defaultActivationUrl);
                      }
                    } catch {}
                  }}
                  className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#FF2E74] text-[10px] font-extrabold transition-all"
                >
                  ⭐ Default Toko
                </button>
                <button
                  type="button"
                  onClick={() => setActivationUrl(`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Admin VietBlox, saya mau aktivasi ID 97K untuk Roblox @${cleanUsername(username) || "user"}`)}`)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold transition-all"
                >
                  💬 WA CS
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !username.trim()}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
                isSubmitting || !username.trim()
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FF2E74] to-[#E11D48] hover:scale-[1.01] active:scale-[0.99] shadow-pink-500/25 cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Pesanan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simpan & Buat Link Aktivasi</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
