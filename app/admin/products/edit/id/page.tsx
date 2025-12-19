"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const docSnap = await getDoc(doc(db, "products", id as string));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title); setPrice(data.price); setDescription(data.description);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    await updateDoc(doc(db, "products", id as string), { title, price: Number(price), description });
    alert("Updated!");
    window.location.href = '/admin/products';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/products" className="flex items-center gap-2 text-xs font-bold mb-6 uppercase tracking-widest text-gray-400"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <h1 className="text-3xl font-serif font-bold mb-10">Edit Product</h1>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none" placeholder="Title" />
        <input value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none" placeholder="Price" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full h-40 p-4 bg-gray-50 rounded-xl outline-none" placeholder="Description" />
        <button onClick={handleUpdate} className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Update Product</button>
      </div>
    </div>
  );
}