"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { ShoppingBag, Menu } from 'lucide-react';

export default function Navbar() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetch = async () => {
      const sSnap = await getDoc(doc(db, "settings", "site_config"));
      if (sSnap.exists()) setSettings(sSnap.data());
    };
    fetch();
  }, []);

  return (
    <nav className="border-b border-gray-100 sticky top-0 bg-white z-[100] px-6 py-5 flex justify-between items-center">
      <Menu className="w-6 h-6 cursor-pointer" />
      <Link href="/">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt={settings.storeName} className="h-8 md:h-10 object-contain" />
        ) : (
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tighter uppercase">{settings.storeName || 'STORE'}</h1>
        )}
      </Link>
      <div className="flex items-center gap-5">
        <ShoppingBag className="w-5 h-5 cursor-pointer" />
      </div>
    </nav>
  );
}