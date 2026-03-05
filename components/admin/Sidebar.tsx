"use client";

import Link from "next/link";
import { LayoutDashboard, Users, FileText, MessageSquare, Settings, Folder } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 hidden md:block">

      <h2 className="text-xl font-bold mb-10 tracking-wide">
        ADMIN PANEL
      </h2>

      <nav className="space-y-4 text-sm">

        <Link href="/admin" className="flex items-center gap-3 hover:text-blue-400">
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <Link href="/admin/users" className="flex items-center gap-3 hover:text-blue-400">
          <Users size={18} /> Users
        </Link>

        <Link href="/admin/posts" className="flex items-center gap-3 hover:text-blue-400">
          <FileText size={18} /> Posts
        </Link>

        <Link href="/admin/categories" className="flex items-center gap-3 hover:text-blue-400">
          <Folder size={18} /> Categories
        </Link>

        <Link href="/admin/comments" className="flex items-center gap-3 hover:text-blue-400">
          <MessageSquare size={18} /> Comments
        </Link>

        <Link href="/admin/settings" className="flex items-center gap-3 hover:text-blue-400">
          <Settings size={18} /> Settings
        </Link>

      </nav>
    </div>
  );
}