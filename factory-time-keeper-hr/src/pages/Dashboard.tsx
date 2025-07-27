
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserCheck, Clock, DollarSign, RefreshCw, Download } from "lucide-react";
import data from "@/data/data.json";

const Dashboard = () => {
  // Calculate stats from data
  const todayAttendance = data.attendance.filter(att => att.attendance_date === "2024-01-13");
  const presentToday = todayAttendance.filter(att => att.status === "present" || att.status === "late").length;
  const absentToday = todayAttendance.filter(att => att.status === "absent").length;
  const pendingRequests = data.reason_requests.filter(req => req.status === "pending").length;
  const processedSalaries = data.salary.length;

  const statCards = [
    {
      title: "Present Today",
      value: presentToday,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Absent Today", 
      value: absentToday,
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Processed Salaries",
      value: processedSalaries,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const handleRefresh = () => {
    console.log("Refreshing attendance data...");
  };

  const handleExport = () => {
    const headers = ['Employee Name', 'Employee Code', 'Department', 'Check In Time', 'Status'];
    const csvData = data.employees.map(employee => {
      const attendance = todayAttendance.find(att => att.employee_id === employee.employee_id);
      const hasLoggedIn = attendance && attendance.check_in_time;
      
      return [
        employee.employee_name,
        employee.employee_code,
        employee.dept,
        attendance?.check_in_time || '-',
        hasLoggedIn ? "Logged In" : "Not Logged In"
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of today's attendance and activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Today's Attendance</CardTitle>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.employees.map((employee) => {
                const attendance = todayAttendance.find(att => att.employee_id === employee.employee_id);
                const hasLoggedIn = attendance && attendance.check_in_time;
                
                return (
                  <TableRow key={employee.employee_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.employee_name}</div>
                        <div className="text-sm text-gray-500">{employee.employee_code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.dept}</TableCell>
                    <TableCell>{attendance?.check_in_time || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={hasLoggedIn ? "default" : "destructive"}>
                        {hasLoggedIn ? "Logged In" : "Not Logged In"}
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

export default Dashboard;
