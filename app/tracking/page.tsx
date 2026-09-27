"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Database,
  Layers,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  X,
  MessageCircle,
  Upload,
  Star,
  Loader2,
  Heart,
  Send,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { compressImageToWebP } from "@/lib/imageCompressor";
import { cleanUsername } from "@/lib/adminStore";

interface TrackedOrder {
  orderCode: string;
  robloxUsername: string;
  robloxUserId?: string | null;
  robuxAmount: number;
  priceFormatted: string;
  numericPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentProofPath?: string | null;
  orderStatus: "pending" | "processing" | "completed" | "cancelled";
  statusLabel: string;
  currentStep: number;
  statusColor: string;
  activationUrl: string | null;
  gamepassUrl: string | null;
  customerNotes: string;
  date: string;
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery =
    searchParams.get("q") ||
    searchParams.get("username") ||
    searchParams.get("order_code") ||
    "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<TrackedOrder | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [localProofImage, setLocalProofImage] = useState<string | null>(null);

  // Testimonial / Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if order already has review on load
  useEffect(() => {
    if (activeOrder?.orderCode) {
      if (typeof window !== "undefined") {
        const localCheck = localStorage.getItem(`vb_reviewed_${activeOrder.orderCode}`);
        if (localCheck) setHasReviewed(true);
      }
      fetch(`/api/testimonials?order_code=${encodeURIComponent(activeOrder.orderCode)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.hasReviewed) {
            setHasReviewed(true);
            if (d.testimonial) {
              setReviewRating(d.testimonial.rating || 5);
              setReviewComment(d.testimonial.message || "");
            }
          }
        })
        .catch(() => {});
    }
  }, [activeOrder?.orderCode]);

  // Auto-open review modal if query param review=true
  useEffect(() => {
    if (searchParams.get("review") === "true" && activeOrder) {
      setIsReviewModalOpen(true);
    }
  }, [searchParams, activeOrder]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !activeOrder) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `@${cleanUsername(activeOrder.robloxUsername)}`,
          message: reviewComment.trim(),
          rating: reviewRating,
          orderCode: activeOrder.orderCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setHasReviewed(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(`vb_reviewed_${activeOrder.orderCode}`, "true");
        }
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewSuccess(false);
        }, 2200);
      }
    } catch (e) {
      console.error("Failed to submit review:", e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Helper to get active proof image
  const getActiveProofImage = () => {
    if (localProofImage) return localProofImage;
    if (activeOrder?.paymentProofPath) return activeOrder.paymentProofPath;
    if (typeof window !== "undefined" && activeOrder) {
      const byCode = localStorage.getItem(`vb_proof_${activeOrder.orderCode}`);
      if (byCode) return byCode;
      const byUname = localStorage.getItem(`vb_proof_${activeOrder.robloxUsername.toLowerCase()}`);
      if (byUname) return byUname;
    }
    return null;
  };

  // Helper to get effective activation URL (from order or store default template)
  const getEffectiveActivationUrl = () => {
    if (activeOrder?.activationUrl?.trim()) return activeOrder.activationUrl.trim();
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vietblox_store_config_v2");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.defaultActivationUrl?.trim()) return parsed.defaultActivationUrl.trim();
        }
      } catch {}
    }
    return null;
  };

  const handleUploadProofInTracking = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeOrder) return;
    
    let base64: string;
    try {
      base64 = await compressImageToWebP(file, { maxWidth: 960, maxHeight: 1280, quality: 0.82 });
    } catch {
      base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    setLocalProofImage(base64);
    try {
      localStorage.setItem(`vb_proof_${activeOrder.orderCode}`, base64);
      localStorage.setItem(`vb_proof_${activeOrder.robloxUsername.toLowerCase()}`, base64);
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: activeOrder.orderCode,
          paymentProofPath: base64,
        }),
      });
    } catch {
      // ignore
    }
  };

  // Fetch Roblox avatar headshot
  const fetchAvatar = async (uname: string) => {
    try {
      const res = await fetch(`/api/check-roblox?username=${encodeURIComponent(uname)}`);
      const data = await res.json();
      if (data.valid && data.avatarUrl) {
        setUserAvatar(data.avatarUrl);
      } else {
        setUserAvatar(null);
      }
    } catch {
      setUserAvatar(null);
    }
  };

  const fetchTrackingData = async (query: string) => {
    if (!query.trim()) {
      setOrders([]);
      setActiveOrder(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/tracking?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        setOrders(data.orders);
        const topOrder = data.orders[0];
        setActiveOrder(topOrder);
        fetchAvatar(topOrder.robloxUsername);
      } else {
        setOrders([]);
        setActiveOrder(null);
        setUserAvatar(null);
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setOrders([]);
      setActiveOrder(null);
      setUserAvatar(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      fetchTrackingData(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingData(searchQuery);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#1E293B] relative isolate flex flex-col justify-between selection:bg-pink-200">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 left-0 h-96 pointer-events-none z-0 overflow-hidden opacity-25">
        <div className="relative w-full h-full">
          <img
            src="/banner_background.jpg"
            alt="Ambient Background"
            className="w-full h-full object-cover object-top filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF5F8]/90 to-[#FFF5F8]" />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 flex flex-col gap-6">
        
        {/* ─── 1. Header Navigation & Title Bar ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-pink-200/90 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs hover:bg-pink-50 hover:border-pink-300 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Kembali</span>
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-slate-900 tracking-tight leading-tight">
                Detail Order
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Berikut detail pesanan dan status pengiriman Robux kamu.
              </p>
            </div>
          </div>

          {/* Right Trust Badge */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#EDFBF5] border border-[#C5F3DF] self-start md:self-auto shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-emerald-950 leading-tight">
                Aman & Terpercaya
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-700 font-medium mt-0.5 max-w-[200px] leading-tight">
                Semua transaksi diproses dengan sistem resmi VietBlox.
              </span>
            </div>
          </div>
        </div>

        {/* ─── 2. Search / Query Bar ─── */}
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-white border-2 border-pink-200 focus-within:border-[#FF2E74] focus-within:ring-4 focus-within:ring-pink-100 shadow-[0_4px_20px_rgba(255,46,116,0.08)] transition-all">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-4 h-4 text-[#FF2E74]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesanan lain dengan Username Roblox atau Kode Invoice..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white text-xs font-black shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 disabled:opacity-70"
            >
              {isLoading ? "Mencari..." : "Cek Order"}
            </button>
          </div>
        </form>

        {/* ─── 3. Content View (Active Order or Empty State) ─── */}
        {isLoading && (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/80 backdrop-blur-md border border-pink-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-[#FF2E74] rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-600">Memuat status pesanan kamu...</p>
          </div>
        )}

        {!isLoading && hasSearched && !activeOrder && (
          <div className="p-10 rounded-3xl bg-white border border-pink-100 text-center flex flex-col items-center gap-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#FF2E74] flex items-center justify-center">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">Pesanan Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-medium">
              Tidak ada data pesanan aktif untuk <strong>"{searchQuery}"</strong>. Pastikan username Roblox atau kode invoice sudah benar.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20saya%20mau%20tanya%20status%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi CS WhatsApp</span>
            </a>
          </div>
        )}

        {!isLoading && activeOrder && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* ─── CARD 1: ORDER DETAIL & CUSTOMER PROFILE ─── */}
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(255,182,193,0.14)] p-5 sm:p-7 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* 1. LEFT COLUMN: User Avatar & Profile */}
                <div className="lg:col-span-4 flex items-center gap-4 lg:pr-4">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-pink-100 via-rose-50 to-pink-200 border-2 border-pink-200/90 shadow-xs shrink-0 flex items-center justify-center">
                    <Image
                      src={userAvatar || "/logo_background.PNG"}
                      alt={activeOrder.robloxUsername}
                      fill
                      unoptimized={!!userAvatar}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-black text-slate-900 truncate">
                        @{cleanUsername(activeOrder.robloxUsername)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(cleanUsername(activeOrder.robloxUsername))}
                        className="text-slate-400 hover:text-[#FF2E74] transition-colors cursor-pointer p-0.5"
                        title="Salin Username"
                      >
                        {copiedCode === cleanUsername(activeOrder.robloxUsername) ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold mt-0.5">
                      Username Roblox
                    </span>

                    <a
                      href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(activeOrder.robloxUsername)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-[#FF2E74] text-xs font-bold border border-pink-200 transition-all self-start shadow-2xs"
                    >
                      <span>Lihat Profil</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 2. MIDDLE COLUMN: Order Details (2 Sub-columns with vertical dividers) */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-1 lg:px-6">
                  
                  {/* Middle Left Sub-column: Invoice, Date, Payment Method */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Invoice</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono mt-0.5 truncate">
                        #{activeOrder.orderCode}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Tanggal Order</span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
                        {activeOrder.date}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Metode Pembayaran</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#FF2E74] shrink-0" />
                        <span>{activeOrder.paymentMethod || "QRIS"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle Right Sub-column: Nominal & Total Pembayaran */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Nominal</span>
                      <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        {activeOrder.robuxAmount.toLocaleString("id-ID")} Robux
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Total Pembayaran</span>
                      <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        {activeOrder.priceFormatted}
                      </span>
                    </div>
                  </div>

                </div>

                {/* 3. RIGHT COLUMN: Payment Status Card & Bukti Pembayaran Button */}
                <div className="lg:col-span-3 flex flex-col gap-2.5 lg:pl-2">
                  
                  {/* Status Badge Card */}
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#EEFAF4] border border-[#BDEFD8] text-emerald-800 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-500 leading-tight">Pembayaran</span>
                      <span className="text-sm sm:text-base font-black text-[#10B981] leading-tight mt-0.5">
                        {activeOrder.paymentStatus === "paid" || activeOrder.orderStatus !== "pending" ? "Berhasil" : "Menunggu"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                        {activeOrder.date}
                      </span>
                    </div>
                  </div>

                  {/* Button Lihat Bukti Pembayaran */}
                  <button
                    type="button"
                    onClick={() => setIsProofModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50/60 hover:bg-pink-100/90 text-[#FF2E74] text-xs font-bold border border-pink-200 transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Lihat Bukti Pembayaran</span>
                  </button>

                </div>

              </div>

              {/* ─── 4-Step Stepper Timeline ─── */}
              <div className="pt-6 pb-2 border-t border-slate-100">
                <div className="relative">
                  
                  {/* Continuous Connecting Line Behind Badges (Desktop/Tablet) */}
                  <div className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-1 z-0 -translate-y-1/2">
                    <div className="w-full h-full flex">
                      {/* Segment 1: Step 1 -> 2 */}
                      <div className={`flex-1 h-full transition-all duration-300 ${
                        activeOrder.orderStatus === "processing" || activeOrder.orderStatus === "completed"
                          ? "bg-[#FF2E74]"
                          : activeOrder.orderStatus === "cancelled"
                          ? "bg-rose-300"
                          : "bg-[#E2E8F0]"
                      }`} />
                      
                      {/* Segment 2: Step 2 -> 3 */}
                      <div className={`flex-1 h-full transition-all duration-300 ${
                        activeOrder.orderStatus === "completed"
                          ? "bg-[#FF2E74]"
                          : activeOrder.orderStatus === "processing"
                          ? "bg-gradient-to-r from-[#FF2E74] via-[#F472B6] to-[#FBBF24]"
                          : activeOrder.orderStatus === "cancelled"
                          ? "bg-rose-200"
                          : "bg-[#E2E8F0]"
                      }`} />
                      
                      {/* Segment 3: Step 3 -> 4 */}
                      <div className={`flex-1 h-full transition-all duration-300 ${
                        activeOrder.orderStatus === "completed"
                          ? "bg-gradient-to-r from-[#FF2E74] to-[#10B981]"
                          : activeOrder.orderStatus === "processing"
                          ? "bg-gradient-to-r from-[#FBBF24] to-[#E2E8F0]"
                          : activeOrder.orderStatus === "cancelled"
                          ? "bg-rose-100"
                          : "bg-[#E2E8F0]"
                      }`} />
                    </div>
                  </div>

                  {/* 4 Step Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-3 relative z-10">
                    
                    {/* Step 1: Pembayaran */}
                    <div className="flex flex-col items-center text-center">
                      {activeOrder.orderStatus === "cancelled" ? (
                        <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(244,63,94,0.35)] shrink-0 mb-3">
                          <X className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : activeOrder.orderStatus === "pending" ? (
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(245,158,11,0.35)] shrink-0 mb-3 animate-pulse">
                          <Clock className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E74] to-[#FF5588] text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(255,46,116,0.35)] shrink-0 mb-3">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <h4 className="text-sm font-black text-slate-900 leading-tight">Pembayaran</h4>
                      <span className={`text-xs font-bold mt-1 leading-tight ${
                        activeOrder.orderStatus === "cancelled"
                          ? "text-rose-600"
                          : activeOrder.orderStatus === "pending"
                          ? "text-amber-600"
                          : "text-[#10B981]"
                      }`}>
                        {activeOrder.orderStatus === "cancelled"
                          ? "Dibatalkan"
                          : activeOrder.orderStatus === "pending"
                          ? "Menunggu"
                          : "Berhasil"}
                      </span>
                      <span className="text-xs font-medium text-slate-500 mt-0.5">{activeOrder.date}</span>
                    </div>

                    {/* Step 2: Pengiriman Robux */}
                    <div className="flex flex-col items-center text-center">
                      {activeOrder.orderStatus === "processing" || activeOrder.orderStatus === "completed" ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E74] to-[#FF5588] text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(255,46,116,0.35)] shrink-0 mb-3">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : activeOrder.orderStatus === "cancelled" ? (
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-black text-sm shrink-0 mb-3">
                          <X className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-slate-500 flex items-center justify-center font-black text-sm shadow-xs shrink-0 mb-3">
                          <span>2</span>
                        </div>
                      )}
                      <h4 className="text-sm font-black text-slate-900 leading-tight">Pengiriman Robux</h4>
                      <span className={`text-xs font-bold mt-1 leading-tight ${
                        activeOrder.orderStatus === "processing" || activeOrder.orderStatus === "completed"
                          ? "text-[#10B981]"
                          : "text-slate-400"
                      }`}>
                        {activeOrder.orderStatus === "processing" || activeOrder.orderStatus === "completed"
                          ? "Berhasil"
                          : "Menunggu"}
                      </span>
                      {(activeOrder.orderStatus === "processing" || activeOrder.orderStatus === "completed") && (
                        <span className="text-xs font-medium text-slate-500 mt-0.5">{activeOrder.date}</span>
                      )}
                    </div>

                    {/* Step 3: Menunggu Aktivasi ID 97K */}
                    <div className="flex flex-col items-center text-center">
                      {activeOrder.orderStatus === "completed" ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E74] to-[#FF5588] text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(255,46,116,0.35)] shrink-0 mb-3">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : activeOrder.orderStatus === "processing" ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] via-[#FBBF24] to-[#FDE68A] text-slate-900 flex items-center justify-center font-black text-sm shadow-[0_4px_14px_rgba(245,158,11,0.38)] shrink-0 mb-3 animate-pulse">
                          <Clock className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      ) : activeOrder.orderStatus === "cancelled" ? (
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-black text-sm shrink-0 mb-3">
                          <X className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-slate-500 flex items-center justify-center font-black text-sm shadow-xs shrink-0 mb-3">
                          <span>3</span>
                        </div>
                      )}
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {activeOrder.orderStatus === "completed" ? "Aktivasi ID 97K" : "Menunggu Aktivasi ID 97K"}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1 max-w-[195px] leading-relaxed">
                        {activeOrder.orderStatus === "completed"
                          ? "Aktivasi ID 97K telah berhasil & aktif."
                          : activeOrder.orderStatus === "processing"
                          ? "Robux sudah terkirim, namun belum terdeteksi pada akun."
                          : "Proses verifikasi akun."}
                      </p>
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="flex flex-col items-center text-center">
                      {activeOrder.orderStatus === "completed" ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#10B981] to-[#059669] text-white flex items-center justify-center font-black text-sm shadow-[0_4px_14px_rgba(16,185,129,0.38)] shrink-0 mb-3">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : activeOrder.orderStatus === "cancelled" ? (
                        <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(244,63,94,0.35)] shrink-0 mb-3">
                          <X className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-slate-500 flex items-center justify-center font-black text-sm shadow-xs shrink-0 mb-3">
                          <span>4</span>
                        </div>
                      )}
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {activeOrder.orderStatus === "cancelled" ? "Dibatalkan" : "Selesai"}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-1 max-w-[195px] leading-relaxed">
                        {activeOrder.orderStatus === "completed"
                          ? "Robux telah berhasil masuk ke akun Roblox kamu."
                          : activeOrder.orderStatus === "cancelled"
                          ? "Pesanan telah dibatalkan."
                          : "Robux akan masuk ke akun setelah aktivasi berhasil."}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* ─── CARD 2: DYNAMIC CALLOUT CARD BASED ON ORDER STATUS ─── */}
            {activeOrder.orderStatus === "processing" ? (
              /* State: Sedang Diproses / Menunggu Aktivasi ID 97K */
              <div className="rounded-3xl bg-[#FFF9EB] border-2 border-[#FFE2A8] p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_35px_rgba(255,184,0,0.12)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                  
                  {/* Left Warning & FAQ Text */}
                  <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start gap-4 z-10 pb-0 sm:pb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <AlertTriangle className="w-5 h-5 fill-white stroke-amber-500" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                        Robux Sudah Terkirim, Namun Belum Terdeteksi
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Robux untuk username <strong className="text-slate-900">@{cleanUsername(activeOrder.robloxUsername)}</strong> sudah berhasil dikirim dari server VietBlox, namun belum dapat ditampilkan pada akun Roblox karena <strong className="text-[#FF2E74]">ID Aktivasi 97K</strong> untuk username ini <strong className="text-rose-600">belum aktif</strong>.
                    </p>

                    {/* Pink FAQ Inner Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF0F5] border border-pink-200/90 flex flex-col gap-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#FF2E74] text-white flex items-center justify-center text-xs font-black shrink-0">
                          ?
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-[#FF2E74]">
                          Mengapa Perlu Aktivasi ID 97K?
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        Sebenarnya, sebagian besar akun Roblox tidak perlu melakukan aktivasi ID 97K. Namun, ada beberapa akun yang memerlukan aktivasi terlebih dahulu. Hal ini biasanya disebabkan karena sistem kami mendeteksi adanya kondisi khusus pada akun tersebut, seperti akun baru, perubahan data akun, riwayat transaksi yang tidak biasa, atau faktor keamanan lainnya. Aktivasi ini bertujuan untuk memastikan pengiriman Robux dapat tersinkronisasi dengan akun yang benar dan mencegah terjadinya kendala.
                      </p>
                    </div>

                    {/* Action Buttons: Link Aktivasi & Hubungi Admin */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {getEffectiveActivationUrl() ? (
                        <a
                          href={getEffectiveActivationUrl()!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,46,116,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Aktivasi ID 97K Sekarang</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <a
                          href={`https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20saya%20ingin%20aktivasi%20ID%2097K%20untuk%20pesanan%20%23${activeOrder.orderCode}%20(Username:%20@${cleanUsername(activeOrder.robloxUsername)})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,46,116,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Hubungi Admin untuk Aktivasi ID 97K</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                  </div>

                  {/* Right Mascot Illustration - Anchored to bottom edge */}
                  <div className="lg:col-span-5 xl:col-span-4 flex items-end justify-center lg:justify-end relative mt-2 lg:mt-0 -mb-6 sm:-mb-8">
                    <div className="relative w-64 h-72 sm:w-80 sm:h-88 lg:w-full lg:h-96 max-w-[360px]">
                      <Image
                        src="/logo_nobackground.PNG"
                        alt="VietBlox Mascot"
                        fill
                        className="object-contain object-bottom drop-shadow-[0_10px_25px_rgba(255,46,116,0.25)]"
                        priority
                      />
                    </div>
                  </div>

                </div>
              </div>
            ) : activeOrder.orderStatus === "completed" ? (
              /* State: Selesai */
              <div className="rounded-3xl bg-[#EEFAF4] border-2 border-[#BDEFD8] p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_35px_rgba(16,185,129,0.12)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                  <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start gap-4 z-10 pb-0 sm:pb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                        Pesanan Berhasil Diselesaikan!
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Robux sebesar <strong className="text-emerald-700">{activeOrder.robuxAmount.toLocaleString("id-ID")} Robux</strong> telah berhasil masuk secara utuh ke akun Roblox <strong className="text-slate-900">@{cleanUsername(activeOrder.robloxUsername)}</strong>. Terima kasih banyak telah berbelanja di VietBlox!
                    </p>

                    <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200 text-xs text-slate-600 font-medium leading-relaxed shadow-2xs">
                      Transaksi kamu telah terverifikasi sukses. Jika ada pertanyaan atau ingin memesan kembali, CS kami selalu siap membantu 24/7.
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {hasReviewed ? (
                        <button
                          type="button"
                          onClick={() => setIsReviewModalOpen(true)}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs sm:text-sm shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Ulasan Terkirim (Edit)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsReviewModalOpen(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <Star className="w-4 h-4 fill-white text-white" />
                          <span>Beri Ulasan & Testimoni</span>
                        </button>
                      )}

                      <Link
                        href="/#pricelist"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Beli Robux Lagi</span>
                      </Link>

                      <a
                        href={`https://www.roblox.com/search/users?keyword=${encodeURIComponent(cleanUsername(activeOrder.robloxUsername))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Cek Akun Roblox</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Right Mascot Illustration */}
                  <div className="lg:col-span-5 xl:col-span-4 flex items-end justify-center lg:justify-end relative mt-2 lg:mt-0 -mb-6 sm:-mb-8">
                    <div className="relative w-64 h-72 sm:w-80 sm:h-88 lg:w-full lg:h-96 max-w-[360px]">
                      <Image
                        src="/logo_nobackground.PNG"
                        alt="VietBlox Mascot"
                        fill
                        className="object-contain object-bottom drop-shadow-[0_10px_25px_rgba(16,185,129,0.25)]"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : activeOrder.orderStatus === "cancelled" ? (
              /* State: Dibatalkan */
              <div className="rounded-3xl bg-rose-50 border-2 border-rose-200 p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_35px_rgba(244,63,94,0.12)]">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <X className="w-5 h-5 stroke-[3]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      Pesanan Ini Dibatalkan
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    Pesanan untuk username <strong className="text-slate-900">@{cleanUsername(activeOrder.robloxUsername)}</strong> telah dibatalkan oleh admin atau sistem kami.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20saya%20ingin%20bertanya%20mengenai%20pesanan%20saya%20%23${activeOrder.orderCode}%20yang%20dibatalkan.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Hubungi CS untuk Bantuan</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* State: Menunggu Pembayaran (Pending) */
              <div className="rounded-3xl bg-amber-50/80 border-2 border-amber-200 p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_35px_rgba(245,158,11,0.12)]">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Clock className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      Menunggu Pembayaran
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    Pesanan kamu sebesar <strong className="text-slate-900">{activeOrder.priceFormatted}</strong> untuk <strong className="text-[#FF2E74]">{activeOrder.robuxAmount.toLocaleString("id-ID")} Robux</strong> sedang menunggu konfirmasi pembayaran. Silakan selesaikan pembayaran dan lampirkan bukti transfer agar pesanan segera diproses oleh tim kami.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsProofModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-black text-xs sm:text-sm shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Bukti Pembayaran</span>
                    </button>
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20saya%20sudah%20membuat%20pesanan%20%23${activeOrder.orderCode}%20untuk%20@${cleanUsername(activeOrder.robloxUsername)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ─── CARD 3: 3 BOTTOM FEATURE CARDS ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Feature 1 */}
              <div className="rounded-3xl bg-white border border-pink-100 p-5 sm:p-6 flex flex-col gap-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 text-[#FF2E74] flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Robux Aman di Server</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Robux yang sudah dikirim tidak akan hilang. Robux akan tersimpan dengan aman di server VietBlox sampai proses aktivasi selesai.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl bg-white border border-amber-100 p-5 sm:p-6 flex flex-col gap-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Hanya Perlu Aktivasi 1 Kali</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Setelah ID 97K aktif, pengiriman Robux berikutnya akan langsung terdeteksi tanpa perlu aktivasi lagi untuk username yang sama.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl bg-white border border-rose-100 p-5 sm:p-6 flex flex-col gap-2.5 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-[#FF2E74] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-900">97K Akan Dikembalikan</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Setelah aktivasi ID selesai, ID 97K yang digunakan akan langsung dikembalikan ke saldo kamu secara otomatis.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ─── 4. Modal Bukti Pembayaran (Foto Bukti Transfer) ─── */}
      {isProofModalOpen && activeOrder && (() => {
        const proofImg = getActiveProofImage();
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-white border border-pink-100 p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF2E74] flex items-center justify-center font-bold text-xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">Bukti Pembayaran</h3>
                    <p className="text-[11px] font-medium text-slate-400">
                      Foto bukti transfer #{activeOrder.orderCode} (@{cleanUsername(activeOrder.robloxUsername)})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProofModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Foto Bukti Transfer */}
              {proofImg ? (
                <div className="flex flex-col gap-3">
                  <div className="relative w-full min-h-[260px] max-h-[500px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2 shadow-inner">
                    <img
                      src={proofImg}
                      alt="Foto Bukti Pembayaran"
                      className="w-full h-auto max-h-[480px] object-contain rounded-xl"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <a
                      href={proofImg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#FF2E74] text-xs font-bold border border-pink-200 transition-all cursor-pointer shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Foto Penuh</span>
                    </a>

                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ganti Foto Bukti</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadProofInTracking}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                /* Empty state: belum ada bukti foto */
                <div className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF2E74] flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-black text-slate-800">Foto Bukti Belum Terlampir</h4>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                      Pesanan ini belum memiliki foto bukti transfer. Kamu bisa langsung mengunggah foto struk/screenshot pembayaran di bawah.
                    </p>
                  </div>
                  <label className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Unggah Foto Bukti Transfer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadProofInTracking}
                    />
                  </label>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProofModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ─── 4B. MODAL: BERI REVIEW / TESTIMONI ─── */}
      {isReviewModalOpen && activeOrder && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setIsReviewModalOpen(false)}
        >
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl border border-pink-100 flex flex-col gap-5 relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-2xs">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Beri Ulasan & Testimoni</h3>
                  <p className="text-xs text-slate-500 font-medium">Bantu kami meningkatkan kualitas layanan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success State */}
            {reviewSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Terima Kasih Banyak! 🎉</h4>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  Ulasan dan testimoni kamu telah berhasil diterbitkan ke website VietBlox!
                </p>
              </div>
            ) : (
              /* Review Form */
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                
                {/* Order Summary Badge */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF0F5] border border-pink-200/70 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#FF2E74]">#{activeOrder.orderCode}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-900">@{cleanUsername(activeOrder.robloxUsername)}</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    +{activeOrder.robuxAmount.toLocaleString("id-ID")} Robux
                  </span>
                </div>

                {/* Rating Selector */}
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-xs font-extrabold text-slate-700">Berapa bintang kepuasanmu?</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 active:scale-95 transition-all cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= reviewRating
                              ? "text-amber-400 fill-amber-400 filter drop-shadow-sm"
                              : "text-slate-200 hover:text-amber-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    {reviewRating === 5 && "⭐⭐⭐⭐⭐ Sangat Puas & Rekomen Banget!"}
                    {reviewRating === 4 && "⭐⭐⭐⭐ Puas & Proses Cepat"}
                    {reviewRating === 3 && "⭐⭐⭐ Cukup Baik"}
                    {reviewRating === 2 && "⭐⭐ Kurang Memuaskan"}
                    {reviewRating === 1 && "⭐ Sangat Kurang"}
                  </span>
                </div>

                {/* Quick Feedback Chips */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Kata kunci cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "⚡ Proses super kilat!",
                      "💎 Robux masuk utuh & legal",
                      "🔒 Terpercaya 100%",
                      "💬 Admin ramah & fast respond",
                      "⭐ Bakal langganan terus!",
                    ].map((chip) => (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => {
                          setReviewComment((prev) =>
                            prev ? `${prev} ${chip}` : chip
                          );
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-[#FF2E74] text-slate-600 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-800">
                    Ulasan / Komentar Testimoni Kamu:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tulis ulasan singkat tentang pengalaman top up kamu di VietBlox..."
                    className="w-full p-3.5 rounded-2xl bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#FF2E74] text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-pink-100 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className={`w-full py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-1 ${
                    isSubmittingReview || !reviewComment.trim()
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FF2E74] to-[#E11D48] hover:scale-[1.01] active:scale-[0.99] shadow-pink-500/25 cursor-pointer"
                  }`}
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Testimoni...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Testimoni Sekarang</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>
        </div>
      )}

      {/* ─── 5. Footer ─── */}
      <footer className="py-6 border-t border-pink-100/80 bg-white/60 text-center text-xs font-semibold text-slate-400 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} VietBlox. Seluruh hak cipta dilindungi.</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#FF2E74] transition-colors">Beranda</Link>
            <Link href="/#pricelist" className="hover:text-[#FF2E74] transition-colors">Pricelist</Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF2E74] hover:underline"
            >
              Bantuan CS 24/7
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF5F8] flex items-center justify-center text-xs font-bold text-slate-400">Memuat detail pesanan...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
