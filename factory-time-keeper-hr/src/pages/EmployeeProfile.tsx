
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Phone, Calendar, Clock, DollarSign } from "lucide-react";
import data from "@/data/data.json";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = data.employees.find(e => e.employee_id === id);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  // Get attendance data for this employee
  const employeeAttendance = data.attendance.filter(a => a.employee_id === id);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthAttendance = employeeAttendance.filter(a => {
    const attendanceDate = new Date(a.attendance_date);
    return attendanceDate.getMonth() + 1 === currentMonth && attendanceDate.getFullYear() === currentYear;
  });

  const presentDays = currentMonthAttendance.filter(a => a.status === "present").length;
  const absentDays = currentMonthAttendance.filter(a => a.status === "absent").length;
  const lateDays = currentMonthAttendance.filter(a => a.status === "late").length;

  // Get recent attendance (last 7 days)
  const recentAttendance = employeeAttendance.slice(-7);

  // Get pending requests
  const pendingRequests = data.reason_requests.filter(r => 
    r.employee_id === id && r.status === "pending"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
          <p className="text-gray-600">{employee.employee_name}</p>
        </div>
        <Button onClick={() => navigate(`/employees/edit/${id}`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Employee
        </Button>
      </div>

      {/* Employee Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={employee.photo} />
              <AvatarFallback>
                {employee.employee_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Employee Code</label>
                <p className="text-lg font-semibold">{employee.employee_code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                    {employee.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="font-medium">{employee.dept}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Job Role</label>
                <p className="font-medium">{employee.job_role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Monthly Salary</label>
                  <p className="font-medium">₹{employee.monthly_salary.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Joining Date</label>
                  <p className="font-medium">{new Date(employee.joining_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Shift Timing</label>
                  <p className="font-medium">{employee.shift_in} - {employee.shift_out}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-green-600">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentDays}</div>
            <p className="text-sm text-gray-500">Current Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-red-600">Absent Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentDays}</div>
            <p className="text-sm text-gray-500">Current Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-yellow-600">Late Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateDays}</div>
            <p className="text-sm text-gray-500">Current Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAttendance.length > 0 ? (
              recentAttendance.map((attendance) => (
                <div key={attendance.record_id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{new Date(attendance.attendance_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">
                      {attendance.check_in_time} - {attendance.check_out_time || 'Not checked out'}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      attendance.status === "present" ? "default" :
                      attendance.status === "late" ? "secondary" : 
                      "destructive"
                    }>
                      {attendance.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      {attendance.total_working_hours || '0'} hours
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent attendance records</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Missing Hour Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.request_id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{new Date(request.attendance_date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{request.reason}</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeProfile;
