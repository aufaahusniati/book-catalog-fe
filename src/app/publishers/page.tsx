"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../lib/axios";
import Link from "next/link";
import { FcGenericSortingAsc, FcGenericSortingDesc } from "react-icons/fc";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

interface Publisher {
  id: number;
  name: string;
  address: string | null;
}

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchPublishers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/publishers", {
        params: { page, search, sort_by: sortBy, sort_order: sortOrder },
      });
      const paginationData = response.data.data;
      setPublishers(paginationData.data);
      setTotalPages(paginationData.last_page);
    } catch (error) {
      console.error("Failed to fetch publishers", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchPublishers();
  }, [fetchPublishers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPublishers();
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
    if (!confirm("Are you sure you want to delete this Publisher?")) return;
    try {
      await axiosInstance.delete(`/publishers/${id}`);
      fetchPublishers();
    } catch (error) {
      alert("Failed to delete data.");
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column)
      return (
        <FcGenericSortingAsc
          className="inline ml-2 opacity-30 grayscale"
          size={18}
        />
      );
    return sortOrder === "asc" ? (
      <FcGenericSortingAsc className="inline ml-2" size={18} />
    ) : (
      <FcGenericSortingDesc className="inline ml-2" size={18} />
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">List Publishers</h1>
        <Link
          href="/publishers/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition shadow-sm inline-flex items-center gap-2"
        >
          <IoIosAddCircleOutline size={18} /> Add New Publisher
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Cari nama atau alamat publisher..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:ring-blue-500 focus:border-blue-500 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
            title="Cari"
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
                      Publisher Name {renderSortIcon("name")}
                    </div>
                  </th>
                  <th className="p-4 font-semibold">Address</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {publishers.length > 0 ? (
                  publishers.map((publisher) => (
                    <tr
                      key={publisher.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <td className="p-4 text-gray-600">{publisher.id}</td>
                      <td className="p-4 text-gray-900 font-medium">
                        {publisher.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {publisher.address || "-"}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-2">
                          <Link
                            href={`/publishers/edit/${publisher.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm transition inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <FaRegEdit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(publisher.id)}
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
