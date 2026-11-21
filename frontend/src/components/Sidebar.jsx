
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  Clock,
  ChartNoAxesCombined,
  Settings,
  Library,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Books", path: "/books", icon: BookOpen },
  { name: "Students", path: "/students", icon: Users },
  { name: "Borrow Management", path: "/borrow-management", icon: ArrowLeftRight },
  { name: "Returns & Overdue", path: "/returns-overdue", icon: Clock },
  { name: "Reports & Analytics", path: "/reports", icon: ChartNoAxesCombined },
];

export default function Sidebar({ onClose }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <Library size={21} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            SmartLib <span className="text-violet-600">AI</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-slate-400">
            Library Management
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-50 text-violet-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} />
                    <span>{item.name}</span>
                    {item.name === "Borrow Management" && (
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? "bg-violet-100 text-violet-700" : "bg-rose-100 text-rose-600"
                      }`}>
                        20
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings */}
        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
          System
        </p>

        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50"
            }`
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>
      </div>

      {/* AI Promo */}
      <div className="m-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={17} />
          <span className="text-sm font-semibold">SmartLib AI</span>
        </div>
        <p className="text-xs leading-5 text-violet-100">
          Smarter library management with intelligent insights.
        </p>
        <div className="mt-3 rounded-lg bg-white/15 px-3 py-2 text-[11px] font-medium">
          AI features coming soon
        </div>
      </div>

      {/* Profile */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Administrator</p>
            <p className="text-xs text-slate-500">Library Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
