"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "../../../../lib/axios";
import Form from "../../../../components/Form";

export default function EditAuthorPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axiosInstance.get(`/authors/${id}`);
        setName(response.data.data.name);
        setBio(response.data.data.bio || "");
      } catch (error) {
        router.push("/authors");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchAuthor();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      await axiosInstance.put(`/authors/${id}`, { name, bio });
      router.push("/authors");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      } else {
        alert("Failed to update author.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return <div className="p-8 text-gray-500">Loading form data...</div>;

  return (
    <Form
      title="Edit Author"
      cancelHref="/authors"
      submitLabel="Update"
      isSubmitting={isLoading}
      onSubmit={handleSubmit}
      loadingLabel="Saving..."
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author Name
        </label>
        <input
          type="text"
          className={`w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biography
        </label>
        <textarea
          rows={4}
          className={`w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.bio ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        {fieldErrors.bio && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.bio[0]}
          </p>
        )}
      </div>
    </Form>
  );
}
