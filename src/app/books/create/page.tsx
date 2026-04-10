"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axios";
import Form from "../../../components/Form";

interface DropdownItem {
  id: number;
  name: string;
}

export default function CreateBookPage() {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [authors, setAuthors] = useState<DropdownItem[]>([]);
  const [publishers, setPublishers] = useState<DropdownItem[]>([]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [authorsRes, publishersRes] = await Promise.all([
          axiosInstance.get("/authors?per_page=100"),
          axiosInstance.get("/publishers?per_page=100"),
        ]);
        setAuthors(authorsRes.data.data.data);
        setPublishers(publishersRes.data.data.data);
      } catch (error) {
        console.error("Failed to load dropdown", error);
      }
    };
    fetchDropdowns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      await axiosInstance.post("/books", {
        title,
        author_id: authorId,
        publisher_id: publisherId,
      });
      router.push("/books");
    } catch (error: any) {
      if (error.response?.data?.errors)
        setFieldErrors(error.response.data.errors);
      else alert("Failed to add data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      title="Add New Book"
      cancelHref="/books"
      submitLabel="Save"
      isSubmitting={isLoading}
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          className={`w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 ${fieldErrors.title ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {fieldErrors.title && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.title[0]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Author
        </label>
        <select
          className={`w-full px-4 py-2 border rounded-md text-black bg-white focus:outline-none focus:ring-2 ${fieldErrors.author_id ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <option value="" disabled>
            -- Select Author --
          </option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {fieldErrors.author_id && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.author_id[0]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Publisher
        </label>
        <select
          className={`w-full px-4 py-2 border rounded-md text-black bg-white focus:outline-none focus:ring-2 ${fieldErrors.publisher_id ? "border-red-500" : "border-gray-300 focus:ring-blue-500"}`}
          value={publisherId}
          onChange={(e) => setPublisherId(e.target.value)}
        >
          <option value="" disabled>
            -- Select Publisher --
          </option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {fieldErrors.publisher_id && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {fieldErrors.publisher_id[0]}
          </p>
        )}
      </div>
    </Form>
  );
}
