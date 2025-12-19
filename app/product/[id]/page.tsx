"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Phone, ChevronRight, ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form State
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', city: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, "products", id as string));
      if (docSnap.exists()) setProduct({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        quantity,
        variant: selectedVariant || 'Standard',
        customer,
        status: 'Pending',
        created_at: new Date()
      };
      
      // 1. Save to Firebase
      await addDoc(collection(db, "orders"), orderData);
      
      // 2. Send to WhatsApp
      const message = `*NEW ORDER PLACED*%0A%0A*Customer:* ${customer.name}%0A*Phone:* ${customer.phone}%0A*Address:* ${customer.address}, ${customer.city}%0A%0A*Product:* ${product.title}%0A*Variant:* ${selectedVariant || 'N/A'}%0A*Quantity:* ${quantity}%0A*Total:* Rs. ${product.price * quantity}`;
      window.open(`https://wa.me/923035958676?text=${message}`, '_blank');
      
      setOrderSuccess(true);
      setShowForm(false);
    } catch (e) { alert("Order failed. Try again."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs">Loading...</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Product UI (Same as before but with Buy Now logic) */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-gray-50 rounded-3xl overflow-hidden">
          <img src={product.images?.[0]} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-serif font-bold mb-4 uppercase">{product.title}</h1>
          <p className="text-2xl text-gold font-bold mb-8 text-[#D4AF37]">Rs. {product.price}</p>
          
          <div className="flex gap-4 mb-10">
            <button onClick={() => setShowForm(true)} className="flex-1 bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all">Buy It Now</button>
            <button onClick={() => window.open(`https://wa.me/923035958676`, '_blank')} className="p-5 border border-gray-200 rounded-full hover:bg-gray-50"><Phone className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-serif font-bold mb-2">Complete Your Order</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-8">Cash on Delivery</p>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <input required placeholder="Full Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-1 ring-black" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
              <input required placeholder="Phone Number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-1 ring-black" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
              <input required placeholder="Complete Address" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-1 ring-black" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} />
              <input required placeholder="City" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-1 ring-black" value={customer.city} onChange={e => setCustomer({...customer, city: e.target.value})} />
              <button type="submit" className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg">Confirm Order</button>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center text-center p-6">
          <CheckCircle2 className="w-20 h-20 text-[#25D366] mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-8">Thank you for shopping. We will contact you soon.</p>
          <Link href="/" className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest">Back to Home</Link>
        </div>
      )}
    </div>
  );
}