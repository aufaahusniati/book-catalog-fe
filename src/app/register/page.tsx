"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // State untuk error global dan error per field
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [isLoading, setIsLoading] = useState(false);

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

    // Reset error sebelum submit
    setGlobalError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      // Mengirim data ke endpoint register backend
      await axiosInstance.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Jika sukses, arahkan ke halaman login
      alert("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err: any) {
      // Menangkap error validasi per field (422 Unprocessable Entity)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      // Error umum lainnya
      else {
        setGlobalError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Registrasi gagal. Terjadi kesalahan jaringan.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        {/* Alert untuk Error Global */}
        {globalError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-200">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 
                                ${fieldErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {fieldErrors.name[0]}
              </p>
            )}
          </div>

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
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 
                                ${fieldErrors.password_confirmation ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {fieldErrors.password_confirmation[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
          >
            {isLoading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>

        {/* Link kembali ke Login */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
