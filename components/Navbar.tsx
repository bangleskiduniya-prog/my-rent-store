"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Menu, X, Search, Phone } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState<any>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const cSnap = await getDocs(collection(db, "categories"));
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      if (sSnap.exists()) setSettings(sSnap.data());
    };
    fetchData();
  }, []);

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white z-[100]">
      <div className="bg-black text-white text-[9px] py-2 text-center tracking-[0.3em] uppercase font-bold">
        Free Shipping on Orders Above Rs. 5000
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 cursor-pointer" onClick={() => setIsOpen(true)} />
          <div className="hidden md:relative md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-8 pr-4 py-2 bg-gray-50 rounded-full text-xs outline-none w-64"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="w-3 h-3 absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <Link href="/">
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tighter uppercase">
            {settings.storeName || 'PREMIUM STORE'}
          </h1>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm">
          <div className="bg-white w-[300px] h-full p-8 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif font-bold text-xl">MENU</span>
              <X className="w-6 h-6 cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="space-y-6">
              <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm font-bold uppercase tracking-widest border-b pb-4">Home</Link>
              {categories.map((cat: any) => (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.name}`} 
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-bold uppercase tracking-widest border-b pb-4 text-gray-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="mt-20 pt-10 border-t">
               <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Contact Us</p>
               <a href={`https://wa.me/${settings.whatsapp}`} className="flex items-center gap-2 font-bold text-sm">
                 <Phone className="w-4 h-4 text-[#25D366]" /> WhatsApp Support
               </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}