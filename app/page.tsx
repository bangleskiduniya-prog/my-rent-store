"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Phone } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState<any>({ heroBanners: [] });

  useEffect(() => {
    const fetchData = async () => {
      const pSnap = await getDocs(query(collection(db, "products"), limit(8)));
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      if (sSnap.exists()) setSettings(sSnap.data());
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Slider (Dynamic) */}
      <section className="relative h-[70vh] md:h-[85vh] bg-gray-100 overflow-hidden">
        {settings.heroBanners?.length > 0 ? (
          <img src={settings.heroBanners[0]} className="w-full h-full object-cover animate-in fade-in duration-1000" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center italic text-gray-400">No Banner Uploaded</div>
        )}
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-white text-center px-4">
          <h2 className="text-5xl md:text-8xl font-serif mb-4 drop-shadow-2xl">New Collection</h2>
          <p className="tracking-[0.4em] uppercase text-xs mb-10 font-bold">Luxury Redefined</p>
          <button className="bg-white text-black px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#bcac76] hover:text-white transition-all shadow-2xl">Shop Now</button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-serif italic mb-12 border-b pb-6">Featured Arrivals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p: any) => (
            <Link href={`/product/${p.id}`} key={p.id} className="group">
              <div className="aspect-[3/4] bg-[#f9f9f9] mb-5 overflow-hidden relative shadow-sm">
                <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">{p.title}</h4>
              <p className="text-sm font-serif text-[#bcac76] font-bold italic">Rs. {p.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <a href={`https://wa.me/${settings.whatsapp}`} className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 whatsapp-pulse"><Phone /></a>
    </div>
  );
}