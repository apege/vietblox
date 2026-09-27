"use client";

import React from "react";
import { useStoreSettings } from "@/hooks/useStoreSettings";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  name?: string;
}

function splitBrandName(name: string): [string, string] {
  if (!name) return ["Viet", "Blox"];
  const trimmed = name.trim();
  if (trimmed.includes(" ")) {
    const idx = trimmed.indexOf(" ");
    return [trimmed.slice(0, idx), trimmed.slice(idx + 1)];
  }
  // If PascalCase like VietBlox
  const match = trimmed.match(/^([A-Z][a-z0-9]+)([A-Z].*)$/);
  if (match) {
    return [match[1], match[2]];
  }
  return [trimmed, ""];
}

export default function BrandLogo({ className = "", size = "md", name }: BrandLogoProps) {
  const { settings } = useStoreSettings();
  const rawName = name || settings?.storeName || "VietBlox";

  const [part1, part2] = splitBrandName(rawName);

  const sizeClasses = {
    sm: "text-[20px] sm:text-[22px]",
    md: "text-[24px] sm:text-[26px]",
    lg: "text-[30px] sm:text-[34px]",
  };

  return (
    <div className={`inline-flex items-center gap-0.5 font-black select-none tracking-tight leading-none ${sizeClasses[size]} ${className}`}>
      {/* Part 1 (Pink 3D Gradient) */}
      {part1 && (
        <span
          className="font-brand font-black inline-block"
          style={{
            fontFamily: "var(--font-fredoka), 'Fredoka', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
            background: "linear-gradient(180deg, #FFA6B8 0%, #FF7E98 25%, #FF5277 70%, #E62E5C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 1.5px 0 #801B34) drop-shadow(0 2.5px 1.5px rgba(58,13,24,0.35))",
            letterSpacing: "-0.5px",
          }}
        >
          {part1}
        </span>
      )}

      {/* Part 2 (Gold/Yellow 3D Gradient) */}
      {part2 && (
        <span
          className="font-brand font-black inline-block ml-0.5"
          style={{
            fontFamily: "var(--font-fredoka), 'Fredoka', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
            background: "linear-gradient(180deg, #FFF280 0%, #FFDE43 30%, #FDB813 75%, #E08B00 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 1.5px 0 #78350F) drop-shadow(0 2.5px 1.5px rgba(120,53,15,0.35))",
            letterSpacing: "-0.5px",
          }}
        >
          {part2}
        </span>
      )}
    </div>
  );
}
