"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-widest">Add some premium items to get started</p>
        <Link href="/" className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-serif font-bold mb-12 text-center uppercase tracking-tighter">Your Shopping Bag</h1>
      <div className="space-y-8">
        {cart.map((item, i) => (
          <div key={i} className="flex items-center gap-6 border-b border-gray-100 pb-8">
            <img src={item.image} className="w-24 h-32 object-cover rounded-xl" />
            <div className="flex-1">
              <h3 className="font-bold uppercase text-sm tracking-tight">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{item.variant}</p>
              <p className="text-[#bcac76] font-serif font-bold mt-2">Rs. {item.price} x {item.quantity}</p>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
      <div className="mt-12 bg-gray-50 p-10 rounded-[2.5rem] text-center">
        <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mb-2">Total Amount</p>
        <h2 className="text-4xl font-serif font-bold mb-8 text-black">Rs. {total}</h2>
        <Link href={`/product/${cart[0]?.id}`} className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#bcac76] transition-all flex items-center justify-center gap-3 mx-auto w-fit shadow-xl">
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}