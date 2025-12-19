"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Category } from "@/lib/db/categories";

export function Navbar({ categories }: { categories: Category[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            MY RENT STORE
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Home
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/?category=${cat.name}`} 
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.name}`}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
