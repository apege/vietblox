"use client";

import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Search,
  UserCheck,
  Ban,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import { OrderItem } from "@/lib/adminStore";

interface CustomerListViewProps {
  orders: OrderItem[];
  onSelectCustomerOrder?: (order: OrderItem) => void;
  onRefreshData?: () => void;
  showOnlyBlacklist?: boolean;
}

interface CustomerSummary {
  id: string;
  username: string;
  displayName: string;
  robloxUserId: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  isBlacklisted: boolean;
  lastOrderDate: string;
}

export default function CustomerListView({
  orders,
  onSelectCustomerOrder,
  onRefreshData,
  showOnlyBlacklist = false,
}: CustomerListViewProps) {
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [blacklistedUsernames, setBlacklistedUsernames] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("vietblox_blacklisted_users_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshData) onRefreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleToggleBlacklist = (username: string) => {
    const isCurrently = blacklistedUsernames.includes(username.toLowerCase());
    let updated: string[];
    if (isCurrently) {
      updated = blacklistedUsernames.filter((u) => u !== username.toLowerCase());
    } else {
      updated = [...blacklistedUsernames, username.toLowerCase()];
    }
    setBlacklistedUsernames(updated);
    try {
      localStorage.setItem("vietblox_blacklisted_users_v1", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Group and aggregate orders by Roblox username
  const customers = useMemo(() => {
    const map = new Map<string, CustomerSummary>();

    orders.forEach((order) => {
      const key = order.username.toLowerCase();
      const isBl = blacklistedUsernames.includes(key);

      if (!map.has(key)) {
        map.set(key, {
          id: order.id,
          username: order.username,
          displayName: order.username,
          robloxUserId: order.robloxUserId || "-",
          phone: order.phone || "WhatsApp Direct",
          orderCount: 1,
          totalSpent: order.numericPrice,
          isBlacklisted: isBl,
          lastOrderDate: order.date,
        });
      } else {
        const item = map.get(key)!;
        item.orderCount += 1;
        item.totalSpent += order.numericPrice;
        item.isBlacklisted = isBl;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, blacklistedUsernames]);

  // Filter
  const filtered = customers.filter((c) => {
    if (showOnlyBlacklist && !c.isBlacklisted) return false;
    if (!showOnlyBlacklist && c.isBlacklisted && search.trim() === "") {
      // Still show in main list with blacklist badge
    }

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      c.username.toLowerCase().includes(q) ||
      c.robloxUserId.includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      
      {/* ─── 1. Header (Matching Screenshot) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {showOnlyBlacklist ? "Pelanggan Ter-Blacklist" : "Daftar Pelanggan"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Data pembeli yang otomatis diagregasi langsung dari transaksi real database
          </p>
        </div>

        {/* Top Right: Refresh Data Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer self-start sm:self-auto flex-shrink-0"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-[#FF2E74] ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ─── 2. Search & Counter Card (Matching Screenshot) ─── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-[0_4px_20px_rgba(255,182,193,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF2E74]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari username, ID Roblox, atau WhatsApp..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#FF2E74] rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Menampilkan <span className="font-black text-slate-800">{filtered.length}</span> pelanggan
        </span>
      </div>

      {/* ─── 3. Customer Cards List (Matching Screenshot) ─── */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-pink-100 text-center flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-black text-slate-800">Tidak ada data pelanggan ditemukan</p>
          <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian Anda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((customer) => {
            const formattedTotal = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(customer.totalSpent).replace("Rp", "Rp ");

            return (
              <div
                key={customer.username}
                className={`p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(255,182,193,0.12)] hover:shadow-[0_8px_25px_rgba(255,182,193,0.2)] ${
                  customer.isBlacklisted
                    ? "border-rose-300/80 bg-rose-50/20"
                    : "border-pink-100 hover:border-pink-200"
                }`}
              >
                {/* Left Side: Username + Display Name + Status + ID & WA */}
                <div className="flex flex-col gap-1 min-w-0">
                  {/* Primary Row: @username(@displayName) + AKTIF / BLACKLIST badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-[#FF2E74] tracking-tight">
                      @{customer.username}
                      <span className="font-bold text-slate-500 text-sm sm:text-base ml-1">
                        (@{customer.username})
                      </span>
                    </span>

                    {/* Status Badge */}
                    {customer.isBlacklisted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] sm:text-[11px] font-black uppercase shadow-2xs">
                        <Ban className="w-3 h-3" />
                        <span>BLACKLIST</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/90 text-[10px] sm:text-[11px] font-black uppercase shadow-2xs">
                        <UserCheck className="w-3 h-3" />
                        <span>AKTIF</span>
                      </span>
                    )}
                  </div>

                  {/* Secondary Row: ID: xxx • WA: WhatsApp Direct */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
                    <span>ID: <strong className="text-slate-800 font-mono">{customer.robloxUserId}</strong></span>
                    <span>•</span>
                    <span>WA: <strong className="text-slate-800">{customer.phone}</strong></span>
                  </div>
                </div>

                {/* Right Side: Total Orders + Total Spent + Blacklist Button */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  
                  {/* Total Order & Total Spent */}
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-xs font-semibold text-slate-400">
                      Total {customer.orderCount}x order
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#FF2E74]">
                      {formattedTotal}
                    </span>
                  </div>

                  {/* Blacklist Action Button (Matching Screenshot) */}
                  <button
                    onClick={() => handleToggleBlacklist(customer.username)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                      customer.isBlacklisted
                        ? "bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700"
                        : "bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600"
                    }`}
                  >
                    {customer.isBlacklisted ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Unblock</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>Blacklist</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
