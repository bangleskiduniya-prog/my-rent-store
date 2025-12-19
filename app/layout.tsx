"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ListTree, Settings, Home, Lock, ClipboardList } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') setIsAuthorized(true);
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full text-center">
          <Lock className="w-12 h-12 mx-auto mb-6 text-black" />
          <h2 className="text-2xl font-serif font-bold mb-6">Admin Access</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl mb-4 outline-none text-center" placeholder="Enter Password" />
          <button onClick={() => { if(password === 'admin0012') { setIsAuthorized(true); localStorage.setItem('admin_auth', 'true'); } }} className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-black text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-900"><h2 className="text-xl font-serif font-bold tracking-tighter">ADMIN PANEL</h2></div>
        <nav className="flex-1 p-6 space-y-3">
          <Link href="/admin" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
          <Link href="/admin/products" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all"><ShoppingBag className="w-4 h-4" /> Products</Link>
          <Link href="/admin/orders" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all"><ClipboardList className="w-4 h-4" /> Orders</Link>
          <Link href="/admin/categories" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all"><ListTree className="w-4 h-4" /> Categories</Link>
          <Link href="/admin/settings" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all"><Settings className="w-4 h-4" /> Settings</Link>
        </nav>
        <div className="p-6 border-t border-gray-900">
          <Link href="/" className="text-gray-500 text-[10px] uppercase font-bold tracking-widest hover:text-white">View Storefront</Link>
        </div>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}