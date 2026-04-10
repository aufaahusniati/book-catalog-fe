"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import AuthForm from "../../components/AuthForm";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

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
      await axiosInstance.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert("Registration successful! Please login.");
      router.push("/login");
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
            responseData?.message ||
              responseData?.error ||
              "failed to register. Please try again.",
          );
        }
      } else {
        setGlobalError("failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create an Account"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      submitLabel="Register"
      loadingLabel="Creating account..."
      globalError={globalError}
      footerText="Already have an account?"
      footerLinkLabel="Login here"
      footerLinkHref="/login"
      containerClassName="flex min-h-screen items-center justify-center bg-gray-100 py-10"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.name[0]}
          </p>
        )}
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          className={`w-full px-4 py-2 mt-1 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.password_confirmation ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        {fieldErrors.password_confirmation && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.password_confirmation[0]}
          </p>
        )}
      </div>
    </AuthForm>
  );
}
