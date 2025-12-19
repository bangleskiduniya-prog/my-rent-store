"use client";

import { useEffect, useState } from "react";
import { 
  getProducts, 
  deleteProduct, 
  createProduct, 
  updateProduct, 
  Product 
} from "@/lib/db/products";
import { getCategories, Category } from "@/lib/db/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    categoryId: "",
    images: [],
    variations: {
      sizes: [],
      colors: [],
      fabrics: []
    },
    stock: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...currentProduct,
        price: Number(currentProduct.price),
        stock: Number(currentProduct.stock),
        createdAt: currentProduct.createdAt || Date.now()
      } as Product; // We assume required fields are present for simplicity or should validate

      if (currentProduct.id) {
        await updateProduct(currentProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      
      await fetchData();
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      await fetchData();
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      name: "",
      price: 0,
      description: "",
      categoryId: "",
      images: [],
      variations: {
        sizes: [],
        colors: [],
        fabrics: []
      },
      stock: 0
    });
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  if (loading && !products.length) return <div className="p-8"><Spinner /></div>;

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{currentProduct.id ? "Edit Product" : "Add Product"}</h1>
          <Button variant="ghost" onClick={() => { setIsEditing(false); resetForm(); }}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Product Name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  required
                />
                <Input
                  label="Price"
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={currentProduct.categoryId}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2 h-32"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Images</label>
                <ImageUpload
                  images={currentProduct.images || []}
                  onChange={(images) => setCurrentProduct({ ...currentProduct, images })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Sizes (comma separated)"
                  value={currentProduct.variations?.sizes?.join(", ")}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    variations: { ...currentProduct.variations!, sizes: e.target.value.split(",").map(s => s.trim()) } 
                  })}
                />
                 <Input
                  label="Colors (comma separated)"
                  value={currentProduct.variations?.colors?.join(", ")}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    variations: { ...currentProduct.variations!, colors: e.target.value.split(",").map(s => s.trim()) } 
                  })}
                />
                 <Input
                  label="Fabrics (comma separated)"
                  value={currentProduct.variations?.fabrics?.join(", ")}
                  onChange={(e) => setCurrentProduct({ 
                    ...currentProduct, 
                    variations: { ...currentProduct.variations!, fabrics: e.target.value.split(",").map(s => s.trim()) } 
                  })}
                />
              </div>

              <Input
                label="Stock"
                type="number"
                value={currentProduct.stock}
                onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
              />

              <Button type="submit" className="w-full" isLoading={loading}>
                Save Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{formatPrice(product.price)}</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
