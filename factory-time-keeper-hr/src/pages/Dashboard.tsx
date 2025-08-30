import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";  // Importing Loader for the loading spinner

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Loader state
  const [error, setError] = useState(null);  // Error state
  const [todayAttendance, setTodayAttendance] = useState([]);

  // Fetch employee data from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://ju57aw1d9g.execute-api.ap-south-1.amazonaws.com/get-employees-list"
        );
        const data = await response.json();
        if (response.ok && data.employees) {
          setEmployees(data.employees);
        } else {
          setError("Failed to fetch employees.");
        }
      } catch (error) {
        setError("Error fetching employee data.");
      } finally {
        setIsLoading(false);  // Stop loading when data is fetched
      }
    };

    fetchEmployees();
  }, []);

  // Simulate fetching today's attendance data
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://ju57aw1d9g.execute-api.ap-south-1.amazonaws.com/get-monthly-review-list?month=01&year=2024"
        );
        const data = await response.json();
        if (data.success && data.records) {
          setTodayAttendance(data.records);
        }
      } catch (error) {
        setError("Error fetching today's attendance data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAttendance();
  }, []);

  const handleRefresh = () => {
    console.log("Refreshing attendance data...");
    setIsLoading(true);
    // Re-fetch employee data and attendance data here
    // fetchEmployees();
    // fetchTodayAttendance();
  };

  const handleExport = () => {
    const headers = ['Employee Name', 'Employee Code', 'Department', 'Check In Time', 'Status'];
    const csvData = employees.map((employee) => {
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
        {/* Render stat cards */}
        {/* The stat cards remain the same as in your code */}
      </div>

      {/* Today's Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Today's Attendance</CardTitle>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : (
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
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => {
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
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
