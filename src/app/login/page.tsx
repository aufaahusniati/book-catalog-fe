"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State untuk error global (misal: "Email/Password salah")
  const [globalError, setGlobalError] = useState("");
  // State untuk error spesifik per input field dari validasi Laravel
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [isLoading, setIsLoading] = useState(false);
  const { login, user, loading } = useAuth();

  // Redirect jika user sudah login
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Tampilkan loading saat memeriksa status autentikasi
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset semua error sebelum mengirim request baru
    setGlobalError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { user, authorization } = response.data;
      login(authorization.token, user);
    } catch (err: any) {
      // Cek apakah error berasal dari validasi per field (biasanya status 400/422 dari Laravel)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      // Jika bukan error validasi field, tampilkan sebagai error global
      else {
        setGlobalError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Login gagal. Terjadi kesalahan jaringan.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Catalog
        </h2>

        {/* Alert untuk Error Global */}
        {globalError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-200">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 
                                ${fieldErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Pesan Error Field Email */}
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 
                                ${fieldErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Pesan Error Field Password */}
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
