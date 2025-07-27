
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, DollarSign, Calendar } from "lucide-react";
import mockData from "@/data/mockData.json";

const Dashboard = () => {
  const totalWorkers = mockData.workers.length;
  const activeWorkers = mockData.workers.filter(w => w.status === "active").length;
  const pendingReviews = mockData.salaryReviews.filter(s => s.status === "pending").length;
  const todayAttendance = mockData.attendance.filter(a => a.date === "2024-06-01").length;

  const recentAttendance = mockData.attendance.slice(0, 5).map(att => {
    const worker = mockData.workers.find(w => w.id === att.workerId);
    return { ...att, workerName: worker?.name || "Unknown" };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkers}</div>
            <p className="text-xs text-muted-foreground">
              {activeWorkers} active workers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalWorkers} workers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Salary reviews pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Working Hours</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8</div>
            <p className="text-xs text-muted-foreground">
              Hours per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAttendance.map((att, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{att.workerName}</p>
                    <p className="text-sm text-gray-500">{att.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={att.status === "present" ? "default" : "destructive"}>
                    {att.status}
                  </Badge>
                  {att.status === "present" && (
                    <p className="text-sm text-gray-500 mt-1">{att.totalWorkingHours}h</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
