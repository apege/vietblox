"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  // Dimensions
  const sizes = {
    sm: { width: 110, height: 32, fontSize: 24, y: 24, vietWidth: 50 },
    md: { width: 135, height: 38, fontSize: 28, y: 29, vietWidth: 58 },
    lg: { width: 170, height: 48, fontSize: 36, y: 37, vietWidth: 74 },
  };

  const current = sizes[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${current.width} ${current.height}`}
        style={{ width: `${current.width}px`, height: `${current.height}px` }}
        className="overflow-visible"
        aria-label="VietBlox Logo"
      >
        <defs>
          {/* Pink Gradient for 'Viet' */}
          <linearGradient id={`vietGrad-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA6B8" />
            <stop offset="25%" stopColor="#FF7E98" />
            <stop offset="70%" stopColor="#FF5277" />
            <stop offset="100%" stopColor="#E62E5C" />
          </linearGradient>

          {/* Yellow Gradient for 'Blox' */}
          <linearGradient id={`bloxGrad-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF280" />
            <stop offset="30%" stopColor="#FFDE43" />
            <stop offset="75%" stopColor="#FDB813" />
            <stop offset="100%" stopColor="#E08B00" />
          </linearGradient>

          {/* Subtle 3D Shadow */}
          <filter id={`logoShadow-${size}`} x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1" floodColor="#3A0D18" floodOpacity="0.35" />
          </filter>
        </defs>

        <g filter={`url(#logoShadow-${size})`}>
          {/* ====== 'Viet' LAYER ====== */}
          {/* 1. Dark Outline Stroke (Thick outline) */}
          <text
            x="2"
            y={current.y}
            className="font-black font-brand"
            style={{
              fontFamily: "var(--font-fredoka), 'Fredoka', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
              fontSize: `${current.fontSize}px`,
              fontWeight: 800,
              stroke: "#801B34",
              strokeWidth: size === "lg" ? "5.5px" : "4.5px",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              fill: "none",
              letterSpacing: "-0.5px",
            }}
          >
            Viet
          </text>

          {/* 2. Gradient Fill */}
          <text
            x="2"
            y={current.y}
            className="font-black font-brand"
            style={{
              fontFamily: "var(--font-fredoka), 'Fredoka', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
              fontSize: `${current.fontSize}px`,
              fontWeight: 800,
              fill: `url(#vietGrad-${size})`,
              letterSpacing: "-0.5px",
            }}
          >
            Viet
          </text>

          {/* ====== 'Blox' LAYER ====== */}
          {/* 1. Dark Outline Stroke (Golden-brown outline) */}
          <text
            x={current.vietWidth}
            y={current.y}
            className="font-black font-brand"
            style={{
              fontFamily: "var(--font-fredoka), 'Fredoka', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
              fontSize: `${current.fontSize}px`,
              fontWeight: 800,
              stroke: "#78350F",
              strokeWidth: size === "lg" ? "5.5px" : "4.5px",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              fill: "none",
              letterSpacing: "-0.5px",
            }}
          >
            Blox
          </text>

          {/* 2. Gradient Fill */}
          <text
            x={current.vietWidth}
            y={current.y}
            className="font-black font-brand"
            style={{
              fontFamily: "var(--font-fredoka), 'Fredoka', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
              fontSize: `${current.fontSize}px`,
              fontWeight: 800,
              fill: `url(#bloxGrad-${size})`,
              letterSpacing: "-0.5px",
            }}
          >
            Blox
          </text>
        </g>
      </svg>
    </div>
  );
}
