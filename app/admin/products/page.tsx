"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Upload, Plus, Trash2 } from 'lucide-react';

export default function AddProductPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Cloudinary Upload Function
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    setUploading(true);
    const uploadedUrls = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'My-rent-store'); // Aapka preset name

      const res = await fetch('https://api.cloudinary.com/v1_1/dec141lqk/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      uploadedUrls.push(data.secure_url);
    }

    setImages([...images, ...uploadedUrls]);
    setUploading(false);
  };

  const handleSaveProduct = async () => {
    if (!title || !price || images.length === 0) return alert("Please fill all fields");
    
    try {
      await addDoc(collection(db, "products"), {
        title,
        price: Number(price),
        category,
        images,
        created_at: new Date()
      });
      alert("Product Added Successfully!");
      setTitle(''); setPrice(''); setImages([]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Add New Product</h1>
      
      <div className="bg-white p-8 shadow-sm border border-gray-100 rounded-2xl space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Product Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black" placeholder="e.g. Luxury Lawn Suit" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Price (Rs.)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black" placeholder="5000" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black">
              <option value="">Select Category</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Product Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                <img src={url} className="w-full h-full object-cover" />
                <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{uploading ? '...' : 'Upload'}</span>
              <input type="file" multiple onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <button onClick={handleSaveProduct} className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-all">
          Create Product
        </button>
      </div>
    </div>
  );
}
