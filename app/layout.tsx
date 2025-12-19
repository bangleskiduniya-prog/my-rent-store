import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Professional Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Premium Fashion Store | Luxury Collection",
  description: "Discover our exclusive range of premium fabrics and jewelry. Quality that defines tradition.",
  openGraph: {
    title: "Premium Fashion Store",
    description: "Luxury Collection for Men, Women & Kids",
    images: ['/logo.png'], // Jab aap logo upload karenge toh ye ads mein kaam ayega
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-black antialiased">
        {/* Is layout mein humne fonts aur background set kar diya hai */}
        {children}
      </body>
    </html>
  );
}
