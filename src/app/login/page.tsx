"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../lib/axios";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGlobalError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { user, authorization } = response.data;
      login(authorization.token, user);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          | {
              errors?: Record<string, string[]>;
              error?: string;
              message?: string;
            }
          | undefined;

        if (responseData?.errors) {
          setFieldErrors(responseData.errors);
        } else {
          setGlobalError(
            responseData?.error ||
              responseData?.message ||
              "failed to login. Please check your credentials.",
          );
        }
      } else {
        setGlobalError("failed to login. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Login to Catalog"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      submitLabel="Login"
      loadingLabel="Loading..."
      globalError={globalError}
      footerText="Do you not have an account?"
      footerLinkLabel="Register here"
      footerLinkHref="/register"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.password[0]}
          </p>
        )}
      </div>
    </AuthForm>
  );
}
