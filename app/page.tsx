"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Menu, Phone, ChevronRight, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const pSnap = await getDocs(query(collection(db, "products"), limit(8)));
      const cSnap = await getDocs(collection(db, "categories"));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setCategories(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50 px-6 py-5 flex justify-between items-center">
        <Menu className="w-6 h-6 cursor-pointer" />
        <h1 className="text-2xl font-serif font-bold tracking-tighter">PREMIUM FASHION STORE</h1>
        <div className="flex gap-4">
          <ShoppingBag className="w-5 h-5 cursor-pointer" />
        </div>
      </nav>

      {/* Hero Slider Placeholder */}
      <section className="relative h-[70vh] bg-gray-900 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-5xl md:text-7xl font-serif mb-4">New Collection</h2>
          <p className="tracking-[0.3em] uppercase text-xs mb-8">Tradition Meets Luxury</p>
          <button className="bg-white text-black px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all">Shop Now</button>
        </div>
      </section>

      {/* SHOP BY CATEGORIES (The Grid Layout you asked for) */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-center text-3xl font-serif mb-12 tracking-tight">Shop By Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
          {/* Left Big Category */}
          <div className="relative group overflow-hidden rounded-sm bg-gray-100 h-full">
            <img src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
            <div className="absolute bottom-10 left-10 z-20">
              <span className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">Women Dresses</span>
            </div>
          </div>
          {/* Right Two Small Categories */}
          <div className="grid grid-rows-2 gap-4 h-full">
            <div className="relative group overflow-hidden rounded-sm bg-gray-100">
              <img src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">Boy Dresses</span>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-sm bg-gray-100">
              <img src="https://images.unsplash.com/photo-1503910335345-472927d9b44b?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">Girl Dresses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <h3 className="text-2xl font-serif italic">Featured Collection</h3>
          <Link href="/shop" className="text-[10px] font-bold uppercase border-b border-black pb-1">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
          {products.map((p: any) => (
            <Link href={`/product/${p.id}`} key={p.id} className="group">
              <div className="aspect-[3/4] bg-[#f9f9f9] mb-4 overflow-hidden relative">
                <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 text-[8px] font-bold uppercase">-40%</div>
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-800 truncate">{p.title}</h4>
              <p className="text-sm font-serif mt-1 text-gold font-bold">Rs. {p.price}</p>
              <button className="mt-4 w-full border border-black py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Add to Cart</button>
            </Link>
          ))}
        </div>
      </section>

      {/* WhatsApp Button */}
      <a href="https://wa.me/923035958676" className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 whatsapp-pulse">
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}