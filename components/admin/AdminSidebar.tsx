"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
  Users,
  ExternalLink,
  LogOut,
  MessageCircle,
  X,
  Ban,
  MessageSquareHeart,
  Receipt,
  Store,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export type AdminViewType =
  | "dashboard"
  | "order-masuk"
  | "order-diproses"
  | "order-selesai"
  | "order-dibatalkan"
  | "pricelist"
  | "pelanggan"
  | "blacklist"
  | "testimoni"
  | "pembayaran"
  | "pengaturan"
  | "order-detail";

interface AdminSidebarProps {
  activeView: AdminViewType;
  onViewChange: (view: AdminViewType) => void;
  orderMasukCount: number;
  orderDiprosesCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogoutClick: () => void;
}

export default function AdminSidebar({
  activeView,
  onViewChange,
  orderMasukCount,
  orderDiprosesCount,
  isOpenMobile,
  onCloseMobile,
  onLogoutClick,
}: AdminSidebarProps) {
  const isNavActive = (view: AdminViewType) => {
    if (activeView === "order-detail" && (view === "order-masuk" || view === "dashboard")) {
      return false;
    }
    return activeView === view;
  };

  const navItemClass = (view: AdminViewType) => {
    const active = isNavActive(view);
    return `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-150 cursor-pointer select-none ${
      active
        ? "bg-[#FFF0F5] text-[#FF2E74] shadow-2xs ring-1 ring-pink-200/90 font-black"
        : "text-slate-600 hover:text-[#FF2E74] hover:bg-pink-50/60"
    }`;
  };

  const content = (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-md border-r border-pink-100/80 select-none">
      
      {/* ─── 1. Pinned Logo Header (Always Visible at Top) ─── */}
      <div className="px-4 py-4 border-b border-pink-100/80 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-xs border-2 border-pink-200 bg-white flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo_background.PNG"
                alt="VietBlox Mascot"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <BrandLogo size="lg" className="group-hover:scale-105 transition-transform origin-left" />
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-8 h-8 rounded-xl bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 2. Scrollable Navigation Section (Middle) ─── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 flex flex-col gap-3.5">
        <nav className="flex flex-col gap-3">
          
          {/* Dashboard Item */}
          <div>
            <button
              onClick={() => {
                onViewChange("dashboard");
                onCloseMobile();
              }}
              className={navItemClass("dashboard")}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>
          </div>

          {/* Group 1: ORDER MANAGEMENT */}
          <div className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Order Management
            </span>

            {/* Order Masuk */}
            <button
              onClick={() => {
                onViewChange("order-masuk");
                onCloseMobile();
              }}
              className={navItemClass("order-masuk")}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Order Masuk</span>
              </div>
              {orderMasukCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFE4EE] text-[#FF2E74] text-[10px] font-black shadow-2xs">
                  {orderMasukCount}
                </span>
              )}
            </button>

            {/* Order Diproses */}
            <button
              onClick={() => {
                onViewChange("order-diproses");
                onCloseMobile();
              }}
              className={navItemClass("order-diproses")}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Order Diproses</span>
              </div>
              {orderDiprosesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFE4EE] text-[#FF2E74] text-[10px] font-black shadow-2xs">
                  {orderDiprosesCount}
                </span>
              )}
            </button>

            {/* Order Selesai */}
            <button
              onClick={() => {
                onViewChange("order-selesai");
                onCloseMobile();
              }}
              className={navItemClass("order-selesai")}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Order Selesai</span>
              </div>
            </button>

            {/* Order Dibatalkan */}
            <button
              onClick={() => {
                onViewChange("order-dibatalkan");
                onCloseMobile();
              }}
              className={navItemClass("order-dibatalkan")}
            >
              <div className="flex items-center gap-2.5">
                <XCircle className="w-4 h-4" />
                <span>Order Dibatalkan</span>
              </div>
            </button>
          </div>

          {/* Group 2: PRICELIST */}
          <div className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Pricelist
            </span>

            <button
              onClick={() => {
                onViewChange("pricelist");
                onCloseMobile();
              }}
              className={navItemClass("pricelist")}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>Pricelist Robux</span>
              </div>
            </button>
          </div>

          {/* Group 3: PELANGGAN */}
          <div className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Pelanggan
            </span>

            <button
              onClick={() => {
                onViewChange("pelanggan");
                onCloseMobile();
              }}
              className={navItemClass("pelanggan")}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Daftar Pelanggan</span>
              </div>
            </button>

            <button
              onClick={() => {
                onViewChange("blacklist");
                onCloseMobile();
              }}
              className={navItemClass("blacklist")}
            >
              <div className="flex items-center gap-2.5">
                <Ban className="w-4 h-4" />
                <span>Blacklist</span>
              </div>
            </button>
          </div>

          {/* Group 4: KONTEN & ULASAN */}
          <div className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Konten & Ulasan
            </span>

            <button
              onClick={() => {
                onViewChange("testimoni");
                onCloseMobile();
              }}
              className={navItemClass("testimoni")}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareHeart className="w-4 h-4" />
                <span>Kelola Testimoni</span>
              </div>
            </button>
          </div>

          {/* Group 5: KEUANGAN */}
          <div className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Keuangan
            </span>

            <button
              onClick={() => {
                onViewChange("pembayaran");
                onCloseMobile();
              }}
              className={navItemClass("pembayaran")}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4" />
                <span>Riwayat Pembayaran</span>
              </div>
            </button>
          </div>

          {/* Group 6: PENGATURAN */}
          <div className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Pengaturan
            </span>

            <button
              onClick={() => {
                onViewChange("pengaturan");
                onCloseMobile();
              }}
              className={navItemClass("pengaturan")}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4" />
                <span>Pengaturan Toko</span>
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* ─── 3. Pinned Footer Section (Always Visible at Bottom) ─── */}
      <div className="p-3.5 pt-2 border-t border-pink-100 flex flex-col gap-2.5 flex-shrink-0 bg-white/60">
        {/* Butuh Bantuan Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-b from-[#FFF5F8] to-[#FFEBF2] border border-pink-200/70 shadow-2xs flex flex-col gap-1.5">
          <div className="flex flex-col">
            <h5 className="text-[11px] font-black text-slate-900">Butuh Bantuan?</h5>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              Tim VietBlox siap membantu!
            </p>
          </div>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-2.5 rounded-xl bg-white border border-pink-200 hover:border-[#FF2E74] text-[#FF2E74] text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#FF2E74]" />
            <span>Chat Admin</span>
          </a>
        </div>

        {/* Footer Links: Lihat Toko & Keluar */}
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-600 pt-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 hover:text-[#FF2E74] transition-colors"
          >
            <span>Lihat Toko</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={onLogoutClick}
            className="flex items-center gap-1 text-[#FF2E74] hover:text-[#E62A6B] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 bottom-0 z-30 bg-white border-r border-pink-100/80 shadow-[0_0_20px_rgba(255,182,193,0.12)]">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={onCloseMobile}
        >
          <div
            className="w-72 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}
