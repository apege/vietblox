"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Zap,
  Crown,
  Flame,
  AlertCircle,
  Package,
  Info,
} from "lucide-react";
import { RobuxPackage, PackageStatus, getComputedPackageBadge, DynamicBadgeType } from "@/lib/adminStore";

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

  // Synchronize internal state when parent packages update
  useEffect(() => {
    if (packages && packages.length > 0) {
      setPkgList(packages);
    }
  }, [packages]);

  // Form states for Add / Edit (Badge is computed automatically)
  const [formAmount, setFormAmount] = useState<number>(2000);
  const [formAmountDisplay, setFormAmountDisplay] = useState<string>("2.000");
  const [formPrice, setFormPrice] = useState<string>("Rp 40.000");
  const [formStatus, setFormStatus] = useState<PackageStatus>("active");

  const formatRupiah = (val: string | number) => {
    const digits = String(val).replace(/\D/g, "");
    if (!digits) return "";
    return `Rp ${Number(digits).toLocaleString("id-ID")}`;
  };

  const handleRobuxChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setFormAmountDisplay("");
      setFormAmount(0);
      return;
    }
    const num = parseInt(digits, 10);
    setFormAmount(num);
    setFormAmountDisplay(num.toLocaleString("id-ID"));
  };

  const handlePriceChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setFormPrice("");
      return;
    }
    const num = parseInt(digits, 10);
    setFormPrice(`Rp ${num.toLocaleString("id-ID")}`);
  };

  const openAddModal = () => {
    setFormAmount(2000);
    setFormAmountDisplay("2.000");
    setFormPrice("Rp 40.000");
    setFormStatus("active");
    setEditingPackage(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (pkg: RobuxPackage) => {
    setEditingPackage(pkg);
    setFormAmount(pkg.amount);
    setFormAmountDisplay(pkg.amount ? pkg.amount.toLocaleString("id-ID") : "");
    setFormPrice(formatRupiah(pkg.price || pkg.numericPrice || 0));
    setFormStatus(pkg.status || (pkg.inStock ? "active" : "sold_out"));
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = formAmount || parseInt(formAmountDisplay.replace(/\D/g, ""), 10) || 0;
    const numericPrice = parseInt(formPrice.replace(/\D/g, ""), 10) || 0;

    if (!numericAmount || !numericPrice) return;

    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;
    const inStock = formStatus === "active";

    if (editingPackage) {
      // Update existing
      const updated = pkgList.map((p) =>
        p.id === editingPackage.id
          ? {
              ...p,
              amount: numericAmount,
              price: formattedPrice,
              numericPrice,
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
        id: `pkg-${numericAmount}-${Date.now()}`,
        amount: numericAmount,
        price: formattedPrice,
        numericPrice,
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

  // Direct toggle between Active <-> Sold Out
  const handleToggleStatus = (pkg: RobuxPackage) => {
    const current = pkg.status || (pkg.inStock ? "active" : "sold_out");
    // If active -> turn to sold_out. If sold_out or inactive -> turn to active
    const newStatus: PackageStatus = current === "active" ? "sold_out" : "active";
    const inStock = newStatus === "active";

    const updated = pkgList.map((p) =>
      p.id === pkg.id || p.amount === pkg.amount
        ? {
            ...p,
            status: newStatus,
            inStock,
          }
        : p
    );
    setPkgList(updated);
    onSavePackages(updated);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* ─── 1. Header ─── */}
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

      {/* ─── 2. 3-Column Grid Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pkgList.map((pkg) => {
          const currentStatus: PackageStatus = pkg.status || (pkg.inStock ? "active" : "sold_out");
          const computedBadge: DynamicBadgeType = getComputedPackageBadge(pkg);

          return (
            <div
              key={pkg.id || pkg.amount}
              className={`p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border transition-all duration-200 flex flex-col justify-between gap-4 shadow-[0_4px_20px_rgba(255,182,193,0.12)] hover:shadow-[0_8px_30px_rgba(255,182,193,0.22)] ${
                currentStatus === "sold_out"
                  ? "border-rose-300/80 bg-rose-50/30"
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

                    {/* Dynamic Computed Badge */}
                    {computedBadge && (
                      <div className="flex items-center">
                        {computedBadge === "SOLDOUT" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider">
                            <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                            <span>SOLD OUT</span>
                          </span>
                        )}
                        {computedBadge === "PROMO" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-100 text-[#FF2E74] text-[9px] font-black uppercase tracking-wider">
                            <Zap className="w-2.5 h-2.5 fill-[#FF2E74]" />
                            <span>PROMO</span>
                          </span>
                        )}
                        {computedBadge === "SULTAN" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider">
                            <Crown className="w-2.5 h-2.5 fill-amber-700" />
                            <span>SULTAN</span>
                          </span>
                        )}
                        {computedBadge === "POPULER" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-wider">
                            <Flame className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
                            <span>POPULER</span>
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
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-300 text-xs font-black shadow-2xs">
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
                
                {/* Left: Quick Status Changer Toggle Button */}
                <button
                  onClick={() => handleToggleStatus(pkg)}
                  className={`text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    currentStatus === "sold_out"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 font-black shadow-xs"
                      : currentStatus === "inactive"
                      ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-extrabold"
                  }`}
                  title={
                    currentStatus === "sold_out"
                      ? "Klik untuk membuka stok kembali (Jadikan Aktif)"
                      : "Klik untuk menutup stok (Jadikan Sold Out)"
                  }
                >
                  {currentStatus === "active" && (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Set Sold Out</span>
                    </>
                  )}
                  {currentStatus === "sold_out" && (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Set Tersedia (Aktifkan)</span>
                    </>
                  )}
                  {currentStatus === "inactive" && (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-600" />
                      <span>Aktifkan Paket</span>
                    </>
                  )}
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
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
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
                    type="text"
                    inputMode="numeric"
                    required
                    value={formAmountDisplay}
                    onChange={(e) => handleRobuxChange(e.target.value)}
                    placeholder="Contoh: 1.800"
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
                  inputMode="numeric"
                  required
                  value={formPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="Contoh: Rp 35.000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-100 outline-none font-bold text-slate-900"
                />
              </div>

              {/* Info: Aturan Badge Otomatis */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/80 to-purple-50/50 border border-pink-200/70 flex items-start gap-2.5 text-xs text-slate-600 shadow-2xs">
                <Info className="w-4 h-4 text-[#FF2E74] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 leading-relaxed">
                  <span className="font-extrabold text-slate-800">Badge Ditentukan Otomatis:</span>
                  <p className="text-[11px] text-slate-500">
                    • <strong className="text-rose-600">Sold Out:</strong> Diambil dari status ketersediaan di bawah.<br />
                    • <strong className="text-[#FF2E74]">Promo:</strong> Paket yang di-set di Pengaturan Toko.<br />
                    • <strong className="text-orange-600">Populer:</strong> Paket yang paling banyak dibeli pelanggan.<br />
                    • <strong className="text-amber-700">Sultan:</strong> Paket di atas 10.000 Robux.
                  </p>
                </div>
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
