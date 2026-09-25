"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Zap,
  Crown,
  AlertCircle,
  Package,
} from "lucide-react";
import { RobuxPackage, PackageStatus } from "@/lib/adminStore";

interface PricelistManagementViewProps {
  packages: RobuxPackage[];
  onSavePackages: (pkgs: RobuxPackage[]) => void;
}

export default function PricelistManagementView({
  packages,
  onSavePackages,
}: PricelistManagementViewProps) {
  const [pkgList, setPkgList] = useState<RobuxPackage[]>(packages);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<RobuxPackage | null>(null);

  // Form states for Add / Edit
  const [formAmount, setFormAmount] = useState<number>(1800);
  const [formPrice, setFormPrice] = useState<string>("Rp 35.000");
  const [formBadge, setFormBadge] = useState<"PROMO" | "SULTAN" | "HOT" | "BEST SELLER" | "NONE">("NONE");
  const [formStatus, setFormStatus] = useState<PackageStatus>("active");

  const openAddModal = () => {
    setFormAmount(2000);
    setFormPrice("Rp 40.000");
    setFormBadge("NONE");
    setFormStatus("active");
    setEditingPackage(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (pkg: RobuxPackage) => {
    setEditingPackage(pkg);
    setFormAmount(pkg.amount);
    setFormPrice(pkg.price);
    setFormBadge(pkg.badge || "NONE");
    setFormStatus(pkg.status || (pkg.inStock ? "active" : "sold_out"));
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || !formPrice.trim()) return;

    const numericPrice = parseInt(formPrice.replace(/[^0-9]/g, "")) || 0;
    const badgeValue = formBadge === "NONE" ? null : formBadge;
    const inStock = formStatus === "active";

    if (editingPackage) {
      // Update existing
      const updated = pkgList.map((p) =>
        p.id === editingPackage.id
          ? {
              ...p,
              amount: formAmount,
              price: formPrice.trim(),
              numericPrice,
              badge: badgeValue,
              status: formStatus,
              inStock,
            }
          : p
      );
      setPkgList(updated);
      onSavePackages(updated);
    } else {
      // Create new
      const newPkg: RobuxPackage = {
        id: `pkg-${formAmount}-${Date.now()}`,
        amount: formAmount,
        price: formPrice.trim(),
        numericPrice,
        badge: badgeValue,
        status: formStatus,
        inStock,
      };
      const updated = [...pkgList, newPkg].sort((a, b) => a.amount - b.amount);
      setPkgList(updated);
      onSavePackages(updated);
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket nominal ini?")) {
      const updated = pkgList.filter((p) => p.id !== id);
      setPkgList(updated);
      onSavePackages(updated);
    }
  };

  // Quick cycle status toggle: active -> sold_out -> inactive -> active
  const handleToggleStatus = (pkg: RobuxPackage) => {
    const nextStatus: Record<PackageStatus, PackageStatus> = {
      active: "sold_out",
      sold_out: "inactive",
      inactive: "active",
    };
    const newStatus = nextStatus[pkg.status || (pkg.inStock ? "active" : "sold_out")];
    const updated = pkgList.map((p) =>
      p.id === pkg.id
        ? {
            ...p,
            status: newStatus,
            inStock: newStatus === "active",
          }
        : p
    );
    setPkgList(updated);
    onSavePackages(updated);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* ─── 1. Header (Matching Screenshot) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Kelola daftar nominal Robux, harga jual, dan status ketersediaan
          </p>
        </div>

        {/* Top Right: + Tambah Nominal Baru Button */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#FF6B6B] text-white font-extrabold text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,46,116,0.35)] hover:shadow-[0_8px_25px_rgba(255,46,116,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer self-start sm:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Nominal Baru</span>
        </button>
      </div>

      {/* ─── 2. 3-Column Grid Cards (Matching Screenshot) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pkgList.map((pkg) => {
          const currentStatus: PackageStatus = pkg.status || (pkg.inStock ? "active" : "sold_out");

          return (
            <div
              key={pkg.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border transition-all duration-200 flex flex-col justify-between gap-4 shadow-[0_4px_20px_rgba(255,182,193,0.12)] hover:shadow-[0_8px_30px_rgba(255,182,193,0.22)] ${
                currentStatus === "sold_out"
                  ? "border-rose-200/90 bg-rose-50/20"
                  : currentStatus === "inactive"
                  ? "border-slate-200 opacity-70"
                  : "border-pink-100 hover:border-pink-200"
              }`}
            >
              {/* Top Row: Icon + Nominal + Badge + Price + Status Pill */}
              <div className="flex items-start justify-between gap-3">
                
                {/* Left: Gold Robux Coin + Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Robux Coin Icon Box */}
                  <div className="relative w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>

                  {/* Nominal, Badge, Price */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                      {pkg.amount.toLocaleString("id-ID")} Robux
                    </h3>

                    {/* Tag / Badge */}
                    {pkg.badge && (
                      <div className="flex items-center">
                        {pkg.badge === "PROMO" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-100 text-[#FF2E74] text-[9px] font-black uppercase tracking-wider">
                            <Zap className="w-2.5 h-2.5 fill-[#FF2E74]" />
                            <span>PROMO</span>
                          </span>
                        )}
                        {pkg.badge === "SULTAN" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider">
                            <Crown className="w-2.5 h-2.5 fill-amber-700" />
                            <span>SULTAN</span>
                          </span>
                        )}
                        {pkg.badge !== "PROMO" && pkg.badge !== "SULTAN" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 text-[#FF2E74] text-[9px] font-black uppercase border border-pink-200">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <span className="text-sm sm:text-base font-black text-[#FF2E74]">
                      {pkg.price}
                    </span>
                  </div>
                </div>

                {/* Right: Status Pill Badge */}
                <div className="flex-shrink-0">
                  {currentStatus === "active" && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/90 text-xs font-bold shadow-2xs">
                      Aktif
                    </span>
                  )}
                  {currentStatus === "sold_out" && (
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200/90 text-xs font-black shadow-2xs animate-pulse">
                      Sold Out
                    </span>
                  )}
                  {currentStatus === "inactive" && (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold">
                      Nonaktif
                    </span>
                  )}
                </div>

              </div>

              {/* Bottom Row: Quick Status Action + Edit / Delete Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                
                {/* Left: Quick Status Changer Link/Button */}
                <button
                  onClick={() => handleToggleStatus(pkg)}
                  className="text-xs font-bold text-slate-500 hover:text-[#FF2E74] transition-colors cursor-pointer flex items-center gap-1 group"
                  title="Klik untuk mengubah status: Aktif → Sold Out → Nonaktif"
                >
                  <span className="group-hover:underline">
                    {currentStatus === "active"
                      ? "Set Sold Out"
                      : currentStatus === "sold_out"
                      ? "Nonaktifkan"
                      : "Aktifkan"}
                  </span>
                </button>

                {/* Right: Edit & Delete Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Edit Pencil Button */}
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-[#FF2E74] border border-slate-100 hover:border-pink-200 flex items-center justify-center transition-all cursor-pointer"
                    title="Edit nominal & harga"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete Trash Button */}
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer"
                    title="Hapus paket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* ─── 3. Modal Tambah / Edit Nominal Baru ─── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setIsAddModalOpen(false)}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F5] border border-pink-200 flex items-center justify-center text-[#FF2E74]">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingPackage ? "Edit Nominal Robux" : "Tambah Nominal Baru"}
                </h3>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="flex flex-col gap-4 text-xs sm:text-sm">
              
              {/* Nominal Robux */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">
                  Nominal Robux <span className="text-[#FF2E74]">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={formAmount}
                    onChange={(e) => setFormAmount(parseInt(e.target.value) || 0)}
                    placeholder="Contoh: 1800"
                    className="w-full pl-3.5 pr-16 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-400">
                    Robux
                  </span>
                </div>
              </div>

              {/* Harga Jual (Rupiah) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">
                  Harga Jual (Rp) <span className="text-[#FF2E74]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Contoh: Rp 35.000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                />
              </div>

              {/* Tag / Badge Promo */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">Tag / Badge Khusus</label>
                <select
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900 bg-white"
                >
                  <option value="NONE">Tanpa Tag</option>
                  <option value="PROMO">⚡ PROMO</option>
                  <option value="SULTAN">👑 SULTAN</option>
                  <option value="HOT">🔥 HOT</option>
                  <option value="BEST SELLER">⭐ BEST SELLER</option>
                </select>
              </div>

              {/* Status Ketersediaan (Fitur Sold Out!) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-800">Status Ketersediaan</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus("active")}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      formStatus === "active"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-100 font-black"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aktif</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus("sold_out")}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      formStatus === "sold_out"
                        ? "bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-100 font-black"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Sold Out</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus("inactive")}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      formStatus === "inactive"
                        ? "bg-slate-100 border-slate-400 text-slate-700 ring-2 ring-slate-200 font-black"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Nonaktif</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-extrabold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  {editingPackage ? "Simpan Perubahan" : "Tambah Nominal"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
