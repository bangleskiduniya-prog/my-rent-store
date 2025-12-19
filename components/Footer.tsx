"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      if (sSnap.exists()) setSettings(sSnap.data());
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h4 className="font-serif text-3xl mb-4 tracking-tighter uppercase">
          {settings.storeName || 'PREMIUM STORE'}
        </h4>
        <p className="text-gray-400 text-[10px] tracking-[0.5em] uppercase mb-12 font-bold">
          {settings.footerText || 'Tradition Meets Modernity'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left border-y border-gray-50 py-10">
            <div>
                <h5 className="text-[10px] font-bold uppercase mb-4 tracking-widest">Customer Care</h5>
                <ul className="text-xs text-gray-500 space-y-2 uppercase tracking-tighter">
                    <li>Shipping & Returns</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                </ul>
            </div>
            <div>
                <h5 className="text-[10px] font-bold uppercase mb-4 tracking-widest">Contact</h5>
                <p className="text-xs text-gray-500 uppercase tracking-tighter">
                    WhatsApp: {settings.whatsapp}<br/>
                    Email: {settings.email || 'info@store.com'}
                </p>
            </div>
            <div className="md:text-right">
                <h5 className="text-[10px] font-bold uppercase mb-4 tracking-widest">Follow Us</h5>
                <div className="flex md:justify-end gap-4 text-xs text-gray-500 uppercase tracking-tighter">
                    <span>Instagram</span>
                    <span>Facebook</span>
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <div className="text-[9px] text-gray-300 uppercase tracking-[0.4em]">
              © 2025 {settings.storeName}. All Rights Reserved.
            </div>
            <div className="text-[9px] text-[#bcac76] font-bold uppercase tracking-[0.2em] pt-4">
              Website rent ya apni banwaye: creativejunaid0012@gmail.com
            </div>
        </div>
      </div>
    </footer>
  );
}