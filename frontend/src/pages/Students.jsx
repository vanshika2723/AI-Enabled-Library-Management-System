
import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Mail,
  Phone,
  Eye,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  X,
  Building2,
  Hash,
} from "lucide-react";
import api from "../utils/api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
const [editingStudent, setEditingStudent] = useState(null);
const [savingEdit, setSavingEdit] = useState(false);
const [editError, setEditError] = useState("");

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deletingStudent, setDeletingStudent] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);
const [deleteError, setDeleteError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [formError, setFormError] = useState("");

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    phone: "",
    department: "",
  });

  // Fetch students from backend
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api("/students");
      const studentList = response.students || response.data?.students || [];

      const formattedStudents = studentList.map((student) => ({
        id: student.studentId || student._id,
        mongoId: student._id,
        name: student.name || "Unknown",
        email: student.email || "",
        phone: student.phone || "Not provided",
        course: student.department || "Not assigned",
        year: "Not provided",
        issued: 0,
        status: student.isActive ? "Active" : "Inactive",
        joined: student.createdAt,
      }));

      setStudents(formattedStudents);
    } catch (err) {
      setError(err.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  // Handle student registration
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      setSavingStudent(true);

      const response = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(studentForm),
      });

      if (!response.success) {
        throw new Error(response.message || "Registration failed.");
      }

      setStudentForm({
        name: "",
        email: "",
        password: "",
        studentId: "",
        phone: "",
        department: "",
      });

      setShowAddModal(false);
      await loadStudents();
    } catch (err) {
      setFormError(err.message || "Failed to register student.");
    } finally {
      setSavingStudent(false);
    }
  };
