"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Phone, Menu, X } from 'lucide-react';

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
      <div className="bg-black text-white text-[10px] py-2 text-center tracking-[0.2em] uppercase">
        Free Shipping on Orders Above Rs. 5000
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Menu className="w-6 h-6 md:hidden" />
          <div className="hidden md:flex gap-6 text-[11px] font-bold tracking-widest uppercase">
            <Link href="/">Home</Link>
            <Link href="/category/women">Women</Link>
            <Link href="/category/men">Men</Link>
            <Link href="/category/kids">Kids</Link>
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tighter">MY PREMIUM STORE</h1>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="text-[10px] border border-black px-2 py-1 uppercase font-bold">Admin</Link>
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-[60vh] md:h-[80vh] bg-gray-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=2000" 
          className="w-full h-full object-cover opacity-90"
          alt="Hero Banner"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-white text-4xl md:text-7xl font-serif mb-4 drop-shadow-lg">Luxury Collection</h2>
          <p className="text-white text-sm md:text-lg tracking-widest uppercase mb-8 drop-shadow-md">Tradition Meets Modernity</p>
          <button className="bg-white text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-center text-2xl font-serif mb-12">Shop By Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Women', 'Men', 'Kids'].map((cat) => (
            <div key={cat} className="relative h-80 group overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-10" />
              <img src={`https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800`} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-white text-2xl font-serif border-b-2 border-white pb-1">{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-50">
        <div className="flex justify-between items-end mb-10">
          <h3 className="text-3xl font-serif">New Arrivals</h3>
          <Link href="/shop" className="text-xs font-bold border-b border-black pb-1 uppercase">View All</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 tracking-widest uppercase text-xs">Loading Collection...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {products.length === 0 && <p className="col-span-full text-center text-gray-400 py-10">No products found. Visit Admin to add some!</p>}
            {products.map((product: any) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group">
                <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden relative">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/400x600'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    alt={product.title}
                  />
                  <button className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-[10px] font-bold uppercase translate-y-full group-hover:translate-y-0 transition-all">
                    Quick Add
                  </button>
                </div>
                <h4 className="text-[11px] font-bold uppercase tracking-tight text-gray-800">{product.title}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-bold">Rs. {product.price}</span>
                  {product.discounted_price && (
                    <span className="text-xs text-gray-400 line-through">Rs. {product.discounted_price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/923035958676" 
        target="_blank" 
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-[100] hover:scale-110 transition-all"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* Footer */}
      <footer className="bg-[#f9f9f9] border-t border-gray-100 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-serif text-2xl mb-4">MY PREMIUM STORE</h4>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              We believe that fabric is more than just material – it’s an expression of style, tradition, and comfort.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Customer Support</h5>
            <ul className="text-gray-500 text-xs space-y-4 uppercase tracking-tighter">
              <li>Shipping Policy</li>
              <li>Refund & Return Policy</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Contact Info</h5>
            <p className="text-gray-500 text-xs leading-loose">
              WhatsApp: +92 303 5958676<br />
              Email: info@mypremiumstore.com
            </p>
          </div>
        </div>
        <div className="text-center border-t border-gray-200 pt-8 text-[10px] text-gray-400 uppercase tracking-[0.3em]">
          © 2025 My Premium Store. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
