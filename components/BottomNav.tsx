"use client";
import React from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, Search, Heart } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      <Link href="/" className="flex flex-col items-center gap-1 text-[#111111]">
        <Home className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-tighter">Home</span>
      </Link>
      <Search className="w-5 h-5 text-gray-400" />
      <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-400">
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-tighter">Cart</span>
      </Link>
      <Heart className="w-5 h-5 text-gray-400" />
    </div>
  );
}