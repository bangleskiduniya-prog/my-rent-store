import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MY RENT STORE</h3>
            <p className="text-gray-400 text-sm">
              Premium fashion rentals for every occasion.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/?category=Men" className="hover:text-white">Men</Link></li>
              <li><Link href="/?category=Women" className="hover:text-white">Women</Link></li>
              <li><Link href="/?category=Kids" className="hover:text-white">Kids</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-400">
              Email: support@myrentstore.com<br />
              WhatsApp: 03035958676
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} My Rent Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