const handleEditStudent = async (e) => {
  e.preventDefault();
  setEditError("");

  try {
    setSavingEdit(true);

    const response = await api(`/students/${editingStudent.mongoId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        studentId: editingStudent.studentId,
        department: editingStudent.department,
      }),
    });

    if (!response.success) {
      throw new Error(response.message || "Failed to update student.");
    }

    setShowEditModal(false);
    setEditingStudent(null);
    await loadStudents();
  } catch (err) {
    setEditError(err.message || "Failed to update student.");
  } finally {
    setSavingEdit(false);
  }
};

const handleDeleteStudent = async () => {
  if (!deletingStudent) return;

  try {
    setDeleteLoading(true);
    setDeleteError("");

    const response = await api(`/students/${deletingStudent.mongoId}`, {
      method: "DELETE",
    });

    if (!response.success) {
      throw new Error(response.message || "Failed to delete student.");
    }

    setShowDeleteModal(false);
    setDeletingStudent(null);

    await loadStudents();
  } catch (err) {
    setDeleteError(err.message || "Failed to delete student.");
  } finally {
    setDeleteLoading(false);
  }
};
  useEffect(() => {
    loadStudents();
  }, []);

  // Search and filter
  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      String(student.id).toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query) ||
      student.phone.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const departments = new Set(
    students
      .map((student) => student.course)
      .filter((department) => department !== "Not assigned")
  ).size;

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "violet",
    },
    {
      title: "Active Members",
      value: activeStudents,
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      title: "Inactive Members",
      value: inactiveStudents,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Departments",
      value: departments,
      icon: GraduationCap,
      color: "amber",
    },
  ];

  const styles = {
    violet: "bg-violet-100 text-violet-600",
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Students
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage student profiles, membership and borrowing activity.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadStudents}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => {
              setFormError("");
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700"
          >
            <UserPlus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="mt-0.5 text-rose-500" size={20} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-700">
              Failed to load students
            </p>
            <p className="mt-1 text-sm text-rose-600">{error}</p>
            <button
              onClick={loadStudents}
              className="mt-2 text-sm font-semibold text-rose-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${styles[stat.color]}`}
              >
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

      {/* Student Directory */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-800">Student Directory</h2>
          <p className="mt-1 text-sm text-slate-500">
            View registered students from the database.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, student ID or department..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400 sm:w-44"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Student ID</th>
                <th className="px-5 py-4 font-semibold">Department</th>
                <th className="px-5 py-4 font-semibold">Year</th>
                <th className="px-5 py-4 font-semibold">Books Issued</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <RefreshCw
                      size={26}
                      className="mx-auto animate-spin text-violet-500"
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      Loading students from database...
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.mongoId}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {student.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <Mail size={12} />
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      {student.id}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {student.course}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-400">
                      {student.year}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        Not connected
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          student.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            student.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {student.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        title="View student"
                        onClick={() => setSelectedStudent(student)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={16} />
                      </button>
                      <button
  title="Edit student"
  onClick={() => {
    setEditError("");
    setEditingStudent({
      ...student,
      studentId: student.id === student.mongoId ? "" : student.id,
      department: student.course === "Not assigned" ? "" : student.course,
    });
    setShowEditModal(true);
  }}
  className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
>
  <Pencil size={16} />
</button>

<button
  title="Delete student"
  onClick={() => {
    setDeleteError("");
    setDeletingStudent(student);
    setShowDeleteModal(true);
  }}
  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
>
  <Trash2 size={16} />
</button>
                    </td>

                    
                  </tr>
                ))
              )}

              {!loading && !error && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <AlertCircle size={30} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      No students found.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try another search or register a student.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {students.length}
              </span>{" "}
              students
            </p>
            <p className="text-xs text-slate-400">Live database · MongoDB</p>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-800">Student Details</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    {selectedStudent.name}
                  </h3>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      selectedStudent.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash size={17} className="mt-0.5 text-violet-500" />
                  <div>
                    <p className="text-xs text-slate-400">Student ID</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedStudent.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={17} className="mt-0.5 text-violet-500" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={17} className="mt-0.5 text-violet-500" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedStudent.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 size={17} className="mt-0.5 text-violet-500" />
                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {selectedStudent.course}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Add New Student
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Register a student in the library.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!savingStudent) setShowAddModal(false);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleAddStudent} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Enter student full name"
                  value={studentForm.name}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={studentForm.email}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={studentForm.password}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STU102"
                    value={studentForm.studentId}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        studentId: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={studentForm.phone}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department
                </label>
                <select
                  value={studentForm.department}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      department: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Select department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="MBA">MBA</option>
                  <option value="BCA">BCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Form Error */}
              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <AlertCircle size={17} className="mt-0.5 shrink-0 text-rose-500" />
                  <p className="text-sm text-rose-600">{formError}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={savingStudent}
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingStudent}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-100 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingStudent ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Register Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
{showEditModal && editingStudent && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Edit Student</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update student profile details.
          </p>
        </div>
        <button
          type="button"
          disabled={savingEdit}
          onClick={() => {
            setShowEditModal(false);
            setEditingStudent(null);
          }}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleEditStudent} className="space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={editingStudent.name}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, name: e.target.value })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email *
          </label>
          <input
            type="email"
            required
            value={editingStudent.email}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, email: e.target.value })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Student ID
            </label>
            <input
              type="text"
              value={editingStudent.studentId}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  studentId: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              type="tel"
              value={editingStudent.phone === "Not provided" ? "" : editingStudent.phone}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  phone: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Department
          </label>
          <select
            value={editingStudent.department}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                department: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            <option value="">Select department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="MBA">MBA</option>
            <option value="BCA">BCA</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {editError && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-rose-500" />
            <p className="text-sm text-rose-600">{editError}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={savingEdit}
            onClick={() => {
              setShowEditModal(false);
              setEditingStudent(null);
            }}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={savingEdit}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {savingEdit ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Pencil size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Delete Student Confirmation Modal */}
{showDeleteModal && deletingStudent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <Trash2 size={26} />
      </div>

      <h2 className="text-xl font-bold text-slate-800">
        Delete Student?
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-800">
          {deletingStudent.name}
        </span>
        ? This action cannot be undone.
      </p>

      {deleteError && (
        <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          {deleteError}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          disabled={deleteLoading}
          onClick={() => {
            setShowDeleteModal(false);
            setDeletingStudent(null);
            setDeleteError("");
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          disabled={deleteLoading}
          onClick={handleDeleteStudent}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {deleteLoading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Delete Student
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
