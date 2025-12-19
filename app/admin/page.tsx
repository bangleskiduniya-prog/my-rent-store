"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingBag, ListTree, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const pSnap = await getDocs(collection(db, "products"));
      const oSnap = await getDocs(collection(db, "orders"));
      const cSnap = await getDocs(collection(db, "categories"));
      setStats({ products: pSnap.size, orders: oSnap.size, categories: cSnap.size });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold">Store Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <ShoppingBag className="text-[#bcac76] mb-4" />
          <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Products</h3>
          <p className="text-4xl font-serif font-bold">{stats.products}</p>
          <Link href="/admin/products" className="text-xs font-bold text-blue-500 mt-4 inline-block">Manage Inventory →</Link>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <Users className="text-[#bcac76] mb-4" />
          <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Orders</h3>
          <p className="text-4xl font-serif font-bold">{stats.orders}</p>
          <Link href="/admin/orders" className="text-xs font-bold text-blue-500 mt-4 inline-block">View Orders →</Link>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <ListTree className="text-[#bcac76] mb-4" />
          <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Categories</h3>
          <p className="text-4xl font-serif font-bold">{stats.categories}</p>
          <Link href="/admin/categories" className="text-xs font-bold text-blue-500 mt-4 inline-block">Edit Categories →</Link>
        </div>
      </div>
    </div>
  );
}