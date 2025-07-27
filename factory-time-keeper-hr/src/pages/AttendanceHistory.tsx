
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Calendar, Filter } from "lucide-react";
import data from "@/data/data.json";

const AttendanceHistory = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredAttendance = data.attendance.filter(attendance => {
    const employee = data.employees.find(e => e.employee_id === attendance.employee_id);
    if (!employee) return false;

    const matchesDateRange = (!startDate || attendance.attendance_date >= startDate) &&
                            (!endDate || attendance.attendance_date <= endDate);
    const matchesEmployee = !selectedEmployee || attendance.employee_id === selectedEmployee;
    const matchesDept = !selectedDept || employee.dept === selectedDept;
    const matchesStatus = !selectedStatus || attendance.status === selectedStatus;

    return matchesDateRange && matchesEmployee && matchesDept && matchesStatus;
  });

  const departments = [...new Set(data.employees.map(emp => emp.dept))];
  const statuses = ["present", "absent", "late", "half_day"];

  const getEmployee = (employeeId: string) => {
    return data.employees.find(e => e.employee_id === employeeId);
  };

  const handleExport = () => {
    console.log("Exporting attendance history...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance History</h1>
          <p className="text-gray-600">View historical attendance records</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">All Employees</option>
                {data.employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records ({filteredAttendance.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((attendance) => {
                const employee = getEmployee(attendance.employee_id);
                return (
                  <TableRow key={attendance.record_id}>
                    <TableCell>{new Date(attendance.attendance_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee?.employee_name}</div>
                        <div className="text-sm text-gray-500">{employee?.employee_code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{employee?.dept}</TableCell>
                    <TableCell>{attendance.check_in_time || '-'}</TableCell>
                    <TableCell>{attendance.check_out_time || '-'}</TableCell>
                    <TableCell>{attendance.total_working_hours || 0} hrs</TableCell>
                    <TableCell>
                      <Badge variant={
                        attendance.status === "present" ? "default" :
                        attendance.status === "late" ? "secondary" :
                        attendance.status === "half_day" ? "outline" :
                        "destructive"
                      }>
                        {attendance.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
