
import {
  BarChart3,
  BookOpen,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  PieChart,
  Library,
} from "lucide-react";

const monthlyData = [
  { month: "Jun", issued: 42, returned: 30 },
  { month: "Jul", issued: 58, returned: 45 },
  { month: "Aug", issued: 76, returned: 55 },
  { month: "Sep", issued: 64, returned: 52 },
  { month: "Oct", issued: 88, returned: 68 },
  { month: "Nov", issued: 72, returned: 60 },
];

const categories = [
  { name: "Technology", count: 320, percentage: 35, color: "bg-violet-500" },
  { name: "Fiction", count: 245, percentage: 27, color: "bg-blue-500" },
  { name: "Self Help", count: 180, percentage: 20, color: "bg-emerald-500" },
  { name: "Finance", count: 115, percentage: 13, color: "bg-amber-500" },
  { name: "Others", count: 48, percentage: 5, color: "bg-rose-400" },
];

const topBooks = [
  { rank: 1, title: "Atomic Habits", author: "James Clear", issued: 48, category: "Self Help" },
  { rank: 2, title: "The Psychology of Money", author: "Morgan Housel", issued: 42, category: "Finance" },
  { rank: 3, title: "Clean Code", author: "Robert C. Martin", issued: 36, category: "Technology" },
  { rank: 4, title: "Deep Work", author: "Cal Newport", issued: 31, category: "Productivity" },
  { rank: 5, title: "The Alchemist", author: "Paulo Coelho", issued: 27, category: "Fiction" },
];

const studentActivity = [
  { name: "Rahul Sharma", id: "STU001", course: "B.Tech CSE", borrowed: 12, returned: 10 },
  { name: "Priya Verma", id: "STU002", course: "B.Tech IT", borrowed: 9, returned: 8 },
  { name: "Aman Gupta", id: "STU003", course: "B.Tech CSE", borrowed: 8, returned: 8 },
  { name: "Sneha Agarwal", id: "STU004", course: "MBA", borrowed: 7, returned: 6 },
  { name: "Ananya Singh", id: "STU006", course: "B.Tech ECE", borrowed: 6, returned: 5 },
];

const summaryCards = [
  {
    title: "Total Issued",
    value: "864",
    trend: "+12.8%",
    note: "vs last month",
    icon: BookOpen,
    color: "violet",
    positive: true,
  },
  {
    title: "Total Returned",
    value: "721",
    trend: "+8.4%",
    note: "vs last month",
    icon: Library,
    color: "emerald",
    positive: true,
  },
  {
    title: "Active Students",
    value: "562",
    trend: "+5.2%",
    note: "vs last month",
    icon: Users,
    color: "blue",
    positive: true,
  },
  {
    title: "Avg. Borrowing",
    value: "3.6",
    trend: "-2.1%",
    note: "books per student",
    icon: TrendingUp,
    color: "amber",
    positive: false,
  },
];

export default function Reports() {
  const handleExport = () => {
    const rows = [
      ["Rank", "Book Title", "Author", "Category", "Borrow Count"],
      ...topBooks.map((book) => [
        book.rank,
        book.title,
        book.author,
        book.category,
        book.issued,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SmartLib-Top-Books-Report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
              DEMO
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Insights into borrowing trends, inventory and student activity.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700"
        >
          <Download size={17} />
          Export Top Books CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          const iconStyles = {
            violet: "bg-violet-100 text-violet-600",
            emerald: "bg-emerald-100 text-emerald-600",
            blue: "bg-blue-100 text-blue-600",
            amber: "bg-amber-100 text-amber-600",
          };

          return (
            <div key={card.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${iconStyles[card.color]}`}>
                  <Icon size={21} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${card.positive ? "text-emerald-600" : "text-rose-500"}`}>
                  {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.trend}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">{card.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">{card.value}</h2>
              <p className="mt-1 text-xs text-slate-400">{card.note}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Chart */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Monthly Borrowing Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Issued vs returned books over 6 months</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Issued</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Returned</span>
          </div>
        </div>

        <div className="mt-8 flex h-64 items-end justify-between gap-3 border-b border-slate-100 pb-2">
          {monthlyData.map((item) => (
            <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="flex h-full w-full items-end justify-center gap-1.5">
                <div
                  title={`Issued: ${item.issued}`}
                  style={{ height: `${item.issued}%` }}
                  className="w-[40%] max-w-10 rounded-t-md bg-violet-500 transition hover:bg-violet-600"
                />
                <div
                  title={`Returned: ${item.returned}`}
                  style={{ height: `${item.returned}%` }}
                  className="w-[40%] max-w-10 rounded-t-md bg-emerald-400 transition hover:bg-emerald-500"
                />
              </div>
              <span className="text-xs text-slate-400">{item.month}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">Sample monthly activity data</p>
      </div>

      {/* Categories and Top Books */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Categories */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <PieChart size={19} className="text-violet-600" />
            <h2 className="font-bold text-slate-800">Books by Category</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Collection distribution overview</p>

          <div className="mt-6 space-y-5">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{cat.name}</span>
                  <span className="text-xs font-semibold text-slate-700">{cat.count} <span className="text-slate-400">({cat.percentage}%)</span></span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Books */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 size={19} className="text-violet-600" />
            <h2 className="font-bold text-slate-800">Most Borrowed Books</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Popular books ranked by borrow count</p>

          <div className="mt-5 space-y-4">
            {topBooks.map((book) => (
              <div key={book.rank} className="flex items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${book.rank === 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                  {book.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">{book.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">{book.issued}</p>
                  <p className="text-[10px] text-slate-400">borrows</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Activity */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-5">
          <h2 className="font-bold text-slate-800">Student Borrowing Activity</h2>
          <p className="mt-1 text-sm text-slate-500">Top active students in the library</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Course</th>
                <th className="px-5 py-3 font-semibold">Borrowed</th>
                <th className="px-5 py-3 font-semibold">Returned</th>
                <th className="px-5 py-3 font-semibold">Return Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentActivity.map((student) => {
                const rate = Math.round((student.returned / student.borrowed) * 100);
                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">{student.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{student.id}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{student.course}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{student.borrowed}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{student.returned}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-500">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-4 text-center text-xs text-slate-400">
          Sample analytics · Live reporting integration pending
        </div>
      </div>
    </div>
  );
}
