import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";

const MonthlyReports = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-06");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock monthly report data
  const monthlyReportData = [
    {
      workerId: "W001",
      workerName: "Rajesh Kumar",
      department: "Assembly",
      totalDays: 26,
      presentDays: 24,
      absentDays: 2,
      halfDays: 1,
      totalHours: 188,
      overtime: 8,
      attendanceRate: 92.3
    },
    {
      workerId: "W002",
      workerName: "Priya Sharma",
      department: "Quality Control",
      totalDays: 26,
      presentDays: 26,
      absentDays: 0,
      halfDays: 0,
      totalHours: 208,
      overtime: 12,
      attendanceRate: 100
    },
    {
      workerId: "W003",
      workerName: "Amit Singh",
      department: "Packaging",
      totalDays: 26,
      presentDays: 20,
      absentDays: 6,
      halfDays: 2,
      totalHours: 156,
      overtime: 4,
      attendanceRate: 76.9
    },
    {
      workerId: "W004",
      workerName: "Sunita Devi",
      department: "Assembly",
      totalDays: 26,
      presentDays: 25,
      absentDays: 1,
      halfDays: 0,
      totalHours: 198,
      overtime: 6,
      attendanceRate: 96.2
    }
  ];

  const departments = ["Assembly", "Quality Control", "Packaging"];

  const filteredReports = monthlyReportData.filter(report => 
    selectedDepartment === "all" || report.department === selectedDepartment
  );

  const exportToCSV = () => {
    const headers = ['Worker Name', 'Department', 'Total Days', 'Present Days', 'Absent Days', 'Half Days', 'Total Hours', 'Overtime', 'Attendance Rate'];
    const csvData = filteredReports.map(report => [
      report.workerName,
      report.department,
      report.totalDays,
      report.presentDays,
      report.absentDays,
      report.halfDays,
      report.totalHours,
      report.overtime,
      report.attendanceRate + '%'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly_report_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = {
    totalEmployees: monthlyReportData.length,
    avgAttendance: (monthlyReportData.reduce((sum, r) => sum + r.attendanceRate, 0) / monthlyReportData.length).toFixed(1),
    totalHours: monthlyReportData.reduce((sum, r) => sum + r.totalHours, 0),
    totalOvertime: monthlyReportData.reduce((sum, r) => sum + r.overtime, 0)
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
          <p className="text-gray-600">Generate and view monthly attendance reports</p>
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
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{summary.totalEmployees}</div>
            <p className="text-sm text-gray-500">Total Employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{summary.avgAttendance}%</div>
            <p className="text-sm text-gray-500">Avg Attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{summary.totalHours}</div>
            <p className="text-sm text-gray-500">Total Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{summary.totalOvertime}</div>
            <p className="text-sm text-gray-500">Total Overtime</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Summary - {selectedMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Absent Days</TableHead>
                  <TableHead>Half Days</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.workerId}>
                    <TableCell className="font-medium">{report.workerName}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell className="text-green-600">{report.presentDays}</TableCell>
                    <TableCell className="text-red-600">{report.absentDays}</TableCell>
                    <TableCell className="text-yellow-600">{report.halfDays}</TableCell>
                    <TableCell>{report.totalHours}h</TableCell>
                    <TableCell className="text-orange-600">{report.overtime}h</TableCell>
                    <TableCell>
                      <Badge variant={
                        report.attendanceRate >= 95 ? "default" :
                        report.attendanceRate >= 80 ? "secondary" :
                        "destructive"
                      }>
                        {report.attendanceRate}%
                      </Badge>
                    </TableCell>
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

export default MonthlyReports;
