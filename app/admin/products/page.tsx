"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Upload, Plus, Trash2, Save, Package } from 'lucide-react';

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

  useEffect(() => {
    const fetchCats = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCats();
  }, []);

  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    setUploading(true);
    const uploadedUrls = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'My-rent-store');
      const res = await fetch('https://api.cloudinary.com/v1_1/dec141lqk/image/upload', { method: 'POST', body: formData });
      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }
    setImages([...images, ...uploadedUrls]);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title || !price || images.length === 0) return alert("Fill Title, Price and Images");
    try {
      await addDoc(collection(db, "products"), {
        title, description, price: Number(price), discounted_price: Number(discountedPrice),
        category, images, variations, created_at: new Date()
      });
      alert("Product Published!");
      window.location.href = '/admin';
    } catch (e) { alert("Error saving product"); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif font-bold">New Product</h1>
        <button onClick={handleSave} className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl">
          <Save className="w-4 h-4" /> Publish to Store
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-serif w-full border-b border-gray-100 py-4 focus:outline-none focus:border-gold" placeholder="Product Title..." />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-40 p-6 bg-gray-50 rounded-[1.5rem] text-sm focus:outline-none" placeholder="Product Description..." />
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-gold">Product Variations</h3>
            <button onClick={() => setVariations([...variations, { name: '', stock: '' }])} className="text-xs font-bold flex items-center gap-2 mb-4 text-gray-400 hover:text-black">
              <Plus className="w-4 h-4" /> Add Size or Color
            </button>
            {variations.map((v, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <input placeholder="Name (e.g. Large)" className="flex-1 p-4 bg-gray-50 rounded-xl text-sm" value={v.name} onChange={(e) => {
                  const newV = [...variations]; newV[i].name = e.target.value; setVariations(newV);
                }} />
                <input placeholder="Stock" type="number" className="w-24 p-4 bg-gray-50 rounded-xl text-sm" value={v.stock} onChange={(e) => {
                  const newV = [...variations]; newV[i].stock = e.target.value; setVariations(newV);
                }} />
                <button onClick={() => setVariations(variations.filter((_, idx) => idx !== i))} className="p-4 text-red-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Price (Rs.)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl mt-2" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl mt-2 uppercase text-xs font-bold tracking-tighter">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-gold">Gallery</h3>
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
        </div>
      </div>
    </div>
  );
}