"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Upload, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch Categories for Dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) { console.error("Error fetching categories"); }
    };
    fetchCats();
  }, []);

  // Cloudinary Upload
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    setUploading(true);
    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'My-rent-store'); // Aapka preset name

      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dec141lqk/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      } catch (err) { console.error("Upload failed"); }
    }

    setImages([...images, ...uploadedUrls]);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title || !price || images.length === 0) return alert("Please fill Title, Price and add at least one Image.");
    
    try {
      // 🔥 STOCK FIX: Convert stock to Number so it doesn't show 'Out of Stock'
      const fixedVariations = variations.map(v => ({
        name: v.name,
        stock: Number(v.stock) || 0
      }));

      await addDoc(collection(db, "products"), {
        title,
        description,
        price: Number(price),
        discounted_price: discountedPrice ? Number(discountedPrice) : null,
        category,
        images,
        variations: fixedVariations,
        created_at: new Date()
      });

      alert("Product Published Successfully!");
      window.location.href = '/admin/products'; // Redirect back to list
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error saving product.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-serif font-bold">Add New Product</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-serif w-full border-b border-gray-100 py-4 focus:outline-none focus:border-black" placeholder="Product Title..." />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-40 p-6 bg-gray-50 rounded-[1.5rem] text-sm focus:outline-none" placeholder="Describe the fabric, quality, and style..." />
          </div>

          {/* Variations & Stock */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Variants (Size/Color)</h3>
              <button onClick={() => setVariations([...variations, { name: '', stock: '' }])} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            <div className="space-y-3">
              {variations.map((v, i) => (
                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-top-2">
                  <input placeholder="Name (e.g. Large)" className="flex-1 p-4 bg-gray-50 rounded-xl text-sm focus:ring-1 ring-black outline-none" value={v.name} onChange={(e) => {
                    const newV = [...variations]; newV[i].name = e.target.value; setVariations(newV);
                  }} />
                  <input placeholder="Stock" type="number" className="w-24 p-4 bg-gray-50 rounded-xl text-sm focus:ring-1 ring-black outline-none" value={v.stock} onChange={(e) => {
                    const newV = [...variations]; newV[i].stock = e.target.value; setVariations(newV);
                  }} />
                  <button onClick={() => setVariations(variations.filter((_, idx) => idx !== i))} className="p-4 text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pricing & Category */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Price (Rs.)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl mt-2 outline-none focus:ring-1 ring-black" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl mt-2 uppercase text-xs font-bold tracking-tighter outline-none focus:ring-1 ring-black">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-gray-400">Gallery</h3>
            <div className="grid grid-cols-2 gap-3">
              {images.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border relative group">
                  <img src={url} className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                <Upload className="w-6 h-6 text-gray-300" />
                <span className="text-[8px] font-bold uppercase mt-2 text-gray-400">{uploading ? 'Uploading...' : 'Add Photo'}</span>
                <input type="file" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-xl flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}