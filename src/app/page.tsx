"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-gray-500 font-medium">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to the Dashboard, {user.name}!
        </h1>
        <p className="text-gray-600">
          Use the menu on the left sidebar to manage Books, Authors, and
          Publishers in this catalog system.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-bold text-blue-800">List Books</h3>
          <p className="text-sm text-blue-600 mt-1">
            Add, edit, and manage the book catalog.
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 className="text-lg font-bold text-green-800">List Authors</h3>
          <p className="text-sm text-green-600 mt-1">
            Manage author data and biographies.
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 className="text-lg font-bold text-purple-800">List Publishers</h3>
          <p className="text-sm text-purple-600 mt-1">
            Manage publisher data and addresses.
          </p>
        </div>
      </div>
    </div>
  );
}
