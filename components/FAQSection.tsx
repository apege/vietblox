"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apa itu Top Up Robux Region Vietnam?",
      a: "Top Up Region Vietnam adalah metode top up resmi yang memanfaatkan perbedaan kurs & regional pricing resmi di Vietnam sehingga harga Robux menjadi jauh lebih terjangkau dibanding top up biasa di Indonesia.",
    },
    {
      q: "Apakah akun saya aman dan tidak akan kena banned?",
      a: "100% Sangat Aman! Proses pengisian dilakukan secara legal dan hanya membutuhkan username Roblox tanpa perlu password akun. Tidak ada akses langsung ke data login kamu.",
    },
    {
      q: "Berapa lama proses pengiriman Robux?",
      a: "Setelah pembayaran kamu terverifikasi secara otomatis oleh sistem, Robux akan langsung masuk ke akun kamu dalam hitungan 1 hingga 3 menit saja.",
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Kami menerima seluruh pembayaran populer di Indonesia: QRIS (BCA, Mandiri, BRI, BNI, Seabank, dll), E-Wallet (DANA, OVO, GoPay, ShopeePay), serta Transfer Bank BCA.",
    },
    {
      q: "Bagaimana jika ada kendala saat top up?",
      a: "Kamu bisa langsung klik tombol 'Hubungi Admin' di bagian atas maupun bawah website. CS kami online 24 jam nonstop siap membantu hingga tuntas.",
    },
  ];

  return (
    <section id="faq" className="py-10 sm:py-16 lg:py-20 bg-white/70 border-t border-pink-100">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#FF2E74] text-xs font-bold mb-2 sm:mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Tanya Jawab
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked <span className="text-[#FF2E74]">Questions</span>
          </h2>
          <p className="text-xs sm:text-base text-slate-600 mt-1.5 sm:mt-2 font-medium">
            Pertanyaan yang sering ditanyakan seputar layanan VietBlox
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-pink-100 bg-white overflow-hidden shadow-xs hover:border-pink-200 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-4 py-3.5 sm:px-6 sm:py-4.5 text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-slate-800 text-xs sm:text-base hover:text-[#FF2E74] transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#FF2E74]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-pink-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
