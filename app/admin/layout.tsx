"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ListTree, Settings, Home } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-serif font-bold tracking-tighter text-gold">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 text-sm hover:bg-gray-900 rounded-lg transition-all">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 text-sm hover:bg-gray-900 rounded-lg transition-all">
            <ShoppingBag className="w-4 h-4" /> Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 p-3 text-sm hover:bg-gray-900 rounded-lg transition-all">
            <ListTree className="w-4 h-4" /> Categories
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 text-sm hover:bg-gray-900 rounded-lg transition-all">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 p-3 text-sm text-gray-400 hover:text-white transition-all">
            <Home className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
