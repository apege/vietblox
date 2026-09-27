"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import HowToOrderSection from "@/components/HowToOrderSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhyVietnamSection from "@/components/WhyVietnamSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import HowToOrderModal from "@/components/HowToOrderModal";
export default function Home() {
  const [isHowToOrderOpen, setIsHowToOrderOpen] = useState(false);

  const scrollToTopUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCaraOrder = () => {
    const el = document.getElementById("cara-order");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsHowToOrderOpen(true);
    }
  };

  const scrollToFAQ = () => {
    const el = document.getElementById("faq");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FFF5F8] text-[#1E293B]">
      {/* Navbar with dynamic logo and Direct WhatsApp link */}
      <Navbar />

      {/* Hero Banner with Generated Background, Mascot Character, Badges, Quick Top-Up & 4 Benefits */}
      <HeroBanner
        onTopUpClick={scrollToTopUp}
        onHowToOrderClick={scrollToCaraOrder}
      />

      {/* 3 Step Cards: Cara Order di VietBlox */}
      <HowToOrderSection onGuideClick={() => setIsHowToOrderOpen(true)} />

      {/* Kumpulan Testimoni Pelanggan: Apa Kata Pelanggan Kami? */}
      <TestimonialsSection />

      {/* Kenapa Robux Vietnam Lebih Murah? + Stats Widget */}
      <WhyVietnamSection onReadMore={scrollToFAQ} />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <HowToOrderModal
        isOpen={isHowToOrderOpen}
        onClose={() => setIsHowToOrderOpen(false)}
      />
    </main>
  );
}
