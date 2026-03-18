import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Flexbox agar Sidebar dan Konten berdampingan */}
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar akan otomatis hilang di halaman Login/Register */}
            <Sidebar />

            {/* Area Konten Utama yang bisa di-scroll */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
