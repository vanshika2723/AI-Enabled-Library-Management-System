import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Students from "./pages/Students";
import BorrowManagement from "./pages/BorrowManagement";
import ReturnsOverdue from "./pages/ReturnsOverdue";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/students" element={<Students />} />
          <Route path="/borrow-management" element={<BorrowManagement />} />
          <Route path="/returns-overdue" element={<ReturnsOverdue />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;