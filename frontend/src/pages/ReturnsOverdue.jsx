
import { useState } from "react";
import {
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  IndianRupee,
  Search,
  CalendarDays,
  BookOpen,
  User,
  ArrowUpRight,
  CircleCheck,
} from "lucide-react";

const initialRecords = [
  { id: "BR-1021", student: "Rahul Sharma", studentId: "STU001", book: "Atomic Habits", issueDate: "12 Nov 2026", dueDate: "18 Nov 2026", returnDate: "-", daysLate: 3, fine: 15, status: "Overdue" },
  { id: "BR-1022", student: "Priya Verma", studentId: "STU002", book: "The Psychology of Money", issueDate: "10 Nov 2026", dueDate: "20 Nov 2026", returnDate: "-", daysLate: 1, fine: 5, status: "Overdue" },
  { id: "BR-1023", student: "Aman Gupta", studentId: "STU003", book: "Clean Code", issueDate: "14 Nov 2026", dueDate: "21 Nov 2026", returnDate: "-", daysLate: 0, fine: 0, status: "Due Today" },
  { id: "BR-1024", student: "Sneha Agarwal", studentId: "STU004", book: "Ikigai", issueDate: "15 Nov 2026", dueDate: "24 Nov 2026", returnDate: "-", daysLate: 0, fine: 0, status: "Issued" },
  { id: "BR-1025", student: "Karan Mehta", studentId: "STU005", book: "Rich Dad Poor Dad", issueDate: "05 Nov 2026", dueDate: "16 Nov 2026", returnDate: "-", daysLate: 5, fine: 25, status: "Overdue" },
  { id: "BR-1026", student: "Ananya Singh", studentId: "STU006", book: "Deep Work", issueDate: "08 Nov 2026", dueDate: "17 Nov 2026", returnDate: "19 Nov 2026", daysLate: 2, fine: 10, status: "Returned" },
  { id: "BR-1027", student: "Rohit Jain", studentId: "STU007", book: "The Alchemist", issueDate: "09 Nov 2026", dueDate: "15 Nov 2026", returnDate: "18 Nov 2026", daysLate: 3, fine: 15, status: "Returned" },
];

const filterOptions = ["All", "Overdue", "Due Today", "Issued", "Returned"];

export default function ReturnsOverdue() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const today = records.filter((r) => r.status === "Due Today").length;
  const overdue = records.filter((r) => r.status === "Overdue").length;
  const returned = records.filter((r) => r.status === "Returned").length;
  const pendingFine = records
    .filter((r) => r.status === "Overdue")
    .reduce((sum, r) => sum + r.fine, 0);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.student.toLowerCase().includes(search.toLowerCase()) ||
      record.studentId.toLowerCase().includes(search.toLowerCase()) ||
      record.book.toLowerCase().includes(search.toLowerCase()) ||
      record.id.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || record.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleReturn = (id) => {
    if (window.confirm("Confirm that this book has been returned?")) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === id
            ? { ...record, status: "Returned", returnDate: "21 Nov 2026" }
            : record
        )
      );
    }
  };

  const statusStyles = {
    Overdue: "bg-rose-50 text-rose-600",
    "Due Today": "bg-amber-50 text-amber-600",
    Issued: "bg-blue-50 text-blue-600",
    Returned: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Returns & Overdue</h1>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
              DEMO
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Track returns, overdue books and outstanding fines.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Overdue Books", value: overdue, icon: AlertTriangle, color: "rose", note: "Requires attention" },
          { title: "Due Today", value: today, icon: Clock, color: "amber", note: "Return deadline today" },
          { title: "Returned Books", value: returned, icon: CheckCircle2, color: "emerald", note: "Successfully returned" },
          { title: "Pending Fines", value: `₹${pendingFine}`, icon: IndianRupee, color: "violet", note: "From overdue records" },
        ].map((stat) => {
          const Icon = stat.icon;
          const colors = {
            rose: "bg-rose-100 text-rose-600",
            amber: "bg-amber-100 text-amber-600",
            emerald: "bg-emerald-100 text-emerald-600",
            violet: "bg-violet-100 text-violet-600",
          };

          return (
            <div key={stat.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${colors[stat.color]}`}>
                <Icon size={21} />
              </div>
              <p className="text-sm text-slate-500">{stat.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">{stat.value}</h2>
              <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
            </div>
          );
        })}
      </div>

      {/* Overdue Alert */}
      {overdue > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-rose-500" size={20} />
          <div>
            <p className="text-sm font-semibold text-rose-700">
              {overdue} overdue {overdue === 1 ? "book needs" : "books need"} attention
            </p>
            <p className="mt-1 text-xs text-rose-600">
              Contact students and collect outstanding books and fines.
            </p>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-800">Borrowing Records</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage due dates, returns and fine status.
          </p>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, book or borrow ID..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    filter === option
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Borrow ID</th>
                <th className="px-5 py-4 font-semibold">Student / Book</th>
                <th className="px-5 py-4 font-semibold">Issue Date</th>
                <th className="px-5 py-4 font-semibold">Due Date</th>
                <th className="px-5 py-4 font-semibold">Late Days</th>
                <th className="px-5 py-4 font-semibold">Fine</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4 text-xs font-semibold text-slate-600">{record.id}</td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{record.student}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <BookOpen size={12} /> {record.book}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">{record.issueDate}</td>

                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium ${record.status === "Overdue" ? "text-rose-600" : "text-slate-600"}`}>
                      {record.dueDate}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold ${record.daysLate > 0 && record.status !== "Returned" ? "text-rose-600" : "text-slate-500"}`}>
                      {record.status === "Returned" ? `${record.daysLate} days` : record.daysLate > 0 ? `${record.daysLate} days` : "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">₹{record.fine}</td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>
                      {record.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {record.status !== "Returned" ? (
                      <button
                        onClick={() => handleReturn(record.id)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100"
                      >
                        <CircleCheck size={15} />
                        Return
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 size={15} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <AlertTriangle size={30} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-sm text-slate-500">No borrowing records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            Showing {filteredRecords.length} of {records.length} records
          </p>
          <p className="text-xs text-slate-400">Demo data · Return API pending</p>
        </div>
      </div>
    </div>
  );
}
