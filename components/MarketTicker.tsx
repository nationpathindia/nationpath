"use client";
import { useEffect, useState } from "react";

export default function MarketTicker() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString() + " | " + now.toLocaleTimeString()
      );
    };

    updateTime(); // set immediately after mount
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-sm font-medium text-[#1E2A47]">

        <div className="flex space-x-8">
          <span className="text-green-600">▲ NIFTY 22450</span>
          <span className="text-green-600">▲ SENSEX 74210</span>
          <span className="text-red-600">▼ DOW 38900</span>
          <span className="text-green-600">▲ NASDAQ 16120</span>
          <span>MCX GOLD ₹62500</span>
          <span>USD/INR ₹83.21</span>
        </div>

        <div className="text-xs text-gray-700">
          {time ? time : ""}
        </div>

      </div>
    </div>
  );
}