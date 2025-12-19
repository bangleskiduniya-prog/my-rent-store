"use client";

import { useState } from "react";
import { Product } from "@/lib/db/products";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";

export default function ProductOptions({ product, whatsappNumber }: { product: Product, whatsappNumber: string }) {
  const [selectedSize, setSelectedSize] = useState(product.variations?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.variations?.colors?.[0] || "");
  const [selectedFabric, setSelectedFabric] = useState(product.variations?.fabrics?.[0] || "");

  const handleWhatsAppOrder = () => {
    const message = `Hi, I want to order ${product.name}. 
Size: ${selectedSize || "N/A"}
Color: ${selectedColor || "N/A"}
Fabric: ${selectedFabric || "N/A"}
Price: ${product.price}
Link: ${window.location.href}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Sizes */}
      {product.variations?.sizes?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <div className="mt-2 flex items-center space-x-3">
             {product.variations.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`
                    flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none
                    ${selectedSize === size 
                        ? 'bg-black text-white border-transparent hover:bg-gray-800' 
                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
             ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.variations?.colors?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Color</h3>
          <div className="mt-2 flex items-center space-x-3">
             {product.variations.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`
                    flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none
                    ${selectedColor === color 
                        ? 'bg-black text-white border-transparent hover:bg-gray-800' 
                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
             ))}
          </div>
        </div>
      )}

      {/* Fabrics */}
       {product.variations?.fabrics?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Fabric</h3>
           <div className="mt-2 flex items-center space-x-3">
             {product.variations.fabrics.map((fabric) => (
                <button
                  key={fabric}
                  type="button"
                  className={`
                    flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none
                    ${selectedFabric === fabric 
                        ? 'bg-black text-white border-transparent hover:bg-gray-800' 
                        : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSelectedFabric(fabric)}
                >
                  {fabric}
                </button>
             ))}
          </div>
        </div>
      )}

      <Button 
        className="w-full h-12 text-lg gap-2 bg-green-600 hover:bg-green-700" 
        onClick={handleWhatsAppOrder}
        disabled={product.stock <= 0}
      >
        <MessageCircle className="h-5 w-5" />
        {product.stock > 0 ? "Buy on WhatsApp" : "Out of Stock"}
      </Button>
    </div>
  );
}
