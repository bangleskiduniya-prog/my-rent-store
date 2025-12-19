"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs, addDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Phone, ChevronRight, ShieldCheck, Truck, Share2, Plus, Minus, ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', city: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, "products", id as string));
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setProduct(data);
        const q = query(collection(db, "products"), where("category", "==", data.category), limit(5));
        const relSnap = await getDocs(q);
        setRelated(relSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== id));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        productTitle: product.title, price: product.price, quantity,
        variant: selectedVariant || 'Standard', customer, status: 'Pending', created_at: new Date()
      };
      await addDoc(collection(db, "orders"), orderData);
      const msg = `*NEW ORDER*%0A*Product:* ${product.title}%0A*Qty:* ${quantity}%0A*Customer:* ${customer.name}%0A*Phone:* ${customer.phone}%0A*Address:* ${customer.address}`;
      window.open(`https://wa.me/923035958676?text=${msg}`, '_blank');
      setOrderSuccess(true);
      setShowOrderForm(false);
    } catch (e) { alert("Error placing order"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center uppercase tracking-widest text-[10px]">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">
        <Link href="/">Home</Link> <ChevronRight className="w-3 h-3" /> <span>{product.category}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Swipe Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#f9f9f9] overflow-hidden relative group">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full">
              {product.images?.map((img: string, i: number) => (
                <div key={i} className="w-full h-full flex-shrink-0 snap-center">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {product.images?.map((img: string, i: number) => (
              <img key={i} src={img} onClick={() => setSelectedImage(i)} className={`w-20 h-24 object-cover cursor-pointer border-b-2 ${selectedImage === i ? 'border-black' : 'border-transparent'}`} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-serif font-bold mb-2 uppercase tracking-tight">{product.title}</h1>
          <p className="text-2xl font-serif text-[#bcac76] font-bold mb-6">Rs. {product.price}</p>
          
          <div className="border-y border-gray-100 py-6 mb-6">
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Variations */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4">Select Size / Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.variations?.map((v: any, i: number) => (
                <button key={i} onClick={() => setSelectedVariant(v.name)} className={`px-6 py-2 border text-[10px] font-bold uppercase tracking-widest ${selectedVariant === v.name ? 'bg-black text-white' : 'bg-white text-black border-gray-200'}`}>
                  {v.name} {Number(v.stock) <= 0 ? '(Sold Out)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Buttons */}
          <div className="space-y-4">
            <div className="flex items-center border border-gray-200 w-fit">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4"><Minus className="w-3 h-3" /></button>
              <span className="px-6 font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-4"><Plus className="w-3 h-3" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button onClick={() => alert("Added to Cart!")} className="border-2 border-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">Add to Cart</button>
              <button onClick={() => setShowOrderForm(true)} className="bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#bcac76] transition-all">Buy It Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <h3 className="text-xl font-serif mb-10 border-b pb-4">You May Also Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p) => (
            <Link href={`/product/${p.id}`} key={p.id} className="group">
              <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden"><img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all" /></div>
              <h4 className="text-[10px] font-bold uppercase text-center">{p.title}</h4>
              <p className="text-center text-[#bcac76] font-bold text-sm mt-1">Rs. {p.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative">
            <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4"><X /></button>
            <h2 className="text-xl font-serif font-bold mb-6">Shipping Details</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <input required placeholder="Full Name" className="w-full p-4 bg-gray-50 rounded-xl outline-none" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
              <input required placeholder="Phone Number" className="w-full p-4 bg-gray-50 rounded-xl outline-none" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
              <input required placeholder="Address" className="w-full p-4 bg-gray-50 rounded-xl outline-none" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} />
              <button type="submit" className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Confirm Order (COD)</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}