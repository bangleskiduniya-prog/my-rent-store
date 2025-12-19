"use client";

import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory, Category } from "@/lib/db/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAdding(true);
    try {
      await createCategory(newCategory);
      setNewCategory("");
      await fetchData();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      await fetchData();
    }
  };

  if (loading) return <div className="p-8"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Categories</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleAdd} className="flex gap-4">
            <Input
              placeholder="New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
            <Button type="submit" isLoading={adding}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex items-center justify-between p-4">
              <span className="font-medium">{category.name}</span>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(category.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
