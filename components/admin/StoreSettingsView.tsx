"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
  Save,
  RotateCcw,
  CheckCircle2,
  Bell,
  MessageCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  operatingHours: string;
  isStoreOpen: boolean;
  announcementText: string;
  isAnnouncementActive: boolean;
  minRobuxOrder: number;
  maxRobuxOrder: number;
  antiScamNotice: boolean;
}

const defaultSettings: StoreSettings = {
  storeName: "VietBlox Topup",
  tagline: "Top Up Robux 100% Legal, Aman & Instan Garansi Seumur Hidup",
  whatsappNumber: "6281234567890",
  operatingHours: "09:00 - 23:00 WIB (Setiap Hari)",
  isStoreOpen: true,
  announcementText: "⚡ FLASH SALE! Dapatkan bonus Robux hingga 10% khusus pembayaran QRIS hari ini!",
  isAnnouncementActive: true,
  minRobuxOrder: 100,
  maxRobuxOrder: 50000,
  antiScamNotice: true,
};

const STORAGE_KEY_SETTINGS = "vietblox_store_settings_v1";

export default function StoreSettingsView() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    if (confirm("Kembalikan pengaturan ke default pabrik?")) {
      setSettings(defaultSettings);
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Pengaturan Toko</span>
            <Store className="w-5 h-5 text-[#FF2E74]" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Konfigurasi profil toko, jam operasional, kontak CS WhatsApp, dan banner promo
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,46,116,0.35)] hover:shadow-[0_6px_20px_rgba(255,46,116,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Pengaturan toko berhasil disimpan ke database lokal!</span>
        </div>
      )}

      {/* ─── Main Settings Form ─── */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* Section 1: Informasi Toko */}
          <div className="p-6 rounded-3xl bg-white border border-pink-200/90 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-pink-100 pb-2.5 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#FF2E74]" />
              <span>Informasi & Branding Toko</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Toko / Brand</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">WhatsApp CS / Admin (62xxx)</label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Slogan / Tagline Toko</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Jam Operasional CS</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.operatingHours}
                  onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Banner Pengumuman */}
          <div className="p-6 rounded-3xl bg-white border border-pink-200/90 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2.5">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FF2E74]" />
                <span>Banner Pengumuman & Promo</span>
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-600">Aktifkan Banner</span>
                <input
                  type="checkbox"
                  checked={settings.isAnnouncementActive}
                  onChange={(e) => setSettings({ ...settings, isAnnouncementActive: e.target.checked })}
                  className="w-4 h-4 accent-[#FF2E74] rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Teks Pengumuman Header Toko</label>
              <textarea
                rows={2}
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full p-3 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 resize-none"
              />
            </div>
          </div>

        </div>

        {/* Right 1 Col: Status & Controls */}
        <div className="flex flex-col gap-5">
          
          {/* Status Buka / Tutup */}
          <div className="p-6 rounded-3xl bg-white border border-pink-200/90 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-pink-100 pb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF2E74]" />
              <span>Status Operasional</span>
            </h3>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100">
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900">
                  {settings.isStoreOpen ? "🟢 Toko Sedang BUKA" : "🔴 Toko Sedang TUTUP"}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {settings.isStoreOpen ? "Pelanggan dapat melakukan checkout" : "Form checkout dinonaktifkan sementara"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.isStoreOpen}
                onChange={(e) => setSettings({ ...settings, isStoreOpen: e.target.checked })}
                className="w-5 h-5 accent-[#FF2E74] rounded cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Gunakan opsi tutup jika stok Robux sedang kosong atau sedang pemeliharaan sistem.</span>
            </div>
          </div>

          {/* Batasan Pembelian */}
          <div className="p-6 rounded-3xl bg-white border border-pink-200/90 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-pink-100 pb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF2E74]" />
              <span>Limit Order Robux</span>
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Min. Pembelian Robux</label>
              <input
                type="number"
                value={settings.minRobuxOrder}
                onChange={(e) => setSettings({ ...settings, minRobuxOrder: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Maks. Pembelian per Transaksi</label>
              <input
                type="number"
                value={settings.maxRobuxOrder}
                onChange={(e) => setSettings({ ...settings, maxRobuxOrder: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-pink-200 text-xs font-semibold focus:outline-none focus:border-[#FF2E74]"
              />
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}
