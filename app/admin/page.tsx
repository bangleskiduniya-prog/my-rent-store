"use client";
import React from 'react';
import { ShoppingBag, ListTree, Settings, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome to your store management</p>
        </div>
        <div className="p-2 bg-black text-white rounded-lg">
          <LayoutDashboard className="w-5 h-5" />
        </div>
      </div>

      {/* Stats & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-xl mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Inventory</h3>
          <p className="text-2xl font-serif text-black mt-1 font-bold">Products</p>
          <Link href="/admin/products" className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 group">
            Manage Items <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Categories Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl mb-4">
            <ListTree className="w-6 h-6" />
          </div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Organization</h3>
          <p className="text-2xl font-serif text-black mt-1 font-bold">Categories</p>
          <Link href="/admin/categories" className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-600 group">
            Manage Categories <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-orange-50 text-orange-600 w-fit rounded-xl mb-4">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Configuration</h3>
          <p className="text-2xl font-serif text-black mt-1 font-bold">Store Settings</p>
          <Link href="/admin/settings" className="mt-4 flex items-center gap-2 text-xs font-bold text-orange-600 group">
            Edit WhatsApp & Name <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-black text-white p-10 rounded-[2rem] overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl font-serif mb-3">Ready to grow your business?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md leading-relaxed">
            Add your latest premium collection now. Your products will instantly appear on the storefront for your customers to order via WhatsApp.
          </p>
          <Link href="/admin/products" className="bg-white text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all inline-block">
            Add New Product
          </Link>
        </div>
        {/* Decorative Background Icon */}
        <ShoppingBag className="absolute right-[-40px] bottom-[-40px] w-80 h-80 text-white/5 -rotate-12" />
      </div>
    </div>
  );
}
