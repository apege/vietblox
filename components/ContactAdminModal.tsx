"use client";

import React from "react";
import { X, MessageCircle, Clock, Send, ShieldCheck } from "lucide-react";

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactAdminModal({ isOpen, onClose }: ContactAdminModalProps) {
  if (!isOpen) return null;

  const contacts = [
    {
      name: "WhatsApp CS 1 (Fast Response)",
      desc: "Layanan utama pemesanan & bantuan cepat",
      actionText: "Chat WhatsApp",
      link: "https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20saya%20butuh%20bantuan",
      color: "bg-emerald-500 hover:bg-emerald-600 text-white",
      badge: "Online 24/7",
    },
    {
      name: "WhatsApp CS 2 (Cadangan)",
      desc: "Jika CS 1 antri atau sedang sibuk",
      actionText: "Chat CS 2",
      link: "https://wa.me/6289876543210?text=Halo%20Admin%20VietBlox",
      color: "bg-emerald-500 hover:bg-emerald-600 text-white",
      badge: "Standby",
    },
    {
      name: "Telegram Community & Support",
      desc: "Update pricelist, promo & giveaway harian",
      actionText: "Buka Telegram",
      link: "https://t.me/vietbloxoifcial",
      color: "bg-sky-500 hover:bg-sky-600 text-white",
      badge: "Channel & Group",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#FF2E74] flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900">Hubungi Admin VietBlox</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ada pertanyaan atau kendala transaksi? Tim kami siap membantu!
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 hover:border-pink-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{c.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {c.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{c.desc}</p>
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2 rounded-xl ${c.color} text-center font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{c.actionText}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Jam Buka: 24 Jam Nonstop
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Garansi Resmi
          </span>
        </div>
      </div>
    </div>
  );
}
