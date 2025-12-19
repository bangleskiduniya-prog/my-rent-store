"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Heart, ShoppingCart, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center z-[100] shadow-lg">
      <Link href="/" className="flex flex-col items-center gap-1 flex-1">
        <Home className="w-6 h-6 text-gray-800" />
        <span className="text-[10px] font-medium">Shop</span>
      </Link>
      <Link href="/wishlist" className="flex flex-col items-center gap-1 flex-1 border-x border-gray-100">
        <Heart className="w-6 h-6 text-gray-800" />
        <span className="text-[10px] font-medium">Wishlist</span>
      </Link>
      <Link href="/cart" className="flex flex-col items-center gap-1 flex-1 relative">
        <ShoppingCart className="w-6 h-6 text-gray-800" />
        <span className="absolute top-0 right-4 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
        <span className="text-[10px] font-medium">Cart</span>
      </Link>
      <Link href="/admin" className="flex flex-col items-center gap-1 flex-1 border-l border-gray-100">
        <User className="w-6 h-6 text-gray-800" />
        <span className="text-[10px] font-medium">My account</span>
      </Link>
    </div>
  );
}