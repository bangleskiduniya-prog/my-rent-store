"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const pSnap = await getDocs(query(collection(db, "products"), limit(8)));
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any);
      if (sSnap.exists()) setSettings(sSnap.data());
    };
    fetchData();
  }, []);

  // Default data if settings not set
  const grid = {
    g1: settings?.grid1 || { title: 'Women', img: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=800' },
    g2: settings?.grid2 || { title: 'Boys', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800' },
    g3: settings?.grid3 || { title: 'Girls', img: 'https://images.unsplash.com/photo-1503910335345-472927d9b44b?q=80&w=800' },
    g4: settings?.grid4 || { title: 'Men', img: 'https://images.unsplash.com/photo-1617137964031-54547bbfe63a?q=80&w=800' }
  };

  return (
    <div className="bg-white pb-24">
      {/* Hero Banner */}
      <section className="w-full h-[60vh] md:h-[80vh] bg-gray-100 relative overflow-hidden">
        <img src={grid.g1.img} className="w-full h-full object-cover opacity-90" alt="Hero" />
        <div className="absolute inset-0 flex flex-col justify-center items-end pr-10 md:pr-20 text-right bg-black/10">
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-white leading-tight drop-shadow-xl italic">{grid.g1.title}</h2>
          <button className="mt-6 bg-white text-black px-10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#bcac76] hover:text-white transition-all">Explore Collection</button>
        </div>
      </section>

      {/* DYNAMIC SHOP BY CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-center text-3xl font-bold tracking-tighter uppercase">Shop By Categories</h3>
        <div className="w-24 h-1 bg-red-600 mx-auto mt-2 mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[700px]">
          {/* Left: Grid 1 */}
          <Link href={`/category/${grid.g1.title}`} className="relative group overflow-hidden bg-gray-50 h-[450px] md:h-full shadow-sm">
            <img src={grid.g1.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute bottom-6 left-0 right-0 bg-black/80 text-white text-center py-3 text-[10px] font-bold uppercase tracking-widest">{grid.g1.title}</div>
          </Link>

          {/* Middle: Grid 2 & 3 */}
          <div className="grid grid-rows-2 gap-6 h-full">
            <Link href={`/category/${grid.g2.title}`} className="relative group overflow-hidden bg-gray-50 shadow-sm">
              <img src={grid.g2.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
              <div className="absolute bottom-4 left-0 right-0 bg-black/80 text-white text-center py-2 text-[10px] font-bold uppercase tracking-widest">{grid.g2.title}</div>
            </Link>
            <Link href={`/category/${grid.g3.title}`} className="relative group overflow-hidden bg-gray-50 shadow-sm">
              <img src={grid.g3.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
              <div className="absolute bottom-4 left-0 right-0 bg-black/80 text-white text-center py-2 text-[10px] font-bold uppercase tracking-widest">{grid.g3.title}</div>
            </Link>
          </div>

          {/* Right: Grid 4 */}
          <Link href={`/category/${grid.g4.title}`} className="relative group overflow-hidden bg-gray-50 h-[450px] md:h-full shadow-sm">
            <img src={grid.g4.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute bottom-6 left-0 right-0 bg-black/80 text-white text-center py-3 text-[10px] font-bold uppercase tracking-widest">{grid.g4.title}</div>
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h3 className="text-2xl font-bold uppercase tracking-tighter">New Arrivals</h3>
        <div className="w-32 h-1 bg-red-600 mt-2 mb-12"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <div key={p.id} className="group border border-gray-50 p-3 bg-white hover:shadow-xl transition-all duration-500">
              <Link href={`/product/${p.id}`}>
                <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden relative">
                  <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute top-3 left-3 bg-[#bcac76] text-white text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">New</div>
                </div>
                <h4 className="text-[11px] font-bold uppercase text-gray-900 h-10 overflow-hidden text-center leading-tight">{p.title}</h4>
                <p className="text-center text-[#bcac76] font-serif font-bold text-lg mt-2 italic">Rs. {p.price}</p>
              </Link>
              <button className="mt-6 w-full bg-black text-white py-4 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#bcac76] transition-all">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}