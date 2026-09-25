"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, LogOut, Menu, X, ArrowRight } from "lucide-react";
import { OrderItem } from "@/lib/adminStore";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onLogoutClick: () => void;
  orders: OrderItem[];
  onSelectOrder: (order: OrderItem) => void;
}

export default function AdminHeader({
  onOpenMobileMenu,
  onLogoutClick,
  orders,
  onSelectOrder,
}: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter orders based on search query
  const filteredOrders = searchQuery.trim()
    ? orders
        .filter((o) => {
          const q = searchQuery.toLowerCase().trim();
          return (
            o.id.toLowerCase().includes(q) ||
            o.username.toLowerCase().includes(q) ||
            o.robloxUserId.includes(q) ||
            o.phone.includes(q)
          );
        })
        .slice(0, 6)
    : [];

  // Close drop-down on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpenSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-pink-100/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left Mobile Menu Toggle + Logo (Mobile only) */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-slate-700 hover:bg-pink-100 active:scale-95 transition-all"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5 text-[#FF2E74]" />
          </button>
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-pink-200 bg-white">
            <Image
              src="/logo_background.PNG"
              alt="VietBlox Mascot"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Global Search Bar (Matching Layout) */}
        <div ref={searchRef} className="relative flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpenSuggestions(true);
              }}
              onFocus={() => setIsOpenSuggestions(true)}
              placeholder="Cari order, username, ID..."
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-full bg-white border border-slate-200/90 hover:border-pink-200 focus:border-[#FF2E74] text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-pink-100/70 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Autocomplete Dropdown */}
          {isOpenSuggestions && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 bg-pink-50/60 border-b border-pink-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Hasil Pencarian: &quot;{searchQuery}&quot;</span>
                <span>{filteredOrders.length} ditemukan</span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                  Tidak ada order atau username yang cocok
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => {
                        onSelectOrder(order);
                        setIsOpenSuggestions(false);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-pink-50/60 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FFF0F5] border border-pink-200 flex items-center justify-center flex-shrink-0">
                          <Image src="/robux.webp" alt="Robux" width={18} height={18} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-[#FF2E74]">#{order.id}</span>
                            <span className="text-xs font-bold text-slate-800">@{order.username}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {order.robuxAmount.toLocaleString("id-ID")} Robux · {order.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">{order.price}</span>
                        <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-[#FF2E74]">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Super Admin Profile + Logout Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-pink-50/60 border border-pink-100/80 shadow-2xs">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-pink-300 bg-white flex-shrink-0">
              <Image
                src="/logo_background.PNG"
                alt="Admin Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 leading-tight">
                Admin VietBlox
              </span>
              <span className="text-[10px] font-extrabold text-[#FF2E74] leading-tight">
                Super Admin
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-pink-200/80 hover:border-pink-300 bg-white hover:bg-pink-50 text-[#FF2E74] text-xs font-black shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}
