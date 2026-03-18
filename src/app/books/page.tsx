"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../lib/axios";
import Link from "next/link";
import { FcGenericSortingAsc, FcGenericSortingDesc } from "react-icons/fc";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

// Definisi Interface
interface RelationalData {
  id: number;
  name: string;
}
interface Book {
  id: number;
  title: string;
  author: RelationalData;
  publisher: RelationalData;
}
interface DropdownItem {
  id: number;
  name: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  // State untuk Filter Dropdown
  const [authors, setAuthors] = useState<DropdownItem[]>([]);
  const [publishers, setPublishers] = useState<DropdownItem[]>([]);

  // State untuk parameter API
  const [search, setSearch] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterPublisher, setFilterPublisher] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State untuk Sorting
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dropdown (Author & Publisher) untuk filter
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        // Kita ambil data agak banyak untuk dropdown filter (misal per_page=100)
        const [authorsRes, publishersRes] = await Promise.all([
          axiosInstance.get("/authors?per_page=100"),
          axiosInstance.get("/publishers?per_page=100"),
        ]);
        setAuthors(authorsRes.data.data.data);
        setPublishers(publishersRes.data.data.data);
      } catch (error) {
        console.error("Failed to load dropdown filter", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch data Books dengan semua parameter
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/books", {
        params: {
          page: page,
          search: search,
          author_id: filterAuthor,
          publisher_id: filterPublisher,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      const paginationData = response.data.data;
      setBooks(paginationData.data);
      setTotalPages(paginationData.last_page);
    } catch (error) {
      console.error("Failed to fetch book data", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterAuthor, filterPublisher, sortBy, sortOrder]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearchAndFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleReset = () => {
    setSearch("");
    setFilterAuthor("");
    setFilterPublisher("");
    setSortBy("id");
    setSortOrder("desc");
    setPage(1);
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
    if (!confirm("Are you sure you want to delete this Book?")) return;
    try {
      await axiosInstance.delete(`/books/${id}`);
      fetchBooks();
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
        <h1 className="text-3xl font-bold text-gray-800">List Books</h1>
        <Link
          href="/books/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition shadow-sm inline-flex items-center gap-2"
        >
          <IoIosAddCircleOutline size={18} /> Add New Book
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Area Filter & Pencarian */}
        <form
          onSubmit={handleSearchAndFilter}
          className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Search book title..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          >
            <option value="">-- All Authors --</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
            value={filterPublisher}
            onChange={(e) => setFilterPublisher(e.target.value)}
          >
            <option value="">-- All Publishers --</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex-1"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition font-medium"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Tabel Books */}
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <th
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-200 select-none group"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center">
                      ID {renderSortIcon("id")}
                    </div>
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-200 select-none group"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Title {renderSortIcon("title")}
                    </div>
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-200 select-none group"
                    onClick={() => handleSort("author_id")}
                  >
                    <div className="flex items-center">
                      Author {renderSortIcon("author_id")}
                    </div>
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-200 select-none group"
                    onClick={() => handleSort("publisher_id")}
                  >
                    <div className="flex items-center">
                      Publisher {renderSortIcon("publisher_id")}
                    </div>
                  </th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr
                      key={book.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <td className="p-4 text-gray-600">{book.id}</td>
                      <td className="p-4 text-gray-900 font-medium">
                        {book.title}
                      </td>
                      <td className="p-4 text-gray-900">
                        {book.author?.name || "-"}
                      </td>
                      <td className="p-4 text-gray-900">
                        {book.publisher?.name || "-"}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-2">
                          <Link
                            href={`/books/edit/${book.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm transition inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <FaRegEdit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition inline-flex items-center justify-center"
                            title="Hapus"
                          >
                            <MdDeleteOutline size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Book data not found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
