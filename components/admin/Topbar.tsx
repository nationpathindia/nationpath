"use client";

import { Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <div className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8">

      <h1 className="text-lg font-semibold">
        Dashboard Overview
      </h1>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer hover:text-blue-400" />
        <User className="cursor-pointer hover:text-blue-400" />
      </div>

    </div>
  );
}