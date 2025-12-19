"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Upload, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: '', whatsapp: '', footerText: '',
    // Grid Categories Data
    grid1: { title: 'Women', img: '' },
    grid2: { title: 'Boys', img: '' },
    grid3: { title: 'Girls', img: '' },
    grid4: { title: 'Men', img: '' }
  });
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "settings", "site_config"));
      if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() }));
    };
    fetch();
  }, []);

  const handleUpload = async (e: any, key: string) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(key);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'My-rent-store');

    const res = await fetch('https://api.cloudinary.com/v1_1/dec141lqk/image/upload', { method: 'POST', body: formData });
    const data = await res.json();
    
    if (key === 'grid1') setSettings({ ...settings, grid1: { ...settings.grid1, img: data.secure_url } });
    if (key === 'grid2') setSettings({ ...settings, grid2: { ...settings.grid2, img: data.secure_url } });
    if (key === 'grid3') setSettings({ ...settings, grid3: { ...settings.grid3, img: data.secure_url } });
    if (key === 'grid4') setSettings({ ...settings, grid4: { ...settings.grid4, img: data.secure_url } });
    setUploading('');
  };

  const save = async () => {
    await setDoc(doc(db, "settings", "site_config"), settings);
    alert("Store Updated Successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold uppercase tracking-tighter">Store Customization</h1>
        <button onClick={save} className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#bcac76]">Save All Changes</button>
      </div>

      {/* Basic Info */}
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="p-4 bg-gray-50 rounded-2xl outline-none" placeholder="Store Name" />
        <input value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="p-4 bg-gray-50 rounded-2xl outline-none" placeholder="WhatsApp (92303...)" />
      </div>

      {/* Grid Categories Control */}
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-[#bcac76]">Home Page Category Grid (1-2-1 Layout)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['grid1', 'grid2', 'grid3', 'grid4'].map((key: any) => (
            <div key={key} className="space-y-4 p-4 border rounded-2xl bg-gray-50">
              <p className="text-[10px] font-bold uppercase text-gray-400">{key.toUpperCase()}</p>
              <input 
                value={(settings as any)[key].title} 
                onChange={e => setSettings({...settings, [key]: { ...(settings as any)[key], title: e.target.value }})}
                className="w-full p-2 text-xs border-b bg-transparent outline-none" 
                placeholder="Category Name" 
              />
              <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden border relative">
                {(settings as any)[key].img && <img src={(settings as any)[key].img} className="w-full h-full object-cover" />}
                <label className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 cursor-pointer transition-all">
                  <Upload className="text-white" />
                  <input type="file" className="hidden" onChange={e => handleUpload(e, key)} />
                </label>
              </div>
              {uploading === key && <p className="text-[8px] animate-pulse text-center">Uploading...</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}