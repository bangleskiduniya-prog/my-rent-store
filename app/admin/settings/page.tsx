"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Upload, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: '', whatsapp: '', footerText: '', logoUrl: '',
    heroBanners: [] as string[]
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "settings", "site_config"));
      if (snap.exists()) setSettings(snap.data() as any);
    };
    fetch();
  }, []);

  const handleUpload = async (e: any, type: 'logo' | 'banner') => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'My-rent-store');

    const res = await fetch('https://api.cloudinary.com/v1_1/dec141lqk/image/upload', { method: 'POST', body: formData });
    const data = await res.json();
    
    if (type === 'logo') setSettings({ ...settings, logoUrl: data.secure_url });
    else setSettings({ ...settings, heroBanners: [...settings.heroBanners, data.secure_url] });
    setUploading(false);
  };

  const save = async () => {
    await setDoc(doc(db, "settings", "site_config"), settings);
    alert("Store Branding Updated!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold">Store Branding</h1>
        <button onClick={save} className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#bcac76]">Save Settings</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Logo & Name */}
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
          <h3 className="text-[10px] font-bold uppercase text-gold">Identity</h3>
          <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="Store Name" />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border">
              {settings.logoUrl && <img src={settings.logoUrl} className="w-full h-full object-contain" />}
            </div>
            <label className="text-xs font-bold cursor-pointer bg-gray-100 px-4 py-2 rounded-lg">
              {uploading ? '...' : 'Upload Logo'}
              <input type="file" className="hidden" onChange={e => handleUpload(e, 'logo')} />
            </label>
          </div>
        </div>

        {/* WhatsApp & Footer */}
        <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
          <h3 className="text-[10px] font-bold uppercase text-gold">Contact</h3>
          <input value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="WhatsApp (e.g. 92303...)" />
          <textarea value={settings.footerText} onChange={e => setSettings({...settings, footerText: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none h-24" placeholder="Footer Text" />
        </div>
      </div>

      {/* Hero Banners */}
      <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
        <h3 className="text-[10px] font-bold uppercase text-gold mb-6">Home Page Banners</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {settings.heroBanners?.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border">
              <img src={url} className="w-full h-full object-cover" />
              <button onClick={() => setSettings({...settings, heroBanners: settings.heroBanners.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          <label className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <Upload className="w-6 h-6 text-gray-300" />
            <input type="file" className="hidden" onChange={e => handleUpload(e, 'banner')} />
          </label>
        </div>
      </div>
    </div>
  );
}