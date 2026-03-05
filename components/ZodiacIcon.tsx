// components/ZodiacIcon.tsx

import React from "react";

interface Props {
  sign?: string | null;
  className?: string;
}

export default function ZodiacIcon({ sign, className }: Props) {
  const normalized =
    sign?.trim()
      ? sign.trim().charAt(0).toUpperCase() +
        sign.trim().slice(1).toLowerCase()
      : "";

  const glyphs: Record<string, string> = {
    Aries: "♈︎",
    Taurus: "♉︎",
    Gemini: "♊︎",
    Cancer: "♋︎",
    Leo: "♌︎",
    Virgo: "♍︎",
    Libra: "♎︎",
    Scorpio: "♏︎",
    Sagittarius: "♐︎",
    Capricorn: "♑︎",
    Aquarius: "♒︎",
    Pisces: "♓︎",
  };

  return (
    <div
      className={`relative w-16 h-16 rounded-full bg-[#0b2a6f]
      flex items-center justify-center
      shadow-md transition-all duration-300
      group-hover:shadow-xl
      group-hover:scale-105
      ${className}`}
    >
      {/* subtle glow */}
      <div className="absolute inset-0 rounded-full bg-[#0b2a6f] opacity-0 group-hover:opacity-20 blur-md transition duration-300"></div>

      <span
        className="relative text-white text-4xl font-semibold transition-transform duration-300 group-hover:scale-110"
        style={{ fontVariantEmoji: "text" }}
      >
        {glyphs[normalized] ?? "✦"}
      </span>
    </div>
  );
}