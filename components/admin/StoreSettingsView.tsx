"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Store,
  Flame,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Save,
  RotateCcw,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  QrCode,
  X,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { getStoredPackages, RobuxPackage } from "@/lib/adminStore";
import { compressImageToWebP } from "@/lib/imageCompressor";

export interface StoreConfiguration {
  // Section 1: Identitas & Kontak
  storeName: string;
  whatsappNumber: string;

  // Section 2: Promo Banner Hero
  isPromoActive: boolean;
  selectedPromoPackageId: string;
  promoTagline: string;
  promoEndDate: string; // ISO string or readable format

  // Section 3: Barcode QRIS & Logo & Banner
  qrisImageUrl: string;
  logoImageUrl: string;
  bannerImageUrl: string;

  // Section 4: Default Link Aktivasi
  defaultActivationUrl?: string;
}

const STORAGE_KEY_STORE_CONFIG = "vietblox_store_config_v2";

const defaultStoreConfig: StoreConfiguration = {
  storeName: "VietBlox",
  whatsappNumber: "6281234567890",
  isPromoActive: true,
  selectedPromoPackageId: "pkg-2200",
  promoTagline: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
  promoEndDate: "1 Oktober 2026, 06:59 WIB",
  qrisImageUrl: "/payments/qris.svg",
  logoImageUrl: "/logo_background.PNG",
  bannerImageUrl: "/banner_background.jpg",
  defaultActivationUrl: "",
};

