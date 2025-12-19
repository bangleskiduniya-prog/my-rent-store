"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, ListTree } from 'lucide-react';

export default function CategoriesPage() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await addDoc(collection(db, "categories"), { name, created_at: new Date() });
      setName('');
      fetchCategories();
    } catch (error) { alert("Error adding category"); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, "categories", id));
      fetchCategories();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-8">Manage Categories</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <form onSubmit={handleAdd} className="flex gap-4">
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="New Category Name (e.g. Jewellery)" 
            className="flex-1 p-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-1 ring-gold"
          />
          <button type="submit" className="bg-black text-white px-8 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <ListTree className="w-5 h-5 text-gold" />
              <span className="font-bold uppercase text-xs tracking-widest">{cat.name}</span>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 p-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}