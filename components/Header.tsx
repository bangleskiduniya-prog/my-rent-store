import { Navbar } from "@/components/layout/Navbar";
import { getCategories } from "@/lib/db/categories";

export async function Header() {
  const categories = await getCategories();
  return <Navbar categories={categories} />;
}
