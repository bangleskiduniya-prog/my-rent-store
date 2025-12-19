"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsList() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif font-bold">Inventory</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Add Product</Link>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400">Product</th>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400">Price</th>
              <th className="p-6 text-[10px] font-bold uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-6 flex items-center gap-4">
                  <img src={p.images?.[0]} className="w-12 h-16 object-cover rounded-lg" />
                  <span className="font-bold text-sm uppercase">{p.title}</span>
                </td>
                <td className="p-6 text-sm font-serif font-bold text-[#bcac76]">Rs. {p.price}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/edit/${p.id}`} className="p-2 text-blue-400 hover:text-blue-600"><Edit className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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