"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "../../../../lib/axios";
import Form from "../../../../components/Form";

export default function EditPublisherPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        const response = await axiosInstance.get(`/publishers/${id}`);
        setName(response.data.data.name);
        setAddress(response.data.data.address || "");
      } catch (error) {
        router.push("/publishers");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchPublisher();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      await axiosInstance.put(`/publishers/${id}`, { name, address });
      router.push("/publishers");
    } catch (error: any) {
      if (error.response?.data?.errors)
        setFieldErrors(error.response.data.errors);
      else alert("Failed to update data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return <div className="p-8 text-gray-500">Loading data form...</div>;

  return (
    <Form
      title="Edit Publisher"
      cancelHref="/publishers"
      submitLabel="Update"
      isSubmitting={isLoading}
      onSubmit={handleSubmit}
      loadingLabel="Saving..."
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Publisher Name
        </label>
        <input
          type="text"
          className={`w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.name ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
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
          Address
        </label>
        <textarea
          rows={4}
          className={`w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.address ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
        {fieldErrors.address && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.address[0]}
          </p>
        )}
      </div>
    </Form>
  );
}
