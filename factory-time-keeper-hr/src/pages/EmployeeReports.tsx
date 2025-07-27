
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, User } from "lucide-react";

const EmployeeReports = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("W001");
  const [selectedMonth, setSelectedMonth] = useState("2024-06");

  // Mock employee data
  const employees = [
    { id: "W001", name: "Rajesh Kumar", department: "Assembly" },
    { id: "W002", name: "Priya Sharma", department: "Quality Control" },
    { id: "W003", name: "Amit Singh", department: "Packaging" },
    { id: "W004", name: "Sunita Devi", department: "Assembly" }
  ];

  // Mock employee detailed report data
  const employeeReportData = {
    "W001": [
      { date: "2024-06-01", checkIn: "08:00", checkOut: "17:00", hours: 8, status: "present", overtime: 0 },
      { date: "2024-06-02", checkIn: "08:15", checkOut: "16:45", hours: 7.5, status: "present", overtime: 0 },
      { date: "2024-06-03", checkIn: "08:00", checkOut: "17:30", hours: 8.5, status: "present", overtime: 0.5 },
      { date: "2024-06-04", checkIn: "-", checkOut: "-", hours: 0, status: "absent", overtime: 0 },
      { date: "2024-06-05", checkIn: "08:00", checkOut: "13:00", hours: 4, status: "half_day", overtime: 0 }
    ],
    "W002": [
      { date: "2024-06-01", checkIn: "16:00", checkOut: "00:00", hours: 8, status: "present", overtime: 0 },
      { date: "2024-06-02", checkIn: "16:00", checkOut: "00:30", hours: 8.5, status: "present", overtime: 0.5 },
      { date: "2024-06-03", checkIn: "16:00", checkOut: "00:00", hours: 8, status: "present", overtime: 0 },
      { date: "2024-06-04", checkIn: "16:00", checkOut: "00:00", hours: 8, status: "present", overtime: 0 },
      { date: "2024-06-05", checkIn: "16:00", checkOut: "00:15", hours: 8.25, status: "present", overtime: 0.25 }
    ]
  };

  const currentEmployee = employees.find(emp => emp.id === selectedEmployee);
  const reportData = employeeReportData[selectedEmployee] || [];

  const exportToCSV = () => {
    const headers = ['Date', 'Check In', 'Check Out', 'Hours', 'Status', 'Overtime'];
    const csvData = reportData.map(record => [
      record.date,
      record.checkIn,
      record.checkOut,
      record.hours,
      record.status,
      record.overtime
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_report_${selectedEmployee}_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = {
    totalDays: reportData.length,
    presentDays: reportData.filter(r => r.status === 'present').length,
    absentDays: reportData.filter(r => r.status === 'absent').length,
    halfDays: reportData.filter(r => r.status === 'half_day').length,
    totalHours: reportData.reduce((sum, r) => sum + r.hours, 0),
    totalOvertime: reportData.reduce((sum, r) => sum + r.overtime, 0)
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Reports</h1>
          <p className="text-gray-600">Generate individual employee reports</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-06">June 2024</SelectItem>
                  <SelectItem value="2024-05">May 2024</SelectItem>
                  <SelectItem value="2024-04">April 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Info */}
      {currentEmployee && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <User className="h-12 w-12 text-gray-400" />
              <div>
                <h2 className="text-xl font-bold">{currentEmployee.name}</h2>
                <p className="text-gray-600">{currentEmployee.department}</p>
                <p className="text-sm text-gray-500">Employee ID: {currentEmployee.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold">{summary.totalDays}</div>
            <p className="text-xs text-gray-500">Total Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold text-green-600">{summary.presentDays}</div>
            <p className="text-xs text-gray-500">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold text-red-600">{summary.absentDays}</div>
            <p className="text-xs text-gray-500">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold text-yellow-600">{summary.halfDays}</div>
            <p className="text-xs text-gray-500">Half Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold text-blue-600">{summary.totalHours}</div>
            <p className="text-xs text-gray-500">Total Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl font-bold text-orange-600">{summary.totalOvertime}</div>
            <p className="text-xs text-gray-500">Overtime</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance - {currentEmployee?.name} ({selectedMonth})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.hours}h</TableCell>
                    <TableCell>
                      <Badge variant={
                        record.status === "present" ? "default" :
                        record.status === "half_day" ? "secondary" :
                        record.status === "absent" ? "destructive" :
                        "outline"
                      }>
                        {record.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-orange-600">{record.overtime}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeReports;
