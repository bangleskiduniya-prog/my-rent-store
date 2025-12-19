"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const pSnap = await getDocs(query(collection(db, "products"), limit(12)));
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any);
      if (sSnap.exists()) setSettings(sSnap.data());
    };
    fetchData();
  }, []);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-[85vh] bg-[#F3F0ED] overflow-hidden">
        <img src={settings.heroBanners?.[0] || "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=2000"} className="w-full h-full object-cover opacity-90" alt="Hero" />
        <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center text-white text-center px-4">
          <h2 className="text-5xl md:text-8xl font-serif mb-4 drop-shadow-2xl italic">Luxury Collection</h2>
          <p className="tracking-[0.5em] uppercase text-[10px] mb-10 font-bold">Tradition Meets Modernity</p>
          <button className="bg-white text-black px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-700 shadow-2xl">Shop Now</button>
        </div>
      </section>

      {/* Grid Categories (As per your screenshot) */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h3 className="text-center text-3xl font-serif mb-16 tracking-tighter uppercase">Shop By Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[700px]">
          <div className="relative group overflow-hidden bg-white shadow-sm h-[400px] md:h-full">
            <img src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute bottom-10 left-10"><span className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em]">Women Dresses</span></div>
          </div>
          <div className="grid grid-rows-2 gap-6 h-full">
            <div className="relative group overflow-hidden bg-white shadow-sm">
              <img src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
              <div className="absolute bottom-6 left-6"><span className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em]">Men Wear</span></div>
            </div>
            <div className="relative group overflow-hidden bg-white shadow-sm">
              <img src="https://images.unsplash.com/photo-1503910335345-472927d9b44b?q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
              <div className="absolute bottom-6 left-6"><span className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em]">Kids Collection</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
          <h3 className="text-3xl font-serif italic">New Arrivals</h3>
          <Link href="/shop" className="text-[10px] font-bold uppercase border-b-2 border-black pb-1 tracking-widest">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((p: any) => (
            <div key={p.id} className="group">
              <Link href={`/product/${p.id}`}>
                <div className="aspect-[3/4] bg-[#F3F0ED] mb-6 overflow-hidden relative shadow-sm">
                  <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={p.title} />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-tighter">-40%</div>
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#111111] mb-2 text-center">{p.title}</h4>
                <p className="text-center text-[#C5A059] font-serif font-bold text-lg italic">Rs. {p.price}</p>
              </Link>
              <button className="mt-6 w-full border border-[#111111] py-4 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#111111] hover:text-white transition-all duration-500">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}