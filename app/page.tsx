"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Phone, Menu } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), limit(8));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(docs);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Top Bar */}
      <div className="bg-black text-white text-[10px] py-2 text-center tracking-[0.2em] uppercase font-bold">
        Free Shipping on Orders Above Rs. 5000
      </div>

      {/* Navigation (Admin Button Removed) */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Menu className="w-5 h-5 md:hidden" />
          <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Link href="/" className="hover:text-gray-500 transition-colors">Home</Link>
            <Link href="/category/women" className="hover:text-gray-500 transition-colors">Women</Link>
            <Link href="/category/men" className="hover:text-gray-500 transition-colors">Men</Link>
            <Link href="/category/kids" className="hover:text-gray-500 transition-colors">Kids</Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-black">MY PREMIUM STORE</h1>
          <div className="flex gap-5 items-center">
            <ShoppingBag className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-[60vh] md:h-[85vh] bg-gray-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" 
          className="w-full h-full object-cover"
          alt="Hero Banner"
        />
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-white text-5xl md:text-8xl font-serif mb-6 drop-shadow-2xl">Luxury Collection</h2>
          <p className="text-white text-xs md:text-sm tracking-[0.4em] uppercase mb-10 font-light">Tradition Meets Modernity</p>
          <button className="bg-white text-black px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 shadow-xl">
            Explore Now
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <h3 className="text-3xl font-serif italic">New Arrivals</h3>
          <Link href="/shop" className="text-[10px] font-bold border-b-2 border-black pb-1 uppercase tracking-widest">View All</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 tracking-[0.3em] uppercase text-[10px]">Loading Collection...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {products.length === 0 && <p className="col-span-full text-center text-gray-400 py-10 italic">No products found.</p>}
            {products.map((product: any) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group">
                <div className="aspect-[3/4] bg-gray-50 mb-5 overflow-hidden relative shadow-sm">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/400x600'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    alt={product.title}
                  />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-900 mb-1">{product.title}</h4>
                <p className="text-sm font-serif text-gray-600 italic">Rs. {product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/923035958676" 
        target="_blank" 
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-[100] hover:scale-110 transition-all duration-300"
      >
        <Phone className="w-6 h-6 fill-current" />
      </a>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h4 className="font-serif text-3xl mb-4 tracking-tighter">MY PREMIUM STORE</h4>
          <p className="text-gray-400 text-[10px] tracking-[0.5em] uppercase mb-12 font-bold">Tradition & Style</p>
          <div className="text-[9px] text-gray-300 uppercase tracking-[0.4em] font-medium">
            © 2025 My Premium Store. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
