"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      const cSnap = await getDocs(collection(db, "categories"));
      if (sSnap.exists()) setSettings(sSnap.data());
      setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any);
    };
    fetchData();
  }, []);

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white z-[100]">
      <div className="bg-black text-white text-[9px] py-2 text-center tracking-[0.2em] uppercase font-bold">
        Free Shipping on Orders Above Rs. 5000
      </div>
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Menu className="w-6 h-6 cursor-pointer" onClick={() => setIsOpen(true)} />
        <Link href="/">
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tighter uppercase">
            {settings.storeName || 'PREMIUM STORE'}
          </h1>
        </Link>
        <ShoppingBag className="w-5 h-5 cursor-pointer" />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm">
          <div className="bg-white w-[300px] h-full p-8 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif font-bold text-xl tracking-tighter">MENU</span>
              <X className="w-6 h-6 cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="space-y-6">
              <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest border-b pb-4">Home</Link>
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/category/${cat.name}`} onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest border-b pb-4 text-gray-600">{cat.name}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}