
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Library,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const token =
        response.token ||
        response.data?.token ||
        response.accessToken ||
        response.data?.accessToken;

      if (!token) {
        throw new Error("Login token was not received from server.");
      }

      localStorage.setItem("smartlib_token", token);

      if (response.user) {
        localStorage.setItem("smartlib_user", JSON.stringify(response.user));
      } else if (response.data?.user) {
        localStorage.setItem(
          "smartlib_user",
          JSON.stringify(response.data.user)
        );
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* Left Branding */}
        <div className="hidden md:flex bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-12 flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-3 rounded-xl">
              <Library size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SmartLib AI</h1>
              <p className="text-indigo-100 text-sm">
                Intelligent Library Management
              </p>
            </div>
          </div>

          <div>
            <BookOpen size={55} className="mb-6 text-indigo-200" />
            <h2 className="text-3xl font-bold leading-snug mb-4">
              Your library.
              <br />
              Smarter than ever.
            </h2>
            <p className="text-indigo-100 leading-relaxed">
              Manage books, students, borrowing, returns and library analytics
              with one intelligent platform.
            </p>
          </div>

          <p className="text-indigo-200 text-sm">
            © 2026 SmartLib AI · Smart Library Workspace
          </p>
        </div>

        {/* Login Form */}
        <div className="p-7 sm:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-3 rounded-xl text-white">
              <Library size={25} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800">
                SmartLib AI
              </h1>
              <p className="text-xs text-slate-500">Library Management System</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-indigo-600 font-semibold mb-2">
              WELCOME BACK
            </p>
            <h2 className="text-3xl font-bold text-slate-800">
              Sign in to your account
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-100"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Secure authentication powered by SmartLib AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
