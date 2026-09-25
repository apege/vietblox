"use client";

import React from "react";
import { LogOut, X } from "lucide-react";
import Link from "next/link";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200">
        
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#FF2E74]">
          <LogOut className="w-7 h-7" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-black text-slate-900">Keluar dari Panel Admin?</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Kamu akan diarahkan kembali ke halaman storefront utama toko VietBlox.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 w-full pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Batal
          </button>
          <Link
            href="/"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#FF5588] text-white font-black text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center"
          >
            Ya, Keluar
          </Link>
        </div>

      </div>
    </div>
  );
}
