"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Menu, X } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";

interface NavbarProps {
  onContactClick?: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Beranda");

  const navLinks = [
    { name: "Beranda", href: "#beranda" },
    { name: "Pricelist", href: "#pricelist" },
    { name: "Cara Order", href: "#cara-order" },
    { name: "Testimoni", href: "#testimoni" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleAdminContact = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      window.open(
        "https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20saya%20mau%20tanya%20seputar%20Top%20Up%20Robux",
        "_blank"
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-pink-100/70 shadow-[0_2px_14px_-3px_rgba(255,182,193,0.18)] transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-300 border border-pink-200 bg-white flex-shrink-0">
              <Image
                src="/logo_background.PNG"
                alt="VietBlox Mascot Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="scale-90 sm:scale-100 origin-left">
                <BrandLogo size="md" className="group-hover:scale-105 transition-transform origin-left" />
              </div>
              <span className="text-[9px] sm:text-[11px] font-semibold text-slate-500 tracking-tight -mt-1 sm:-mt-0.5 truncate">
                Distributor Robux Region Vietnam
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveNav(link.name)}
                  className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#FFE4EE] text-[#FF2E74] shadow-xs"
                      : "text-slate-600 hover:text-[#FF2E74] hover:bg-pink-50/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Hubungi Admin (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleAdminContact}
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#FF3B7D] via-[#FF5388] to-[#FF6B6B] text-white font-extrabold text-xs lg:text-sm shadow-[0_4px_14px_rgba(255,59,125,0.35)] hover:shadow-[0_6px_20px_rgba(255,59,125,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-3 h-3 text-white fill-white/30" />
              </div>
              <span>Hubungi Admin</span>
            </button>
          </div>

          {/* Mobile Right Action Bar */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={handleAdminContact}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF3B7D] to-[#FF6B6B] text-white font-black text-[11px] shadow-xs hover:opacity-90 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-xl bg-pink-50/80 border border-pink-100 flex items-center justify-center text-slate-700 hover:bg-pink-100 active:scale-95 transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-[#FF2E74]" /> : <Menu className="w-4.5 h-4.5 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Backdrop & Animation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-pink-100/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveNav(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#FFE4EE] text-[#FF2E74] font-black"
                      : "text-slate-700 hover:bg-pink-50/60"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E74]" />}
                </Link>
              );
            })}
            <div className="pt-2 mt-1 border-t border-pink-100">
              <button
                onClick={() => {
                  handleAdminContact();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B7D] to-[#FF6B6B] text-white font-extrabold text-xs shadow-md active:scale-98 transition-transform"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Hubungi Admin (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
