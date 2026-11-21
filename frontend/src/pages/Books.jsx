import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen, Plus, Search, Filter, Pencil, Trash2, Eye,
  Library, CheckCircle2, BookMarked, AlertCircle, X,
  Loader2, RefreshCw,
} from "lucide-react";
import api from "../utils/api";

const categories = [
  "All Categories", "Technology", "Self Help", "Finance",
  "Fiction", "Productivity", "Science", "Literature", "Other",
];

const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  category: "Technology",
  publisher: "",
  publishedYear: "",
  totalCopies: 1,
  shelfLocation: "",
  description: "",
  coverImage: "",
  language: "English",
};

const getBookList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.books)) return response.books;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.books)) return response.data.books;
  return [];
};

const normalizeBook = (book) => ({
  ...book,
  id: book._id,
  total: Number(book.totalCopies ?? 0),
  available: Number(book.availableCopies ?? 0),
  shelf: book.shelfLocation || "—",
});

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api("/books");
      setBooks(getBookList(response).map(normalizeBook));
    } catch (err) {
      setError(err.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const term = search.toLowerCase();

      const matchesSearch =
        (book.title || "").toLowerCase().includes(term) ||
        (book.author || "").toLowerCase().includes(term) ||
        (book.isbn || "").toLowerCase().includes(term);

      const matchesCategory =
        category === "All Categories" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const totalCopies = books.reduce((sum, book) => sum + book.total, 0);
  const availableCopies = books.reduce((sum, book) => sum + book.available, 0);
  const issuedCopies = totalCopies - availableCopies;

  const openAdd = () => {
    setForm(emptyForm);
    setSelectedBook(null);
    setModal("form");
  };

  const openEdit = (book) => {
    setSelectedBook(book);
    setForm({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      category: book.category || "Technology",
      publisher: book.publisher || "",
      publishedYear: book.publishedYear || "",
      totalCopies: book.totalCopies ?? 1,
      shelfLocation: book.shelfLocation || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      language: book.language || "English",
    });
    setModal("form");
  };

  const openView = (book) => {
    setSelectedBook(book);
    setModal("view");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalCopies" || name === "publishedYear"
        ? value === "" ? "" : Number(value)
        : value,
    }));
  };

  const saveBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        totalCopies: Number(form.totalCopies),
        publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
      };

      if (selectedBook) {
        await api(`/books/${selectedBook._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/books", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setModal("");
      setSelectedBook(null);
      setForm(emptyForm);
      await loadBooks();
    } catch (err) {
      setError(err.message || "Unable to save book.");
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async (book) => {
    if (!window.confirm(`Delete "${book.title}" from the library?`)) return;

    setError("");

    try {
      await api(`/books/${book._id}`, { method: "DELETE" });
      await loadBooks();
    } catch (err) {
      setError(err.message || "Unable to delete book.");
    }
  };

  const colorMap = {
    violet: "bg-violet-100 text-violet-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };

  const stats = [
    { title: "Total Titles", value: books.length, icon: Library, color: "violet" },
    { title: "Total Copies", value: totalCopies, icon: BookOpen, color: "blue" },
    { title: "Available Copies", value: availableCopies, icon: CheckCircle2, color: "emerald" },
    { title: "Issued Copies", value: issuedCopies, icon: BookMarked, color: "amber" },
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Books Library</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
              LIVE DATA
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage your collection, inventory and book information.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadBooks}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-100 hover:bg-violet-700"
          >
            <Plus size={18} /> Add New Book
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError("")}><X size={16} /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${colorMap[stat.color]}`}>
                <Icon size={21} />
              </div>
              <p className="text-sm text-slate-500">{stat.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {loading ? "—" : stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Inventory */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-800">Book Inventory</h2>
          <p className="mt-1 text-sm text-slate-500">Browse and manage library books</p>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, author or ISBN..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="relative lg:w-56">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
              >
                {categories.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Book</th>
                <th className="px-5 py-4 font-semibold">ISBN</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Copies</th>
                <th className="px-5 py-4 font-semibold">Availability</th>
                <th className="px-5 py-4 font-semibold">Shelf</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {!loading && filteredBooks.map((book) => (
                <tr key={book._id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{book.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{book.author}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">{book.isbn || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{book.total}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${book.available > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
                      <span className={`text-xs font-semibold ${book.available > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {book.available > 0 ? `${book.available} available` : "Out of stock"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{book.total - book.available} issued</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{book.shelf}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button title="View" onClick={() => openView(book)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button title="Edit" onClick={() => openEdit(book)} className="rounded-lg p-2 text-slate-400 hover:bg-violet-50 hover:text-violet-600">
                        <Pencil size={16} />
                      </button>
                      <button title="Delete" onClick={() => deleteBook(book)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="7" className="px-5 py-14 text-center">
                    <Loader2 size={28} className="mx-auto animate-spin text-violet-500" />
                    <p className="mt-3 text-sm text-slate-500">Loading books from database...</p>
                  </td>
                </tr>
              )}

              {!loading && filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <AlertCircle className="mx-auto text-slate-300" size={30} />
                    <p className="mt-2 text-sm text-slate-500">No books found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredBooks.length}</span> of{" "}
            <span className="font-semibold text-slate-700">{books.length}</span> titles
          </p>
          <span className="text-xs text-emerald-600">Connected to database</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal === "form" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedBook ? "Edit Book" : "Add New Book"}
                </h2>
                <p className="text-xs text-slate-500">Book details and inventory information</p>
              </div>
              <button onClick={() => setModal("")} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            <form onSubmit={saveBook} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["title", "Book Title", true],
                  ["author", "Author", true],
                  ["isbn", "ISBN", false],
                  ["category", "Category", true],
                  ["publisher", "Publisher", false],
                  ["publishedYear", "Published Year", false],
                  ["totalCopies", "Total Copies", true],
                  ["shelfLocation", "Shelf Location", false],
                  ["language", "Language", false],
                  ["coverImage", "Cover Image URL", false],
                ].map(([name, label, required]) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</label>
                    {name === "category" ? (
                      <select name={name} value={form[name]} onChange={handleFormChange} className={inputClass} required={required}>
                        {categories.filter((c) => c !== "All Categories").map((c) => <option key={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input
                        name={name}
                        type={name === "publishedYear" || name === "totalCopies" ? "number" : "text"}
                        min={name === "totalCopies" ? 1 : undefined}
                        value={form[name]}
                        onChange={handleFormChange}
                        className={inputClass}
                        required={required}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className={inputClass}
                  placeholder="Short description about the book..."
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <div className="flex justify-end gap-3 border-t pt-4">
                <button type="button" onClick={() => setModal("")} className="rounded-xl border px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button disabled={saving} type="submit" className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {selectedBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modal === "view" && selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-slate-800">Book Details</h2>
              <button onClick={() => setModal("")} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <BookOpen size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{selectedBook.title}</h3>
                <p className="text-sm text-slate-500">{selectedBook.author}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["ISBN", selectedBook.isbn],
                ["Category", selectedBook.category],
                ["Publisher", selectedBook.publisher],
                ["Year", selectedBook.publishedYear],
                ["Total Copies", selectedBook.totalCopies],
                ["Available Copies", selectedBook.availableCopies],
                ["Shelf", selectedBook.shelfLocation],
                ["Language", selectedBook.language],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{value || "—"}</p>
                </div>
              ))}
            </div>
            {selectedBook.description && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Description</p>
                <p className="mt-1 text-sm text-slate-600">{selectedBook.description}</p>
              </div>
            )}
            <button onClick={() => setModal("")} className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-900">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}