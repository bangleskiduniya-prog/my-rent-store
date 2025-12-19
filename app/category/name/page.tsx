"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const q = query(collection(db, "products"), where("category", "==", name));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchCategoryProducts();
  }, [name]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">
          <Link href="/">Home</Link> <ChevronRight className="w-3 h-3" /> <span className="text-black font-bold">{name}</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-12 uppercase tracking-tighter">{name} Collection</h1>

        {loading ? (
          <div className="py-20 text-center text-xs tracking-widest uppercase animate-pulse">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {products.length === 0 && <p className="col-span-full text-center py-20 text-gray-400 italic">No products found in this category.</p>}
            {products.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group">
                <div className="aspect-[3/4] bg-[#f9f9f9] mb-4 overflow-hidden relative">
                  <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-800">{p.title}</h4>
                <p className="text-sm font-serif mt-1 text-[#bcac76] font-bold">Rs. {p.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}