"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Package, Phone, MapPin, Clock } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-10">Customer Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer</p>
              <h4 className="font-bold text-sm">{order.customer.name}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {order.customer.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Product</p>
              <h4 className="font-bold text-sm truncate">{order.productTitle}</h4>
              <p className="text-xs text-gold font-bold">Rs. {order.price} x {order.quantity}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Shipping Address</p>
              <p className="text-xs text-gray-500 leading-relaxed flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5" /> {order.customer.address}, {order.customer.city}</p>
            </div>
            <div className="text-right">
               <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">{order.status}</span>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-center py-20 text-gray-400 italic">No orders yet.</p>}
      </div>
    </div>
  );
}