"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snap = await getDocs(collection(db, "products"));
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = all.filter((p: any) => 
        p.title?.toLowerCase().includes(query) || 
        p.category?.toLowerCase().includes(query)
      );
      setResults(filtered);
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-2xl font-serif mb-10 uppercase tracking-widest text-black">Results for: "{query}"</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {results.map((p) => (
          <Link href={`/product/${p.id}`} key={p.id} className="group">
            <div className="aspect-[3/4] bg-[#f9f9f9] mb-4 overflow-hidden">
              <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
            </div>
            <h4 className="text-[10px] font-bold uppercase text-center">{p.title}</h4>
            <p className="text-center text-[#bcac76] font-bold mt-1">Rs. {p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center uppercase text-[10px]">Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}