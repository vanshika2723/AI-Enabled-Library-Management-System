
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  BookMarked,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  UserPlus,
  Plus,
  Sparkles,
} from "lucide-react";

const stats = [
  {
    title: "Books Collection",
    value: "1,284",
    change: "+12 this month",
    icon: BookOpen,
    color: "blue",
    path: "/books",
  },
  {
    title: "Registered Students",
    value: "562",
    change: "+24 this month",
    icon: Users,
    color: "violet",
    path: "/students",
  },
  {
    title: "Books Issued",
    value: "86",
    change: "Currently borrowed",
    icon: BookMarked,
    color: "emerald",
    path: "/borrow-management",
  },
  {
    title: "Overdue Returns",
    value: "20",
    change: "Needs attention",
    icon: AlertTriangle,
    color: "rose",
    path: "/returns-overdue",
  },
];

const weeklyActivity = [
  { day: "Mon", issued: 35, returned: 20 },
  { day: "Tue", issued: 48, returned: 32 },
  { day: "Wed", issued: 28, returned: 40 },
  { day: "Thu", issued: 62, returned: 38 },
  { day: "Fri", issued: 45, returned: 30 },
  { day: "Sat", issued: 70, returned: 48 },
  { day: "Sun", issued: 38, returned: 25 },
];

const recentActivities = [
  {
    title: "Book issued successfully",
    detail: "Rahul Sharma borrowed Atomic Habits",
    time: "10 minutes ago",
    icon: BookMarked,
    color: "emerald",
  },
  {
    title: "New student registered",
    detail: "Priya Verma joined the library",
    time: "35 minutes ago",
    icon: UserPlus,
    color: "blue",
  },
  {
    title: "Book returned",
    detail: "Clean Code was returned by Aman Gupta",
    time: "1 hour ago",
    icon: CheckCircle2,
    color: "violet",
  },
  {
    title: "Overdue reminder",
    detail: "20 books are pending return",
    time: "2 hours ago",
    icon: AlertTriangle,
    color: "rose",
  },
];

const colorStyles = {
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    text: "text-blue-600",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    text: "text-violet-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-600",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100 text-rose-600",
    text: "text-rose-600",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Dashboard
            </h1>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
              DEMO DATA
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's what's happening in your library today.
          </p>
        </div>

        <button
          onClick={() => navigate("/borrow-management")}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
        >
          <Plus size={18} />
          Issue a Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const style = colorStyles[stat.color];

          return (
            <button
              key={stat.title}
              onClick={() => navigate(stat.path)}
              className="group rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${style.icon}`}>
                  <Icon size={21} />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 transition group-hover:text-violet-600"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-500">
                {stat.title}
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
                {stat.value}
              </h2>
              <p className={`mt-2 text-xs font-medium ${style.text}`}>
                {stat.change}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chart + Activities */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Weekly Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Weekly Library Activity
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Books issued and returned this week
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                Issued
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Returned
              </div>
            </div>
          </div>

          <div className="mt-8 flex h-64 items-end justify-between gap-2 border-b border-slate-100 pb-2">
            {weeklyActivity.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="flex h-full w-full items-end justify-center gap-1.5">
                  <div
                    title={`Issued: ${item.issued}`}
                    style={{ height: `${item.issued}%` }}
                    className="w-[35%] max-w-7 rounded-t-md bg-violet-500 transition hover:bg-violet-600"
                  />
                  <div
                    title={`Returned: ${item.returned}`}
                    style={{ height: `${item.returned}%` }}
                    className="w-[35%] max-w-7 rounded-t-md bg-emerald-400 transition hover:bg-emerald-500"
                  />
                </div>
                <span className="text-xs text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-violet-700">
              <Sparkles size={16} />
              <span>Library activity overview</span>
            </div>
            <span className="text-xs font-semibold text-violet-600">
              Sample chart
            </span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Activity
            </h2>
            <Clock size={18} className="text-slate-400" />
          </div>

          <div className="mt-5 space-y-5">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              const style = colorStyles[activity.color];

              return (
                <div key={index} className="flex gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                  >
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      {activity.detail}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/reports")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            View Reports
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Quickly access important library sections
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Manage Books",
              description: "Add or update books",
              icon: BookOpen,
              path: "/books",
              color: "blue",
            },
            {
              title: "Manage Students",
              description: "View student directory",
              icon: Users,
              path: "/students",
              color: "violet",
            },
            {
              title: "Borrow Management",
              description: "Issue and track books",
              icon: BookMarked,
              path: "/borrow-management",
              color: "emerald",
            },
            {
              title: "Overdue Books",
              description: "Review pending returns",
              icon: AlertTriangle,
              path: "/returns-overdue",
              color: "rose",
            },
          ].map((action) => {
            const Icon = action.icon;
            const style = colorStyles[action.color];

            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/50"
              >
                <div className={`rounded-xl p-3 ${style.icon}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700">
                    {action.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        SmartLib AI · Dashboard preview with demo data
      </p>
    </div>
  );
}
