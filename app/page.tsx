"use client";
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
      <h1 className="text-4xl font-serif font-bold mb-4 tracking-tighter">MY PREMIUM STORE</h1>
      <p className="text-gray-500 uppercase tracking-[0.3em] text-xs mb-8">Website is Live & Working</p>
      
      <div className="flex gap-4">
        <Link href="/admin" className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Go to Admin
        </Link>
        <a href="/" className="border border-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Refresh Store
        </a>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-100 w-full max-w-xs">
        <p className="text-[9px] text-gray-400 uppercase tracking-widest">
          Developer: creativejunaid0012@gmail.com
        </p>
      </div>
    </div>
  );
}