import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Store | Loading...",
  description: "Luxury Collection",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        {/* Temporary: Navbar aur Footer hata diye hain debug karne ke liye */}
        <main>{children}</main>
      </body>
    </html>
  );
}