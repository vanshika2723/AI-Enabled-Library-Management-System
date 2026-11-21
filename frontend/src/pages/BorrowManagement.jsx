
import { useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  RotateCcw,
  AlertCircle,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  IndianRupee,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Filter,
} from "lucide-react";

const borrowRecords = [
  { id: "BR-1024", student: "Aarav Sharma", studentId: "STU001", book: "Atomic Habits", author: "James Clear", issueDate: "18 Nov 2026", dueDate: "25 Nov 2026", status: "Issued", fine: 0 },
  { id: "BR-1023", student: "Priya Singh", studentId: "STU002", book: "The Psychology of Money", author: "Morgan Housel", issueDate: "15 Nov 2026", dueDate: "20 Nov 2026", status: "Overdue", fine: 15 },
  { id: "BR-1022", student: "Rahul Verma", studentId: "STU003", book: "Clean Code", author: "Robert C. Martin", issueDate: "12 Nov 2026", dueDate: "19 Nov 2026", status: "Returned", fine: 0 },
  { id: "BR-1021", student: "Ananya Gupta", studentId: "STU004", book: "Rich Dad Poor Dad", author: "Robert Kiyosaki", issueDate: "16 Nov 2026", dueDate: "22 Nov 2026", status: "Issued", fine: 0 },
  { id: "BR-1020", student: "Rohan Mehta", studentId: "STU005", book: "Ikigai", author: "Hector Garcia", issueDate: "10 Nov 2026", dueDate: "16 Nov 2026", status: "Overdue", fine: 25 },
  { id: "BR-1019", student: "Sneha Patel", studentId: "STU006", book: "Deep Work", author: "Cal Newport", issueDate: "08 Nov 2026", dueDate: "15 Nov 2026", status: "Returned", fine: 0 },
  { id: "BR-1018", student: "Karan Joshi", studentId: "STU007", book: "Think Like a Monk", author: "Jay Shetty", issueDate: "17 Nov 2026", dueDate: "24 Nov 2026", status: "Issued", fine: 0 },
  { id: "BR-1017", student: "Meera Kapoor", studentId: "STU008", book: "The Alchemist", author: "Paulo Coelho", issueDate: "09 Nov 2026", dueDate: "14 Nov 2026", status: "Returned", fine: 0 },
  { id: "BR-1016", student: "Aditya Rao", studentId: "STU009", book: "Zero to One", author: "Peter Thiel", issueDate: "11 Nov 2026", dueDate: "17 Nov 2026", status: "Overdue", fine: 10 },
  { id: "BR-1015", student: "Ishita Jain", studentId: "STU010", book: "Start With Why", author: "Simon Sinek", issueDate: "19 Nov 2026", dueDate: "26 Nov 2026", status: "Issued", fine: 0 },
];

const statusConfig = {
  Issued: {
    color: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  Returned: {
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Overdue: {
    color: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

function StatCard({ title, value, description, icon: Icon, iconBg, iconColor, trend }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">{value}</h3>
        </div>
        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon size={21} className={iconColor} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
        <span>{description}</span>
      </div>
    </div>
  );
}

export default function BorrowManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredRecords = useMemo(() => {
    return borrowRecords.filter((record) => {
      const matchesSearch =
        record.student.toLowerCase().includes(search.toLowerCase()) ||
        record.studentId.toLowerCase().includes(search.toLowerCase()) ||
        record.book.toLowerCase().includes(search.toLowerCase()) ||
        record.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  const currentRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const stats = [
    {
      title: "Total Borrowed",
      value: "248",
      description: "All-time borrow records",
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      trend: "+12%",
    },
    {
      title: "Currently Issued",
      value: "86",
      description: "Books with students",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+8",
    },
    {
      title: "Returned Books",
      value: "142",
      description: "Successfully returned",
      icon: RotateCcw,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "+18",
    },
    {
      title: "Overdue Books",
      value: "20",
      description: "Need immediate attention",
      icon: AlertCircle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      trend: "-3",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <BookOpen size={16} />
              <span>Library</span>
              <span>/</span>
              <span className="text-slate-700">Borrow Management</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Borrow Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track issued books, returns and overdue records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("Issue Book form will be connected in the next step.")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            <Plus size={18} />
            Issue New Book
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-amber-50 p-3">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Borrowers</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">64</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-rose-50 p-3">
              <IndianRupee size={20} className="text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Fines</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">₹1,250</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Return Rate</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">92.4%</h3>
            </div>
          </div>
        </div>

        {/* Records Section */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Borrow Records</h2>
              <p className="mt-1 text-sm text-slate-500">
                View and manage all book transactions
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search student, book, ID..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 sm:w-40"
                >
                  <option value="All">All Status</option>
                  <option value="Issued">Issued</option>
                  <option value="Returned">Returned</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Borrow ID</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Book Details</th>
                  <th className="px-5 py-4">Issue Date</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Fine</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {currentRecords.map((record) => {
                  const status = statusConfig[record.status];

                  return (
                    <tr key={record.id} className="transition hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="font-semibold text-violet-600">{record.id}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                            {record.student
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                              {record.student}
                            </p>
                            <p className="text-xs text-slate-500">{record.studentId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-sm font-medium text-slate-800">
                          {record.book}
                        </p>
                        <p className="whitespace-nowrap text-xs text-slate-500">{record.author}</p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-slate-400" />
                          {record.issueDate}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {record.dueDate}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.color}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {record.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {record.fine > 0 ? (
                          <span className="text-sm font-semibold text-rose-600">
                            ₹{record.fine}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {currentRecords.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <Search size={20} className="text-slate-400" />
                      </div>
                      <p className="mt-3 font-semibold text-slate-700">No records found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredRecords.length === 0 ? 0 : (page - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(page * pageSize, filteredRecords.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{filteredRecords.length}</span>{" "}
              records
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                    page === p
                      ? "bg-violet-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <p className="text-center text-xs text-slate-400">
          Borrow Management UI Preview · Sample data displayed
        </p>
      </div>
    </div>
  );
}
