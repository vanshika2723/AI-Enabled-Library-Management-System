
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
            Welcome to SmartLib AI
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your library with ease
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search */}
        <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-36 bg-transparent pl-2 text-xs outline-none lg:w-48"
          />
          <kbd className="ml-2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            /
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
            AD
          </div>
          <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
