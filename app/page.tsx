import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getProducts, Product } from "@/lib/db/products";
import { getCategoryByName, getCategories } from "@/lib/db/categories";
import { formatPrice } from "@/lib/utils";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const categoryName = resolvedSearchParams?.category as string | undefined;
  
  let products: Product[] = [];

  if (categoryName) {
    const category = await getCategoryByName(categoryName);
    if (category && category.id) {
        products = await getProducts(category.id);
    } else {
        // Fallback or empty if category not found
        products = []; 
    }
  } else {
    products = await getProducts();
  }
  
  // Fetch categories for the Hero section buttons if needed, or just hardcode popular ones
  const allCategories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        {!categoryName && (
          <section className="relative h-[600px] w-full bg-gray-900 text-white">
            <div className="absolute inset-0 bg-black/50" />
            <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')" }}
            />
            <div className="relative container mx-auto flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gold-500">
                Premium Fashion Rentals
              </h1>
              <p className="mt-4 max-w-xl text-lg text-gray-300">
                Discover the latest trends in men&apos;s, women&apos;s, and kids&apos; fashion. 
                Rent your style today.
              </p>
              <div className="mt-8">
                 {/* Link to the first available category or just Shop All */}
                <Link href={allCategories.length > 0 ? `/?category=${allCategories[0].name}` : "/"}>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section (Only on Home) */}
        {!categoryName && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {allCategories.slice(0, 3).map((cat) => (
                  <Link href={`/?category=${cat.name}`} key={cat.id} className="group relative overflow-hidden rounded-lg aspect-[3/4]">
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                     <img 
                       src={`https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`} 
                       alt={cat.name}
                       className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                       <h3 className="text-3xl font-bold text-white uppercase tracking-widest">{cat.name}</h3>
                     </div>
                  </Link>
                ))}
                 {allCategories.length === 0 && (
                     <p className="text-center text-gray-500 col-span-3">No categories found. Add some in the Admin Panel.</p>
                 )}
              </div>
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">
              {categoryName ? `${categoryName}'s Collection` : "Featured Products"}
            </h2>
            
            {products.length === 0 ? (
               <p className="text-gray-500 text-center py-12">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group">
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 relative">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {!product.stock && (
                         <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                           Out of Stock
                         </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.description.substring(0, 30)}...</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
