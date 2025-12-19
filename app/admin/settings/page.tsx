"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Globe, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'My Premium Store',
    whatsapp: '923035958676',
    email: 'info@store.com',
    footerText: 'Tradition Meets Modernity',
    instagram: '',
    facebook: '',
    logoUrl: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "settings", "site_config");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setSettings(docSnap.data() as any);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "settings", "site_config"), settings);
      alert("Settings Updated Successfully!");
    } catch (error) {
      alert("Error saving settings.");
    }
  };

  if (loading) return <div className="p-10 uppercase text-xs tracking-widest">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif font-bold">Store Configuration</h1>
        <button onClick={handleSave} className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase text-gold mb-4">General Info</h3>
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">Store Name</label>
            <input value={settings.storeName} onChange={(e) => setSettings({...settings, storeName: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl mt-1 focus:outline-none focus:ring-1 ring-gold" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">WhatsApp Number (with country code)</label>
            <input value={settings.whatsapp} onChange={(e) => setSettings({...settings, whatsapp: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl mt-1" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-[10px] font-bold uppercase text-gold mb-4">Social Links</h3>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <Instagram className="w-4 h-4 text-gray-400" />
            <input placeholder="Instagram URL" value={settings.instagram} onChange={(e) => setSettings({...settings, instagram: e.target.value})} className="bg-transparent w-full text-sm focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <Facebook className="w-4 h-4 text-gray-400" />
            <input placeholder="Facebook URL" value={settings.facebook} onChange={(e) => setSettings({...settings, facebook: e.target.value})} className="bg-transparent w-full text-sm focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="mt-10 bg-black text-white p-10 rounded-[2rem] text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Developer Credit</p>
        <p className="text-sm font-serif italic">Website rent ya apni banwaye</p>
        <p className="text-gold text-xs mt-2">creativejunaid0012@gmail.com</p>
      </div>
    </div>
  );
}