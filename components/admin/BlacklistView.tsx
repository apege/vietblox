"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  X,
  Trash2,
  AlertCircle,
  ExternalLink,
  Ban,
} from "lucide-react";

export interface BlacklistItem {
  id: string;
  username: string;
  phone?: string;
  robloxUserId?: string;
  reason: string;
  createdAt: string;
}

const STORAGE_KEY_BLACKLIST = "vietblox_blacklist_items_v2";

const initialBlacklist: BlacklistItem[] = [];

export default function BlacklistView() {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formUsername, setFormUsername] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRobloxId, setFormRobloxId] = useState("");
  const [formReason, setFormReason] = useState("Indikasi penipuan atau penyalahgunaan");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BLACKLIST);
      if (saved) {
        setBlacklist(JSON.parse(saved));
      } else {
        setBlacklist(initialBlacklist);
      }
    } catch {
      setBlacklist(initialBlacklist);
    }
  }, []);

  const saveBlacklist = (items: BlacklistItem[]) => {
    setBlacklist(items);
    try {
      localStorage.setItem(STORAGE_KEY_BLACKLIST, JSON.stringify(items));
      // Also sync with usernames list for customer view
      const usernames = items.map((i) => i.username.toLowerCase());
      localStorage.setItem("vietblox_blacklisted_users_v1", JSON.stringify(usernames));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BLACKLIST);
      if (saved) setBlacklist(JSON.parse(saved));
    } catch {}
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const openAddModal = () => {
    setFormUsername("");
    setFormPhone("");
    setFormRobloxId("");
    setFormReason("Indikasi penipuan atau penyalahgunaan");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formReason.trim()) return;

    const cleanUsername = formUsername.trim().replace(/^@/, "");

    const newItem: BlacklistItem = {
      id: `bl-${Date.now()}`,
      username: cleanUsername,
      phone: formPhone.trim() || undefined,
      robloxUserId: formRobloxId.trim() || undefined,
      reason: formReason.trim(),
      createdAt: `${new Date().getDate()} ${new Date().toLocaleString("id-ID", { month: "short" })} ${new Date().getFullYear()}`,
    };

    const updated = [newItem, ...blacklist.filter((b) => b.username.toLowerCase() !== cleanUsername.toLowerCase())];
    saveBlacklist(updated);
    setIsModalOpen(false);
  };

  const handleUnblock = (id: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    saveBlacklist(updated);
  };

  const filtered = blacklist.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      item.username.toLowerCase().includes(q) ||
      (item.phone && item.phone.includes(q)) ||
      (item.robloxUserId && item.robloxUserId.includes(q)) ||
      item.reason.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      
      {/* ─── 1. Header (Matching Screenshot 1) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daftar Blacklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Daftar akun yang diblokir dari checkout toko langsung di database real
          </p>
        </div>

        {/* Action Buttons: + Tambah Blacklist & Refresh */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,46,116,0.35)] hover:shadow-[0_6px_20px_rgba(255,46,116,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Blacklist</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#FF2E74] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Search & Counter Card (Matching Screenshot 1) ─── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF2E74]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari akun terblokir..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#FF2E74] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          <strong className="text-slate-800 font-bold">{blacklist.length}</strong> akun terdaftar dalam blacklist database
        </span>
      </div>

      {/* ─── 3. Content State (Empty or Populated List) ─── */}
      {filtered.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] text-center flex flex-col items-center justify-center gap-3">
          {/* Green Shield Icon (Matching Screenshot 1) */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-500 shadow-2xs">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <p className="text-sm sm:text-base font-black text-slate-800 mt-2">
            Tidak ada akun yang di-blacklist saat ini di database.
          </p>
          <p className="text-xs text-slate-400 max-w-sm">
            Semua pelanggan dapat melakukan transaksi dengan lancar tanpa pencegahan sistem.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-rose-200/90 bg-rose-50/15 shadow-[0_4px_20px_rgba(255,182,193,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              {/* Left Side Info */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-rose-600 tracking-tight">
                    @{item.username}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase">
                    <Ban className="w-3 h-3" />
                    <span>DIBLOKIR</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
                  {item.robloxUserId && (
                    <span>ID: <strong className="text-slate-700 font-mono">{item.robloxUserId}</strong> •</span>
                  )}
                  {item.phone && (
                    <span>WA: <strong className="text-slate-700">{item.phone}</strong> •</span>
                  )}
                  <span>Alasan: <strong className="text-rose-600">{item.reason}</strong></span>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-100 flex-shrink-0">
                <button
                  onClick={() => handleUnblock(item.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold text-xs shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Unblock</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── 4. Modal Tambah ke Blacklist (Matching Screenshot 2) ─── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Tambah ke Blacklist
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
              
              {/* Username Roblox * */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">
                  Username Roblox <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="Contoh: Perusuh"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Nomor WhatsApp (Opsional) */}
              <div className="flex flex-col gap-1">
                <label className="font-extrabold text-slate-800">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 font-medium pl-0.5">
                  Jika diisi, nomor ini akan otomatis dicegah saat checkout pesanan.
                </span>
              </div>

              {/* Roblox User ID (Opsional) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">
                  Roblox User ID (Opsional)
                </label>
                <input
                  type="text"
                  value={formRobloxId}
                  onChange={(e) => setFormRobloxId(e.target.value)}
                  placeholder="Contoh: 123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                />
              </div>

              {/* Alasan Blokir * */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">
                  Alasan Blokir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Indikasi penipuan atau penyalahgunaan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                />
              </div>

              {/* Modal Action Buttons (Matching Screenshot 2) */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  Blokir Akun
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
