"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, ExternalLink, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif font-bold">Inventory Management</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-gold transition-all">
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Details</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
              <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-all">
                <td className="p-6 flex items-center gap-4">
                  <img src={p.images?.[0]} className="w-12 h-16 object-cover rounded-lg border" />
                  <span className="font-bold text-sm uppercase tracking-tight">{p.title}</span>
                </td>
                <td className="p-6 text-[10px] font-bold text-gray-400 uppercase">{p.category}</td>
                <td className="p-6 text-sm font-serif font-bold text-gold">Rs. {p.price}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/product/${p.id}`} target="_blank" className="p-2 text-gray-300 hover:text-black"><ExternalLink className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-200 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}