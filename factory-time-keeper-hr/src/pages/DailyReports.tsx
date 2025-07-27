
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Filter } from "lucide-react";

const DailyReports = () => {
  const [selectedDate, setSelectedDate] = useState("2024-06-01");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Mock daily report data
  const dailyReportData = [
    {
      workerId: "W001",
      workerName: "Rajesh Kumar",
      department: "Assembly",
      checkIn: "08:00",
      checkOut: "17:00",
      totalHours: 8,
      status: "present",
      overtime: 0
    },
    {
      workerId: "W002",
      workerName: "Priya Sharma",
      department: "Quality Control",
      checkIn: "16:00",
      checkOut: "00:00",
      totalHours: 8,
      status: "present",
      overtime: 0
    },
    {
      workerId: "W003",
      workerName: "Amit Singh",
      department: "Packaging",
      checkIn: "-",
      checkOut: "-",
      totalHours: 0,
      status: "absent",
      overtime: 0
    },
    {
      workerId: "W004",
      workerName: "Sunita Devi",
      department: "Assembly",
      checkIn: "08:15",
      checkOut: "16:45",
      totalHours: 7.5,
      status: "present",
      overtime: 0
    }
  ];

  const departments = ["Assembly", "Quality Control", "Packaging"];

  const filteredReports = dailyReportData.filter(report => 
    selectedDepartment === "all" || report.department === selectedDepartment
  );

  const exportToCSV = () => {
    const headers = ['Worker Name', 'Department', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Overtime'];
    const csvData = filteredReports.map(report => [
      report.workerName,
      report.department,
      report.checkIn,
      report.checkOut,
      report.totalHours,
      report.status,
      report.overtime
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `daily_report_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = {
    totalEmployees: dailyReportData.length,
    present: dailyReportData.filter(r => r.status === 'present').length,
    absent: dailyReportData.filter(r => r.status === 'absent').length,
    totalHours: dailyReportData.reduce((sum, r) => sum + r.totalHours, 0)
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Reports</h1>
          <p className="text-gray-600">Generate and view daily attendance reports</p>
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
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
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
            <div className="text-2xl font-bold text-green-600">{summary.present}</div>
            <p className="text-sm text-gray-500">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{summary.absent}</div>
            <p className="text-sm text-gray-500">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{summary.totalHours}</div>
            <p className="text-sm text-gray-500">Total Hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Report - {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.workerId}>
                    <TableCell className="font-medium">{report.workerName}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell>{report.checkIn}</TableCell>
                    <TableCell>{report.checkOut}</TableCell>
                    <TableCell>{report.totalHours}h</TableCell>
                    <TableCell>
                      <Badge variant={
                        report.status === "present" ? "default" :
                        report.status === "absent" ? "destructive" :
                        "secondary"
                      }>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.overtime}h</TableCell>
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

export default DailyReports;
