import { getProduct, getProducts } from "@/lib/db/products";
import { getSettings } from "@/lib/db/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/product/ImageGallery";
import ProductOptions from "@/components/product/ProductOptions";

// Use generateMetadata for dynamic SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | My Rent Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
      url: `https://my-rent-store.vercel.app/product/${id}`, // Replace with actual domain
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image Gallery */}
            <ImageGallery images={product.images} />

            {/* Product Info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
              
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">{formatPrice(product.price)}</p>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>

              <div className="mt-6">
                 <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-500">
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                    </span>
                 </div>
              </div>

              <div className="mt-8">
                <ProductOptions product={product} whatsappNumber={settings.whatsappNumber} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