export default function StoreSettingsView() {
  const [config, setConfig] = useState<StoreConfiguration>(defaultStoreConfig);
  const [packages, setPackages] = useState<RobuxPackage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Accordion open/close states
  const [isSection1Open, setIsSection1Open] = useState(true);
  const [isSection2Open, setIsSection2Open] = useState(true);
  const [isSection3Open, setIsSection3Open] = useState(true);
  const [isSection4Open, setIsSection4Open] = useState(true);

  // Modal Set Date & Time states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(9); // 0 = Jan, 9 = Okt (Oktober 2026)
  const [pickerDay, setPickerDay] = useState(1);
  const [pickerHour, setPickerHour] = useState("06");
  const [pickerMinute, setPickerMinute] = useState("59");
  const [activeQuickDuration, setActiveQuickDuration] = useState<string>("end-month");

  // File Upload refs
  const qrisInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Load config from localStorage initially
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORE_CONFIG);
      if (saved) {
        setConfig({ ...defaultStoreConfig, ...JSON.parse(saved) });
      } else {
        setConfig(defaultStoreConfig);
      }
    } catch {
      setConfig(defaultStoreConfig);
    }

    // 2. Load latest config from DB (bypassing CDN cache for admin)
    const loadFromDb = async () => {
      try {
        const res = await fetch("/api/settings?nocache=true");
        const data = await res.json();
        if (data.success && data.settings) {
          setConfig((prev) => {
            const merged = { ...prev, ...data.settings };
            try {
              localStorage.setItem(STORAGE_KEY_STORE_CONFIG, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        console.warn("Error fetching settings from DB:", err);
      }
    };
    loadFromDb();

    // 3. Load available packages for dropdown
    const loadedPkgs = getStoredPackages();
    setPackages(loadedPkgs);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const syncSettingsToSystem = (updatedConfig: StoreConfiguration) => {
    try {
      localStorage.setItem(STORAGE_KEY_STORE_CONFIG, JSON.stringify(updatedConfig));
      // Dispatch custom in-app event for immediate storefront re-render
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vietblox_settings_updated", { detail: updatedConfig }));
        window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY_STORE_CONFIG, newValue: JSON.stringify(updatedConfig) }));
      }
    } catch (err) {
      console.error("Local storage sync error:", err);
    }
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    syncSettingsToSystem(config);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Semua pengaturan toko berhasil disimpan ke database!");
      } else {
        showToast(`Tersimpan lokal (Peringatan DB: ${data.error || "Gagal simpan ke database"})`);
      }
    } catch (err: any) {
      console.error("Save all error:", err);
      showToast("Tersimpan secara lokal. Cek koneksi database jika deploy ke Cloudflare.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSection = async (sectionName: string) => {
    setIsSaving(true);
    syncSettingsToSystem(config);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Pengaturan ${sectionName} berhasil disimpan ke database!`);
      } else {
        showToast(`Tersimpan lokal (DB: ${data.error || "Gagal sinkron database"})`);
      }
    } catch (err: any) {
      console.error("Save section error:", err);
      showToast(`Pengaturan ${sectionName} tersimpan secara lokal.`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAllSections = () => {
    const areAllOpen = isSection1Open && isSection2Open && isSection3Open && isSection4Open;
    setIsSection1Open(!areAllOpen);
    setIsSection2Open(!areAllOpen);
    setIsSection3Open(!areAllOpen);
    setIsSection4Open(!areAllOpen);
  };

  // Image Upload Handlers (Base64 WebP Compressed to < 35KB)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "qrisImageUrl" | "logoImageUrl" | "bannerImageUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let maxWidth = 800;
      let maxHeight = 1000;
      let quality = 0.75;

      if (field === "logoImageUrl") {
        maxWidth = 256;
        maxHeight = 256;
        quality = 0.80;
      } else if (field === "qrisImageUrl") {
        maxWidth = 600;
        maxHeight = 800;
        quality = 0.72;
      } else if (field === "bannerImageUrl") {
        maxWidth = 900;
        maxHeight = 450;
        quality = 0.70;
      }

      const webpDataUrl = await compressImageToWebP(file, { maxWidth, maxHeight, quality });
      setConfig((prev) => {
        const next = { ...prev, [field]: webpDataUrl };
        syncSettingsToSystem(next);
        return next;
      });
      showToast("Gambar berhasil dikompresi ke WebP ultra-ringan!");
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setConfig((prev) => {
            const next = { ...prev, [field]: reader.result as string };
            syncSettingsToSystem(next);
            return next;
          });
          showToast("Gambar berhasil dimuat! Silakan simpan.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayHeaders = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear((y) => y - 1);
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear((y) => y + 1);
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  const handleQuickDuration = (type: "3" | "7" | "14" | "end-month") => {
    setActiveQuickDuration(type);
    const d = new Date();
    if (type === "3") {
      d.setDate(d.getDate() + 3);
      setPickerYear(d.getFullYear());
      setPickerMonth(d.getMonth());
      setPickerDay(d.getDate());
    } else if (type === "7") {
      d.setDate(d.getDate() + 7);
      setPickerYear(d.getFullYear());
      setPickerMonth(d.getMonth());
      setPickerDay(d.getDate());
    } else if (type === "14") {
      d.setDate(d.getDate() + 14);
      setPickerYear(d.getFullYear());
      setPickerMonth(d.getMonth());
      setPickerDay(d.getDate());
    } else if (type === "end-month") {
      // End of next / current month (e.g. 1 Okt 2026)
      setPickerYear(2026);
      setPickerMonth(9); // Oktober
      setPickerDay(1);
    }
  };

  const handleApplyPromoTime = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `${pickerDay} ${monthNames[pickerMonth]} ${pickerYear}, ${pickerHour}:${pickerMinute} WIB`;
    setConfig((prev) => ({ ...prev, promoEndDate: formatted }));
    setIsDatePickerOpen(false);
    showToast(`Batas waktu promo berhasil diatur: ${formatted}`);
  };

  // Selected promo package details for summary badge
  const selectedPkg = packages.find((p) => p.id === config.selectedPromoPackageId) || packages[1] || {
    amount: 2200,
    price: "Rp 45.000",
  };

  const allSectionsOpen = isSection1Open && isSection2Open && isSection3Open;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-12">
      
      {/* ─── Top Header (Matching Screenshot 5) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan Toko & Banner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        {/* Toggle All Accordion Button */}
        <button
          onClick={toggleAllSections}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-[#FF2E74] text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all self-start sm:self-auto flex-shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{allSectionsOpen ? "Tutup Semua Section" : "Buka Semua Section"}</span>
        </button>
      </div>

      {/* ─── Hidden File Inputs ─── */}
      <input
        type="file"
        ref={qrisInputRef}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(e) => handleFileUpload(e, "qrisImageUrl")}
        className="hidden"
      />
      <input
        type="file"
        ref={logoInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFileUpload(e, "logoImageUrl")}
        className="hidden"
      />
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => handleFileUpload(e, "bannerImageUrl")}
        className="hidden"
      />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: IDENTITAS TOKO & KONTAK (Matching Screenshot 4 & 5)   */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-white border border-pink-200/90 shadow-xs overflow-hidden transition-all duration-200">
        
        {/* Accordion Header */}
        <div
          onClick={() => setIsSection1Open(!isSection1Open)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-pink-50/40 select-none transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2E74] flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                IDENTITAS TOKO & KONTAK
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Nama toko di navbar pelanggan dan nomor WhatsApp CS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Right Summary Badge (when collapsed or open) */}
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-pink-50 text-[#FF2E74] text-xs font-bold border border-pink-200/60">
              {config.storeName} • WA: {config.whatsappNumber}
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2E74]">
              {isSection1Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Accordion Body */}
        {isSection1Open && (
          <div className="p-5 sm:p-6 pt-2 border-t border-pink-100 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nama Toko */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-900">
                  Nama Toko (Navbar Pelanggan)
                </label>
                <input
                  type="text"
                  value={config.storeName}
                  onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                  placeholder="VietBlox"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-white"
                />
                <span className="text-[11px] text-slate-400 font-medium">
                  Tampil di navbar web utama (Viet berwarna pink, Blox hitam).
                </span>
              </div>

              {/* Nomor WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-900">
                  Nomor WhatsApp Admin CS (Format 62...)
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  placeholder="6281234567890"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-white font-mono"
                />
                <span className="text-[11px] text-slate-400 font-medium">
                  Tujuan konfirmasi order dan tombol bantuan CS pelanggan.
                </span>
              </div>

              {/* Default Link Aktivasi ID 97K / Gamepass */}
              <div className="flex flex-col gap-1.5 md:col-span-2 pt-2 border-t border-pink-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF2E74]" />
                    Default Link Aktivasi ID 97K / Gamepass (Otomatis untuk Semua Order)
                  </label>
                  <span className="text-[10px] font-extrabold text-[#FF2E74] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                    Auto-Fill Otomatis
                  </span>
                </div>
                <input
                  type="text"
                  value={config.defaultActivationUrl || ""}
                  onChange={(e) => setConfig({ ...config, defaultActivationUrl: e.target.value })}
                  placeholder="https://roblox.com/game-pass/... atau https://..."
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-white font-mono"
                />
                <span className="text-[11px] text-slate-400 font-medium">
                  Jika diisi, link ini akan <strong>otomatis terisi secara instan</strong> pada setiap order baru (baik order via website maupun order manual) sehingga admin tidak perlu mengetik manual satu per satu.
                </span>
              </div>

            </div>

            {/* Save Section 1 Button */}
            <div className="flex justify-end pt-3 border-t border-pink-100">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("Identitas & Kontak")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className={`w-4 h-4 shrink-0 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Menyimpan..." : "Simpan Identitas & Kontak"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: PENGATURAN PROMO BANNER WEB (Matching Screenshot 3)    */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-white border border-pink-200/90 shadow-xs overflow-hidden transition-all duration-200">
        
        {/* Accordion Header */}
        <div
          onClick={() => setIsSection2Open(!isSection2Open)}
          className="p-4 sm:p-5 flex items-center justify-between gap-2.5 sm:gap-3 cursor-pointer hover:bg-pink-50/40 select-none transition-colors"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2E74] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                PENGATURAN PROMO BANNER
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1 sm:line-clamp-none">
                Atur paket promo yang muncul pada banner hero website toko
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Promo Active Toggle Pill & Switch */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-pink-50 text-[#FF2E74] text-xs font-bold border border-pink-200/60">
                {config.isPromoActive ? `Promo Aktif • ${selectedPkg.amount.toLocaleString("id-ID")} Robux (${selectedPkg.price})` : "Promo Nonaktif"}
              </span>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, isPromoActive: !config.isPromoActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  config.isPromoActive ? "bg-[#FF2E74]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.isPromoActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2E74] shrink-0">
              {isSection2Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Accordion Body */}
        {isSection2Open && (
          <div className="p-4 sm:p-6 pt-2 border-t border-pink-100 flex flex-col gap-4 sm:gap-5 animate-in fade-in duration-200">
            
            <div className="flex flex-col gap-3.5 sm:gap-4">
              
              {/* Paket Robux yang Dipromosikan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-900">
                  Paket Robux yang Dipromosikan
                </label>
                <select
                  value={config.selectedPromoPackageId}
                  onChange={(e) => setConfig({ ...config, selectedPromoPackageId: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2E74] bg-white cursor-pointer shadow-2xs"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.amount.toLocaleString("id-ID")} Robux ({pkg.price})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 font-medium">
                  Paket ini akan otomatis mendapatkan badge ⚡ Promo pada daftar nominal dan storefront pelanggan.
                </span>
              </div>

            </div>

            {/* Batas Waktu Berakhir Promo (Countdown Banner) */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF2E74] shrink-0" />
                  <span>Batas Waktu Promo (Countdown Banner)</span>
                </span>

                <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-pink-50 text-[#FF2E74] text-[10px] sm:text-[11px] font-extrabold border border-pink-200/60">
                  Aktif s/d {config.promoEndDate}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <div className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-pink-200 bg-slate-50/80 flex items-center justify-between gap-2 shadow-2xs">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {config.promoEndDate}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium shrink-0">
                    (Otomatis Berakhir)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Set Tanggal & Jam Promo</span>
                </button>
              </div>
            </div>

            {/* Save Promo Section Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("Promo Banner")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className={`w-4 h-4 shrink-0 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Menyimpan..." : "Simpan Pengaturan Promo"}</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: BARCODE QRIS, LOGO TOKO, & BANNER (Screenshot 1 & 2)  */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-white border border-pink-200/90 shadow-xs overflow-hidden transition-all duration-200">
        
        {/* Accordion Header */}
        <div
          onClick={() => setIsSection3Open(!isSection3Open)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-pink-50/40 select-none transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2E74] flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                BARCODE QRIS & LOGO TOKO
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Barcode pembayaran QRIS otomatis dan logo storefront toko
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-pink-50 text-[#FF2E74] text-xs font-bold border border-pink-200/60">
              QRIS: Terpasang • Logo: Terpasang
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2E74]">
              {isSection3Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Accordion Body */}
        {isSection3Open && (
          <div className="p-5 sm:p-6 pt-4 border-t border-pink-100 flex flex-col gap-8 animate-in fade-in duration-200">
            
            {/* ─── 1. GAMBAR QRIS PEMBAYARAN (Matching Screenshot 2) ─── */}
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#FF2E74]" />
                  <span>GAMBAR QRIS PEMBAYARAN</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Upload barcode QRIS toko untuk menerima pembayaran otomatis dari website
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Dropzone */}
                <div
                  onClick={() => qrisInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-200 hover:border-[#FF2E74] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-pink-50/20 hover:bg-pink-50/50 transition-all cursor-pointer min-h-[190px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#FF2E74] flex items-center justify-center shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    Upload QRIS Baru
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Klik untuk memilih file (PNG / JPG / WEBP Maks 5MB)
                  </span>
                </div>

                {/* Live Preview QRIS */}
                <div className="border border-pink-100 rounded-3xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[190px]">
                  <div className="flex items-center justify-between pb-2 border-b border-pink-100/60">
                    <span className="text-xs font-black text-slate-700">Live Preview QRIS</span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, qrisImageUrl: "/payments/qris.svg" })}
                      className="text-[11px] font-bold text-slate-400 hover:text-[#FF2E74] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Default</span>
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-2">
                    <div className="relative w-36 h-44 rounded-xl overflow-hidden border border-pink-200 bg-white shadow-xs p-1">
                      <img
                        src={config.qrisImageUrl}
                        alt="QRIS Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* QRIS URL Input Bar */}
              <input
                type="text"
                value={config.qrisImageUrl}
                onChange={(e) => setConfig({ ...config, qrisImageUrl: e.target.value })}
                placeholder="https://... atau /payments/qris.svg"
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 text-xs font-mono text-slate-600 focus:outline-none focus:border-[#FF2E74] bg-white shadow-2xs"
              />
            </div>

            {/* ─── 2. LOGO TOKO (NAVBAR PELANGGAN) (Matching Screenshot 2) ─── */}
            <div className="flex flex-col gap-3 pt-4 border-t border-pink-100">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#FF2E74]" />
                  <span>LOGO TOKO (NAVBAR PELANGGAN)</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Upload logo bundar toko yang akan muncul di navbar storefront pelanggan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Dropzone */}
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-200 hover:border-[#FF2E74] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-pink-50/20 hover:bg-pink-50/50 transition-all cursor-pointer min-h-[170px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#FF2E74] flex items-center justify-center shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    Upload Logo Toko
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Klik untuk memilih file logo baru (PNG / JPG / WEBP)
                  </span>
                </div>

                {/* Live Preview Logo */}
                <div className="border border-pink-100 rounded-3xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[170px]">
                  <div className="flex items-center justify-between pb-2 border-b border-pink-100/60">
                    <span className="text-xs font-black text-slate-700">Live Preview Logo</span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, logoImageUrl: "/logo_background.PNG" })}
                      className="text-[11px] font-bold text-slate-400 hover:text-[#FF2E74] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Default</span>
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center gap-3.5 p-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-pink-300 shadow-md bg-white flex-shrink-0">
                      <img
                        src={config.logoImageUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <BrandLogo size="md" name={config.storeName} />
                      <span className="text-[11px] text-slate-400 font-bold mt-0.5">
                        Tampil di Navbar Toko
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── 3. FOTO / BACKGROUND BANNER PROMO (Matching Screenshot 1) ─── */}
            <div className="flex flex-col gap-3 pt-4 border-t border-pink-100">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF2E74]" />
                  <span>Foto / Background Banner Promo (Hero Web Pelanggan)</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Upload foto ilustrasi atau background banner promo yang akan muncul pada card pink promo di header website pelanggan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Dropzone */}
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-200 hover:border-[#FF2E74] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-pink-50/20 hover:bg-pink-50/50 transition-all cursor-pointer min-h-[170px]"
                >
                  <div className="flex items-center justify-between w-full text-[11px] font-bold text-slate-400">
                    <span className="text-[#FF2E74] font-black flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Upload Banner Baru
                    </span>
                    <span>PNG / JPG / WEBP</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#FF2E74] flex items-center justify-center my-1 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#FF2E74]">
                    Upload Foto Banner Promo
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Tarik banner ke sini atau klik browse
                  </span>
                </div>

                {/* Live Preview Foto Banner */}
                <div className="border border-pink-100 rounded-3xl p-4 bg-slate-50/50 flex flex-col justify-between min-h-[170px]">
                  <div className="flex items-center justify-between pb-2 border-b border-pink-100/60">
                    <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#FF2E74]" />
                      <span>Preview Foto Banner</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, bannerImageUrl: "/banner_background.jpg" })}
                      className="text-[11px] font-bold text-slate-400 hover:text-[#FF2E74] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-2">
                    {config.bannerImageUrl ? (
                      <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-pink-200 shadow-xs">
                        <img
                          src={config.bannerImageUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center gap-1 text-slate-400">
                        <ImageIcon className="w-8 h-8 stroke-1" />
                        <span className="text-xs font-bold">Belum ada foto banner</span>
                        <span className="text-[10px]">Tampilan default background pink</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Banner URL Input Bar */}
              <input
                type="text"
                value={config.bannerImageUrl}
                onChange={(e) => setConfig({ ...config, bannerImageUrl: e.target.value })}
                placeholder="/images/pricelist.jpeg atau URL gambar banner promo"
                className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 text-xs font-mono text-slate-600 focus:outline-none focus:border-[#FF2E74] bg-white shadow-2xs"
              />
            </div>

            {/* Save Section 3 Button */}
            <div className="flex justify-end pt-2 border-t border-pink-100">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("Barcode QRIS & Media")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className={`w-4 h-4 shrink-0 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Menyimpan..." : "Simpan Barcode QRIS & Media"}</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: KEAMANAN & KREDENSIAL ADMIN                          */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-white border border-pink-200/90 shadow-xs overflow-hidden transition-all duration-200">
        
        {/* Accordion Header */}
        <div
          onClick={() => setIsSection4Open(!isSection4Open)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-pink-50/40 select-none transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2E74] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                KEAMANAN & KREDENSIAL ADMIN
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kredensial login admin terproteksi penuh via Environment Variables (.env.local)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200/60">
              ● Enkripsi Aktif (.env)
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2E74]">
              {isSection4Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Accordion Body */}
        {isSection4Open && (
          <div className="p-5 sm:p-6 pt-4 border-t border-pink-100 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <Lock className="w-4 h-4 text-[#FF2E74]" />
                <span>Pengaturan Akses Login Administrator</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Untuk menjamin keamanan level produksi, username dan password admin dikelola secara ketat melalui <strong>Environment Variables (<code className="text-[#FF2E74] font-bold">.env.local</code> / Cloudflare Variables)</strong>. Kredensial tidak tersimpan dalam bentuk teks biasa di browser.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 pt-3 border-t border-slate-200">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400">Variabel Username:</span>
                  <code className="text-xs font-black text-slate-800 font-mono">ADMIN_USERNAME</code>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400">Variabel Password:</span>
                  <code className="text-xs font-black text-slate-800 font-mono">ADMIN_PASSWORD</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Action Button: Simpan Semua Pengaturan (Matching Screenshot 5) ─── */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveAll}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#E11D48] text-white font-black text-sm sm:text-base shadow-[0_8px_25px_rgba(255,46,116,0.4)] hover:shadow-[0_12px_32px_rgba(255,46,116,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save className={`w-5 h-5 ${isSaving ? "animate-spin" : ""}`} />
          <span>{isSaving ? "Menyimpan ke Database..." : "Simpan Semua Pengaturan"}</span>
        </button>
      </div>

      {/* ─── Modal Set Tanggal & Jam Promo (Matching Screenshot) ─── */}
      {isDatePickerOpen && (() => {
        // Calculate Calendar Grid
        const firstDayOfWeek = new Date(pickerYear, pickerMonth, 1).getDay(); // 0 = Min
        const daysInCurrentMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
        const daysInPreviousMonth = new Date(pickerYear, pickerMonth, 0).getDate();

        // Trailing days from previous month
        const prevDays: number[] = [];
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          prevDays.push(daysInPreviousMonth - i);
        }

        // Days of current month
        const currentDays: number[] = [];
        for (let i = 1; i <= daysInCurrentMonth; i++) {
          currentDays.push(i);
        }

        // Leading days of next month
        const totalSlots = Math.ceil((prevDays.length + currentDays.length) / 7) * 7;
        const nextDays: number[] = [];
        for (let i = 1; i <= totalSlots - (prevDays.length + currentDays.length); i++) {
          nextDays.push(i);
        }

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-sm sm:max-w-md rounded-[32px] bg-white border border-pink-200 shadow-2xl p-6 sm:p-7 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
              
              {/* 1. Top Quick Duration Pills & Close Icon */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap flex-1">
                  
                  {/* +3 Hari */}
                  <button
                    type="button"
                    onClick={() => handleQuickDuration("3")}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      activeQuickDuration === "3"
                        ? "bg-[#FF2E74] text-white shadow-xs"
                        : "bg-pink-50 hover:bg-pink-100 text-[#FF2E74]"
                    }`}
                  >
                    +3 Hari
                  </button>

                  {/* +7 Hari */}
                  <button
                    type="button"
                    onClick={() => handleQuickDuration("7")}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      activeQuickDuration === "7"
                        ? "bg-[#FF2E74] text-white shadow-xs"
                        : "bg-pink-50 hover:bg-pink-100 text-[#FF2E74]"
                    }`}
                  >
                    +7 Hari
                  </button>

                  {/* +14 Hari */}
                  <button
                    type="button"
                    onClick={() => handleQuickDuration("14")}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      activeQuickDuration === "14"
                        ? "bg-[#FF2E74] text-white shadow-xs"
                        : "bg-pink-50 hover:bg-pink-100 text-[#FF2E74]"
                    }`}
                  >
                    +14 Hari
                  </button>

                  {/* Akhir Bulan */}
                  <button
                    type="button"
                    onClick={() => handleQuickDuration("end-month")}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      activeQuickDuration === "end-month"
                        ? "bg-[#FF2E74] text-white shadow-xs"
                        : "bg-pink-50 hover:bg-pink-100 text-[#FF2E74]"
                    }`}
                  >
                    Akhir Bulan
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Month Navigation Header */}
              <div className="flex items-center justify-between pt-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {monthNames[pickerMonth]} {pickerYear}
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-[#FF2E74] hover:text-[#FF2E74] flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-[#FF2E74] hover:text-[#FF2E74] flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Calendar Grid */}
              <div className="flex flex-col gap-2">
                {/* Days of week header */}
                <div className="grid grid-cols-7 text-center">
                  {dayHeaders.map((day, idx) => (
                    <span
                      key={day}
                      className={`text-xs font-black py-1 ${
                        idx === 0 ? "text-[#FF2E74]" : "text-slate-400"
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days grid slots */}
                <div className="grid grid-cols-7 gap-y-1.5 text-center items-center">
                  {/* Trailing days from previous month */}
                  {prevDays.map((d) => (
                    <div
                      key={`prev-${d}`}
                      className="py-2 text-xs font-bold text-slate-300 select-none"
                    >
                      {d}
                    </div>
                  ))}

                  {/* Active days of current month */}
                  {currentDays.map((d) => {
                    const isSelected = d === pickerDay;
                    return (
                      <button
                        type="button"
                        key={`curr-${d}`}
                        onClick={() => {
                          setPickerDay(d);
                          setActiveQuickDuration("");
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-2xl flex items-center justify-center text-xs sm:text-sm font-black transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FF2E74] text-white shadow-[0_4px_14px_rgba(255,46,116,0.45)] scale-105"
                            : "text-slate-800 hover:bg-pink-50 hover:text-[#FF2E74]"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}

                  {/* Leading days of next month */}
                  {nextDays.map((d) => (
                    <div
                      key={`next-${d}`}
                      className="py-2 text-xs font-bold text-slate-300 select-none"
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-pink-100 my-0.5" />

              {/* 4. Time Selector Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF2E74]" />
                    <span>Atur Jam & Menit Berakhir</span>
                  </span>

                  {/* Time Badge */}
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[#FF2E74] text-xs font-black border border-pink-200/60">
                    {pickerHour}:{pickerMinute} WIB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Jam (00 - 23) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">Jam (00 - 23)</label>
                    <select
                      value={pickerHour}
                      onChange={(e) => setPickerHour(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-pink-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF2E74] bg-white cursor-pointer"
                    >
                      {Array.from({ length: 24 }).map((_, i) => {
                        const val = i.toString().padStart(2, "0");
                        return (
                          <option key={val} value={val}>
                            {val} : 00
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Menit (00 - 59) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500">Menit (00 - 59)</label>
                    <select
                      value={pickerMinute}
                      onChange={(e) => setPickerMinute(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-pink-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF2E74] bg-white cursor-pointer"
                    >
                      {Array.from({ length: 60 }).map((_, i) => {
                        const val = i.toString().padStart(2, "0");
                        return (
                          <option key={val} value={val}>
                            Menit {val}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* 5. Terapkan Waktu Promo Button */}
              <button
                type="button"
                onClick={handleApplyPromoTime}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF2E74] text-white font-black text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,46,116,0.35)] hover:shadow-[0_8px_25px_rgba(255,46,116,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Terapkan Waktu Promo</span>
              </button>

            </div>
          </div>
        );
      })()}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-2xl flex items-center gap-2 border border-pink-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
