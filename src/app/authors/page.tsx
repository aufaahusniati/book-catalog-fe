"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../lib/axios";
import Link from "next/link";
import { FcGenericSortingAsc, FcGenericSortingDesc } from "react-icons/fc";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

interface Author {
  id: number;
  name: string;
  bio: string | null;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/authors", {
        params: {
          page: page,
          search: search,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      const paginationData = response.data.data;
      setAuthors(paginationData.data);
      setTotalPages(paginationData.last_page);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAuthors();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Author?")) return;
    try {
      await axiosInstance.delete(`/authors/${id}`);
      fetchAuthors();
    } catch (error) {
      alert("Failed to delete data.");
    }
  };

  // Fungsi Render Ikon yang Diperbarui
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      // Ikon tidak aktif: kita buat pucat (opacity-30) dan hitam-putih (grayscale)
      return (
        <FcGenericSortingAsc
          className="inline ml-2 opacity-30 grayscale"
          size={18}
        />
      );
    }
    // Ikon aktif: munculkan warna aslinya sesuai arah (Asc/Desc)
    return sortOrder === "asc" ? (
      <FcGenericSortingAsc className="inline ml-2" size={18} />
    ) : (
      <FcGenericSortingDesc className="inline ml-2" size={18} />
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">List Authors</h1>
        <Link
          href="/authors/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition shadow-sm inline-flex items-center gap-2"
        >
          <IoIosAddCircleOutline size={18} /> Add Author
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search author name..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:ring-blue-500 focus:border-blue-500 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
            title="Search"
          >
            <FaSearch size={16} />
          </button>
        </form>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <th
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-200 select-none transition group"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      ID {renderSortIcon("id")}
                    </div>
                  </th>

                  <th
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-200 select-none transition group"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name {renderSortIcon("name")}
                    </div>
                  </th>

                  <th className="p-4 font-semibold">Biography</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.length > 0 ? (
                  authors.map((author) => (
                    <tr
                      key={author.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <td className="p-4 text-gray-600">{author.id}</td>
                      <td className="p-4 text-gray-900 font-medium">
                        {author.name}
                      </td>
                      <td className="p-4 text-gray-600">{author.bio || "-"}</td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-2">
                          <Link
                            href={`/authors/edit/${author.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm transition inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <FaRegEdit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(author.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition inline-flex items-center justify-center"
                            title="Delete"
                          >
                            <MdDeleteOutline size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Data not found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center justify-center"
            title="Previous"
          >
            <GrFormPrevious size={18} />
          </button>
          <span className="text-gray-600 text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center justify-center"
            title="Next"
          >
            <GrFormNext size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
