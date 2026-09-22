"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const testimonials = [
    {
      username: "@syaa.roblox",
      time: "1 hari yang lalu",
      comment: "Trusted banget! udah langganan disini, selalu aman dan cepat 💖",
      avatarSrc: "/logo_background.PNG",
      robuxAmount: "+1200",
    },
    {
      username: "@rifkaxz",
      time: "2 jam yang lalu",
      comment: "Robux udah masuk kak, makasih banyak! prosesnya cepet banget <3",
      avatarSrc: "/logo_background.PNG",
      robuxAmount: "+800",
    },
    {
      username: "@kentanggg",
      time: "2 hari yang lalu",
      comment: "Harga paling murah sih menurutku, mantap VietBlox! 👏",
      avatarSrc: "/logo_background.PNG",
      robuxAmount: "+2500",
    },
    {
      username: "@alvin_rbx",
      time: "3 hari yang lalu",
      comment: "Awalnya ragu karena murah banget, pas coba 5000 Robux langsung mendarat 2 menit! 🔥",
      avatarSrc: "/logo_background.PNG",
      robuxAmount: "+5000",
    },
    {
      username: "@manda.bloxfan",
      time: "4 hari yang lalu",
      comment: "Adminnya ramah banget dan fast respon! Top up region Vietnam termurah se-Indonesia.",
      avatarSrc: "/logo_background.PNG",
      robuxAmount: "+1600",
    },
  ];

  // Sync scroll position to calculate active dot
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const step = maxScroll / (testimonials.length - 1);
    const current = Math.round(scrollLeft / step);
    setActiveIndex(Math.min(testimonials.length - 1, Math.max(0, current)));
  };

  // Scroll to slide when dot or arrow is clicked
  const scrollToSlide = (index: number) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (index / (testimonials.length - 1)) * maxScroll;
    sliderRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(testimonials.length - 1, activeIndex + 1);
    scrollToSlide(nextIdx);
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section id="testimoni" className="py-12 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Wrapped Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-pink-100/90 shadow-[0_15px_45px_rgba(255,105,180,0.14)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Button */}
            <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">
              <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-black text-slate-900 tracking-tight leading-[1.28] mb-4">
                <span className="relative inline-block pb-2">
                  Apa Kata
                  <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#FFB800] rounded-full" />
                </span>{" "}
                <br />
                <span className="block mt-1">Pelanggan Kami?</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                Ribuan pelanggan sudah mempercayai VietBlox untuk top up Robux mereka!
              </p>

              <button
                onClick={() => {
                  window.open("https://wa.me/6281234567890?text=Halo%20Admin%20VietBlox,%20mau%20lihat%20kumpulan%20testimoni%20lengkap", "_blank");
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-pink-300 text-[#FF2E74] font-extrabold text-xs sm:text-sm bg-pink-50/40 hover:bg-pink-100/70 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <span>Lihat Semua Testimoni</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column: Testimonial Carousel Cards */}
            <div className="lg:col-span-8 relative">
              
              {/* Navigation Arrow Left */}
              <button
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-pink-100 text-slate-700 hover:text-[#FF2E74] hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Navigation Arrow Right */}
              <button
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-pink-100 text-slate-700 hover:text-[#FF2E74] hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Horizontal Scrollable Carousel */}
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth cursor-grab active:cursor-grabbing select-none"
              >
                {testimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-[270px] sm:w-[295px] rounded-3xl p-5 bg-white border border-slate-100 hover:border-pink-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* User Header */}
                    <div className="flex items-center gap-3 mb-3.5">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-pink-100 flex-shrink-0 shadow-xs">
                        <Image
                          src={item.avatarSrc}
                          alt={item.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                          {item.username}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {item.time}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-semibold mb-4">
                      {item.comment}
                    </p>

                    {/* Sleek Dark Roblox Balance Card */}
                    <div className="mt-auto bg-[#0E1322] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-slate-800/80">
                      <div className="relative w-7 h-7 flex-shrink-0">
                        <Image
                          src="/robux.webp"
                          alt="Robux"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                          Robux Saldo
                        </span>
                        <span className="text-sm font-black text-white mt-1 leading-none tracking-tight">
                          {item.robuxAmount}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Dynamic Interactive Dots Pagination */}
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {testimonials.map((_, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToSlide(idx)}
                      aria-label={`Lihat testimoni ke-${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "w-6 bg-[#FF2E74] shadow-xs"
                          : "w-2 bg-pink-200 hover:bg-pink-300"
                      }`}
                    />
                  );
                })}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
