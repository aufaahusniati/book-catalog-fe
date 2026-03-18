"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "../../../../lib/axios";
import Link from "next/link";

interface DropdownItem {
  id: number;
  name: string;
}

export default function EditBookPage() {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [authors, setAuthors] = useState<DropdownItem[]>([]);
  const [publishers, setPublishers] = useState<DropdownItem[]>([]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [bookRes, authorsRes, publishersRes] = await Promise.all([
          axiosInstance.get(`/books/${id}`),
          axiosInstance.get("/authors?per_page=100"),
          axiosInstance.get("/publishers?per_page=100"),
        ]);

        const book = bookRes.data.data;
        setTitle(book.title);
        setAuthorId(book.author_id.toString());
        setPublisherId(book.publisher_id.toString());

        setAuthors(authorsRes.data.data.data);
        setPublishers(publishersRes.data.data.data);
      } catch (error) {
        router.push("/books");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchAllData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);

    try {
      await axiosInstance.put(`/books/${id}`, {
        title,
        author_id: authorId,
        publisher_id: publisherId,
      });
      router.push("/books");
    } catch (error: any) {
      if (error.response?.data?.errors)
        setFieldErrors(error.response.data.errors);
      else alert("Failed to update data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return <div className="p-8 text-gray-500">Loading data...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Book</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex gap-4 pt-2">
            <Link
              href="/books"
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
