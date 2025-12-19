"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Phone, ChevronRight, ShieldCheck, Truck, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center uppercase tracking-[0.3em] text-xs">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  const handleWhatsAppOrder = () => {
    const message = `Hi, I want to order:
*Product:* ${product.title}
*Price:* Rs. ${product.price}
*Variant:* ${selectedVariant || 'Standard'}
*Link:* https://my-rent-store.vercel.app/product/${product.id}`;
    window.open(`https://wa.me/923035958676?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black font-bold">{product.title}</span>
        </div>
        <button onClick={handleShare} className="flex items-center gap-2 text-black font-bold"><Share2 className="w-3 h-3" /> Share</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-50 overflow-hidden rounded-3xl shadow-sm">
            <img src={product.images?.[selectedImage]} className="w-full h-full object-cover" alt={product.title} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images?.map((img: string, i: number) => (
              <div key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 ${selectedImage === i ? 'border-black' : 'border-transparent'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-serif font-bold text-black mb-4">{product.title}</h1>
          <p className="text-2xl font-serif text-gold mb-6 font-bold">Rs. {product.price}</p>
          <div className="border-t border-gray-100 py-8 mb-8">
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          </div>

          {product.variations && product.variations.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-gray-400">Select Size / Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.variations.map((v: any, i: number) => (
                  <button 
                    key={i}
                    disabled={Number(v.stock) <= 0}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-8 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all rounded-full ${Number(v.stock) <= 0 ? 'opacity-30 cursor-not-allowed' : ''} ${selectedVariant === v.name ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-black border-gray-200 hover:border-black'}`}
                  >
                    {v.name} {Number(v.stock) <= 0 ? '(Sold Out)' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl">
            <Phone className="w-4 h-4 fill-current" /> Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}