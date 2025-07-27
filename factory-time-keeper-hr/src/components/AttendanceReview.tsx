
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Download, Search, Filter } from "lucide-react";
import mockData from "@/data/mockData.json";

const AttendanceReview = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-06");
  const [notes, setNotes] = useState({});
  const [statuses, setStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const calculateWorkingHours = (entries) => {
    let totalMinutes = 0;
    let lastInTime = null;

    entries.forEach(entry => {
      if (entry.type === "in") {
        lastInTime = entry.time;
      } else if (entry.type === "out" && lastInTime) {
        const inTime = new Date(`1970-01-01T${lastInTime}:00`);
        const outTime = new Date(`1970-01-01T${entry.time}:00`);
        const diffMinutes = (outTime.getTime() - inTime.getTime()) / (1000 * 60);
        totalMinutes += diffMinutes;
        lastInTime = null;
      }
    });

    return (totalMinutes / 60).toFixed(1);
  };

  const attendanceData = useMemo(() => {
    const baseData = mockData.attendance.map(att => {
      const worker = mockData.workers.find(w => w.id === att.workerId);
      const calculatedHours = calculateWorkingHours(att.entries);
      
      return { 
        ...att, 
        workerName: worker?.name || "Unknown", 
        department: worker?.department || "Unknown",
        calculatedHours: calculatedHours
      };
    });

    // Apply filters
    let filteredData = baseData.filter(record => {
      const matchesSearch = record.workerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;
      const currentStatus = statuses[`${record.workerId}-${record.date}`] || "";
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "unselected" && !currentStatus) ||
        currentStatus === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Apply sorting
    filteredData.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.workerName.localeCompare(b.workerName);
        case "department":
          return a.department.localeCompare(b.department);
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "hours":
          return parseFloat(b.calculatedHours) - parseFloat(a.calculatedHours);
        default:
          return 0;
      }
    });

    return filteredData;
  }, [searchTerm, departmentFilter, statusFilter, sortBy, statuses]);

  const departments = [...new Set(mockData.workers.map(w => w.department))];

  const handleStatusChange = (recordId, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [recordId]: newStatus
    }));
  };

  const exportToCSV = () => {
    const headers = ['Worker', 'Department', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Notes'];
    const csvData = attendanceData.map(record => [
      record.workerName,
      record.department,
      record.date,
      record.entries.find(e => e.type === 'in')?.time || '',
      record.entries.find(e => e.type === 'out')?.time || '',
      record.calculatedHours + 'h',
      statuses[`${record.workerId}-${record.date}`] || 'Unselected',
      notes[`${record.workerId}-${record.date}`] || record.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_review_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Attendance Review</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40 sm:w-48">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-06">June 2024</SelectItem>
              <SelectItem value="2024-05">May 2024</SelectItem>
              <SelectItem value="2024-04">April 2024</SelectItem>
            </SelectContent>
          </Select>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unselected">Unselected</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="half_day">Half Day</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="paid_leave">Paid Leave/Holiday</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="department">Sort by Department</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="hours">Sort by Hours</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("all");
                setStatusFilter("all");
                setSortBy("name");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {attendanceData.filter(r => statuses[`${r.workerId}-${r.date}`] === "present").length}
            </div>
            <p className="text-xs md:text-sm text-gray-500">Marked Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {attendanceData.filter(r => statuses[`${r.workerId}-${r.date}`] === "absent").length}
            </div>
            <p className="text-xs md:text-sm text-gray-500">Marked Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {attendanceData.filter(r => statuses[`${r.workerId}-${r.date}`] === "half_day").length}
            </div>
            <p className="text-xs md:text-sm text-gray-500">Half Day</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xl md:text-2xl font-bold text-gray-600">
              {attendanceData.filter(r => !statuses[`${r.workerId}-${r.date}`]).length}
            </div>
            <p className="text-xs md:text-sm text-gray-500">Unselected</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Records ({attendanceData.length} records)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Worker</TableHead>
                  <TableHead className="min-w-[100px]">Department</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[200px]">Entry Log</TableHead>
                  <TableHead className="min-w-[80px]">Hours</TableHead>
                  <TableHead className="min-w-[150px]">Status</TableHead>
                  <TableHead className="min-w-[200px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.workerName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      {record.entries.length > 0 ? (
                        <div className="space-y-1">
                          {record.entries.map((entry, entryIndex) => (
                            <div key={entryIndex} className="flex items-center space-x-2 text-xs">
                              <span className="font-mono">{entry.time}</span>
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-500">{entry.type === 'in' ? 'In' : 'Out'}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No entries</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{record.calculatedHours}h</span>
                        {record.totalWorkingHours !== parseFloat(record.calculatedHours) && (
                          <span className="text-xs text-gray-500">
                            (Expected: {record.totalWorkingHours}h)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={statuses[`${record.workerId}-${record.date}`] || ""}
                        onValueChange={(value) => handleStatusChange(`${record.workerId}-${record.date}`, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="half_day">Half Day</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="paid_leave">Paid Leave/Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                      {!statuses[`${record.workerId}-${record.date}`] && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Unselected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Textarea
                        placeholder="Add notes..."
                        value={notes[`${record.workerId}-${record.date}`] || record.notes || ''}
                        onChange={(e) => setNotes({
                          ...notes,
                          [`${record.workerId}-${record.date}`]: e.target.value
                        })}
                        className="min-h-[60px] text-xs w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-600">Review completed for {selectedMonth}</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Save Changes</Button>
              <Button size="sm">Submit for Salary Processing</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReview;
