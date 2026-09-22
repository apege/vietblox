"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="relative bg-[#FFF0F5] text-slate-700 pt-12 pb-14 border-t border-pink-200/70 overflow-hidden">
      {/* Background Decorative Pink Clouds / Hearts */}
      <div className="absolute -left-10 bottom-0 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-6 -bottom-6 text-pink-200/50 pointer-events-none text-9xl">
        ♥
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Col 1: Brand Info & Mascot */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col items-start">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group mb-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-300 border border-pink-200 bg-white">
                <Image
                  src="/logo_background.PNG"
                  alt="VietBlox Mascot Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <BrandLogo size="md" className="group-hover:scale-105 transition-transform origin-left" />
                <span className="text-[10px] font-semibold text-slate-500 tracking-tight -mt-0.5">
                  Distributor Robux Region Vietnam
                </span>
              </div>
            </Link>

            {/* Slogan */}
            <p className="text-xs sm:text-sm font-black italic text-[#FF2E74] flex items-center gap-1.5 mb-6">
              <span>More Robux, More Happiness!</span>
              <span className="text-sm">💖</span>
            </p>

            {/* Copyright */}
            <p className="text-[11px] font-semibold text-slate-400 mt-auto">
              © {new Date().getFullYear()} VietBlox. Semua hak dilindungi.
            </p>
          </div>

          {/* Col 2: Menu (Blog and Cek Order removed) */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-2.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              Menu
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-600">
              <Link href="#beranda" className="hover:text-[#FF2E74] transition-colors">Beranda</Link>
              <Link href="#pricelist" className="hover:text-[#FF2E74] transition-colors">Pricelist</Link>
              <Link href="#cara-order" className="hover:text-[#FF2E74] transition-colors">Cara Order</Link>
              <Link href="#testimoni" className="hover:text-[#FF2E74] transition-colors">Testimoni</Link>
              <Link href="#faq" className="hover:text-[#FF2E74] transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Col 3: Bantuan */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-2.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              Bantuan
            </h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-600">
              <Link href="#cara-order" className="hover:text-[#FF2E74] transition-colors">Cara Order</Link>
              <Link href="#pricelist" className="hover:text-[#FF2E74] transition-colors">Metode Pembayaran</Link>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF2E74] transition-colors"
              >
                Hubungi Kami
              </a>
            </div>
          </div>

          {/* Col 4: Ikuti Kami */}
          <div className="md:col-span-4 lg:col-span-2 flex flex-col gap-2.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              Ikuti Kami
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
              {/* Instagram */}
              <a
                href="https://instagram.com/vietblox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FF2E74] transition-colors group"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span>Instagram</span>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@vietblox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FF2E74] transition-colors group"
              >
                <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.43c.43-.43.76-.94.98-1.5.21-.56.31-1.16.3-1.76V8.43a8.29 8.29 0 0 0 4.45 1.41V6.69z"/>
                  </svg>
                </div>
                <span>TikTok</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FF2E74] transition-colors group"
              >
                <div className="w-5 h-5 rounded-md bg-[#25D366] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <span>WhatsApp</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@vietblox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#FF2E74] transition-colors group"
              >
                <div className="w-5 h-5 rounded-md bg-[#FF0000] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Col 5: CTA Gabung Komunitas */}
          <div className="md:col-span-12 lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-pink-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              {/* Instagram Glossy 3D Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] flex items-center justify-center flex-shrink-0 shadow-md p-3 text-white">
                <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>

              {/* Text & Button */}
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs sm:text-[13px] font-black text-[#FF2E74] leading-tight">
                  Gabung Komunitas VietBlox
                </span>
                <span className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-tight mb-2">
                  Dapatkan info promo terbaru!
                </span>
                <a
                  href="https://instagram.com/vietblox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-extrabold text-[11px] shadow-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  <span>Follow Instagram</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
