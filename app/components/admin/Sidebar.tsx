"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut,
  Tags
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const links = [
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
