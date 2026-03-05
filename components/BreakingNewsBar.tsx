"use client";

export default function BreakingNewsBar() {
  return (
    <div className="relative bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#0F172A] text-white border-b border-white/10">

      {/* Subtle moving light line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

      <div className="max-w-7xl mx-auto flex items-center py-3 relative z-10">

        {/* Sharp Label */}
        <div className="bg-[#E11D48] px-5 py-2 text-xs font-semibold tracking-[2px] uppercase">
          Breaking News
        </div>

        {/* Animated News */}
        <div className="overflow-hidden ml-8 flex-1">
          <div className="whitespace-nowrap animate-marquee text-sm font-medium tracking-wide text-gray-200">
            Premium Investment Plans Available Now • Trade MCX with Zero Brokerage • 
            Open Demat Account Today • Grow Your Portfolio with NationPath Partners
          </div>
        </div>

      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </div>
  );
}