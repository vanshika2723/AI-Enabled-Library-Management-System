
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-[-44px] top-4 rounded-xl bg-white p-2 text-slate-600 shadow"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-screen lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
