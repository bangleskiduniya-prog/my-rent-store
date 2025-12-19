"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ListTree, Settings, Home, Lock } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in (Session)
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthorized(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin0012') {
      setIsAuthorized(true);
      localStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect Password. Access Denied.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthorized(false);
  };

  // If not authorized, show Login Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">Admin Access</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-8 font-bold">Enter Password to Continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-center focus:outline-none focus:border-black transition-all"
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter">{error}</p>}
            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg">
              Login to Dashboard
            </button>
          </form>
          <Link href="/" className="inline-block mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
            Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // If authorized, show the Admin Panel
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-900">
          <h2 className="text-xl font-serif font-bold tracking-tighter text-white">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <Link href="/admin" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">
            <ShoppingBag className="w-4 h-4" /> Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">
            <ListTree className="w-4 h-4" /> Categories
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
        <div className="p-6 border-t border-gray-900 space-y-4">
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-all">
            <Lock className="w-4 h-4" /> Logout
          </button>
          <Link href="/" className="flex items-center gap-4 p-3 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all">
            <Home className="w-4 h-4" /> View Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
