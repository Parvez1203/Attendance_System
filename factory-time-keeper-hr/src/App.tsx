
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import AttendanceHistory from "./pages/AttendanceHistory";
import SalaryManagement from "./pages/SalaryManagement";
import DailyReports from "./pages/DailyReports";
import MonthlyReports from "./pages/MonthlyReports";
import EmployeeReports from "./pages/EmployeeReports";
import NotFound from "./pages/NotFound";
import AttendanceReview from "./pages/AttendanceReview";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/employees/add" element={<AddEmployee />} />
                    <Route path="/employees/edit/:id" element={<EditEmployee />} />
                    <Route path="/attendance/history" element={<AttendanceHistory />} />
                    <Route path="/attendance/review" element={<AttendanceReview />} />
                    <Route path="/salary-management" element={<SalaryManagement />} />
                    <Route path="/reports/daily" element={<DailyReports />} />
                    <Route path="/reports/monthly" element={<MonthlyReports />} />
                    <Route path="/reports/employee" element={<EmployeeReports />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
