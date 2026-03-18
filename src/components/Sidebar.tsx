"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname(); // Untuk mengecek URL saat ini

  // Jika user belum login (berada di halaman login/register), sembunyikan Sidebar
  if (!user) return null;

  // Sembunyikan sidebar di halaman login dan register
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <aside className="w-64 bg-[#5a4633] text-white h-screen flex flex-col shadow-lg flex-shrink-0">
      {/* Header Sidebar */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-[#f2e7d4]">Book Catalog</h2>
        <p className="text-sm text-[#c7ad84] mt-2">Halo, {user.name}!</p>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          href="/"
          className={`block px-4 py-2.5 rounded-md transition font-medium ${pathname === "/" ? "bg-[#f2e7d4] text-[#2e2a24]" : "text-[#f2e7d4] hover:bg-[#c7ad84]"}`}
        >
          Dashboard
        </Link>
        <Link
          href="/books"
          className={`block px-4 py-2.5 rounded-md transition font-medium ${pathname.startsWith("/books") ? "bg-[#f2e7d4] text-[#2e2a24]" : "text-[#f2e7d4] hover:bg-[#c7ad84]"}`}
        >
          Books
        </Link>
        <Link
          href="/authors"
          className={`block px-4 py-2.5 rounded-md transition font-medium ${pathname.startsWith("/authors") ? "bg-[#f2e7d4] text-[#2e2a24]" : "text-[#f2e7d4] hover:bg-[#c7ad84]"}`}
        >
          Authors
        </Link>
        <Link
          href="/publishers"
          className={`block px-4 py-2.5 rounded-md transition font-medium ${pathname.startsWith("/publishers") ? "bg-[#f2e7d4] text-[#2e2a24]" : "text-[#f2e7d4] hover:bg-[#c7ad84]"}`}
        >
          Publishers
        </Link>
      </nav>

      {/* Tombol Logout di Bawah */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
