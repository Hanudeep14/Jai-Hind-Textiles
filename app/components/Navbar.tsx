"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  
  // Hide Navbar on Admin pages so it doesn't conflict with Admin layouts
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-[#1A1A2E]/10 bg-white/80 px-4 py-4 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#FF6B00]">
            Jaihind Textiles
          </Link>
          <div className="hidden items-center gap-4 text-sm font-medium text-[#1A1A2E]/80 md:flex">
            <Link href="/products" className="hover:text-[#FF6B00] transition-colors">Products</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/cart" className="flex items-center gap-1 hover:text-[#FF6B00] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span className="hidden md:inline">Cart</span>
          </Link>
          <Link href="/orders" className="flex items-center gap-1 hover:text-[#FF6B00] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
            <span className="hidden md:inline">Orders</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-1 hover:text-[#FF6B00] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="hidden md:inline">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
