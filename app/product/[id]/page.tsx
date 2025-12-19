"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Phone, ChevronRight, ShieldCheck, Truck, Share2, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.id ? { id: docSnap.id, ...docSnap.data() } : null;
        setProduct(data);
        
        // Fetch Related Products
        const q = query(collection(db, "products"), where("category", "==", docSnap.data().category), limit(4));
        const relSnap = await getDocs(q);
        setRelated(relSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== id));
      }
      setLoading(false);
    };
    fetchProductData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center uppercase tracking-[0.3em] text-[10px] animate-pulse">Loading Masterpiece...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-serif">Product not found.</div>;

  const handleWhatsAppOrder = () => {
    const message = `*NEW ORDER FROM WEBSITE*%0A%0A*Product:* ${product.title}%0A*Price:* Rs. ${product.price}%0A*Quantity:* ${quantity}%0A*Variant:* ${selectedVariant || 'Standard'}%0A*Link:* https://my-rent-store.vercel.app/product/${product.id}`;
    window.open(`https://wa.me/923035958676?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-400">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black font-bold">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Swipeable Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#fcfcfc] overflow-hidden rounded-sm relative group">
             {/* Main Image with Touch Swipe Support (CSS Scroll Snap) */}
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full">
              {product.images?.map((img: string, i: number) => (
                <div key={i} className="w-full h-full flex-shrink-0 snap-center">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button className="bg-white p-3 rounded-full shadow-sm hover:bg-black hover:text-white transition-all"><Heart className="w-4 h-4" /></button>
                <button onClick={() => navigator.share({url: window.location.href})} className="bg-white p-3 rounded-full shadow-sm hover:bg-black hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
            {product.images?.map((img: string, i: number) => (
              <div key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-24 flex-shrink-0 cursor-pointer border-b-2 transition-all ${selectedImage === i ? 'border-black opacity-100' : 'border-transparent opacity-50'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col pt-4">
          <h1 className="text-2xl md:text-4xl font-serif font-medium text-black tracking-tight leading-tight mb-4 uppercase">{product.title}</h1>
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-3xl font-serif text-[#D4AF37] font-bold text-gold">Rs. {product.price}</span>
            {product.discounted_price && (
              <span className="text-lg text-gray-300 line-through italic font-light">Rs. {product.discounted_price}</span>
            )}
          </div>

          <div className="border-t border-gray-100 py-8 mb-4">
            <p className="text-gray-500 text-sm leading-relaxed tracking-wide">{product.description}</p>
          </div>

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5 text-gray-400">Select Variation</h3>
              <div className="flex flex-wrap gap-3">
                {product.variations.map((v: any, i: number) => (
                  <button 
                    key={i}
                    disabled={Number(v.stock) <= 0}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-8 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all ${Number(v.stock) <= 0 ? 'opacity-20 cursor-not-allowed' : ''} ${selectedVariant === v.name ? 'bg-black text-white border-black shadow-xl' : 'bg-white text-black border-gray-200 hover:border-black'}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center border border-gray-200 w-fit rounded-sm">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
              <span className="px-8 font-bold text-sm">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <button className="border-2 border-black py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button onClick={handleWhatsAppOrder} className="bg-[#25D366] text-white py-5 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg">
                <Phone className="w-4 h-4 fill-current" /> Order via WhatsApp
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-gray-50 grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Truck className="w-5 h-5 mx-auto text-gray-300" />
              <p className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Worldwide Shipping</p>
            </div>
            <div className="text-center space-y-2 border-x border-gray-50">
              <ShieldCheck className="w-5 h-5 mx-auto text-gray-300" />
              <p className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">100% Authentic</p>
            </div>
            <div className="text-center space-y-2">
              <Phone className="w-5 h-5 mx-auto text-gray-300" />
              <p className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-32">
          <h3 className="text-2xl font-serif mb-12 text-center italic">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group">
                <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden relative">
                  <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-center">{p.title}</h4>
                <p className="text-center text-gold font-serif mt-1">Rs. {p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}