import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Search, Filter, Loader2 } from "lucide-react";

const AttendanceReview = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-01");
  const [notes, setNotes] = useState({});
  const [statuses, setStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [reviewData, setReviewData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // Loader state
  const [error, setError] = useState(null);  // Error state

  // Fetch review data from the API based on selected month and year
  useEffect(() => {
    const fetchReviewData = async () => {
      setIsLoading(true);
      setError(null);  // Reset error state
      try {
        const response = await fetch(
          `https://ju57aw1d9g.execute-api.ap-south-1.amazonaws.com/get-monthly-review-list?month=${selectedMonth.split('-')[1]}&year=${selectedMonth.split('-')[0]}`
        );
        const data = await response.json();
        if (response.ok && data.records) {
          setReviewData(data.records);

          // Extract departments dynamically
          const deptSet = new Set(data.records.map(record => record.employee_dept));
          setDepartments(Array.from(deptSet));
        } else {
          setError("Failed to fetch review data");
        }
      } catch (error) {
        setError("Error fetching review data");
      } finally {
        setIsLoading(false);  // Stop loading when fetch is complete
      }
    };

    fetchReviewData();
  }, [selectedMonth]);

  // Calculate working hours based on the entries (in/out times)
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

  // Filter and sort data based on the applied filters
  const attendanceData = useMemo(() => {
    const baseData = reviewData.map(att => {
      const calculatedHours = calculateWorkingHours(att.entry_log);
      
      return { 
        ...att, 
        calculatedHours,
      };
    });

    // Apply filters
    let filteredData = baseData.filter(record => {
      const matchesSearch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            record.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || record.employee_dept === departmentFilter;
      const currentStatus = statuses[`${record.employee_code}-${record.date}`] || "";
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "unselected" && !currentStatus) ||
        currentStatus === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // Apply sorting
    filteredData.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.employee_name.localeCompare(b.employee_name);
        case "department":
          return a.employee_dept.localeCompare(b.employee_dept);
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "hours":
          return parseFloat(b.calculatedHours) - parseFloat(a.calculatedHours);
        default:
          return 0;
      }
    });

    return filteredData;
  }, [searchTerm, departmentFilter, statusFilter, sortBy, statuses, reviewData]);

  // Handle status change for a particular employee's record
  const handleStatusChange = (recordId, newStatus) => {
    setStatuses(prev => ({
      ...prev,
      [recordId]: newStatus
    }));
  };

  // Export attendance data to CSV
  const exportToCSV = () => {
    const headers = ['Employee Code', 'Employee Name', 'Department', 'Date', 'Check In', 'Check Out', 'Total Hours', 'Status', 'Notes'];
    const csvData = attendanceData.map(record => [
      record.employee_code,
      record.employee_name,
      record.employee_dept,
      record.date,
      record.entry_log.find(e => e.type === 'in')?.time || '',
      record.entry_log.find(e => e.type === 'out')?.time || '',
      record.calculatedHours + 'h',
      statuses[`${record.employee_code}-${record.date}`] || 'Unselected',
      notes[`${record.employee_code}-${record.date}`] || ''
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

  // Generate the month selection options dynamically starting from 2025
  const generateMonthOptions = () => {
    const options = [];
    const startYear = 2025;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let year = startYear;

    while (year <= currentYear) {
      const startMonth = year === startYear ? 1 : 1; // Start from January of the given start year
      const endMonth = year === currentYear ? currentDate.getMonth() + 1 : 12;

      for (let month = startMonth; month <= endMonth; month++) {
        const monthString = month < 10 ? `0${month}` : `${month}`;
        options.push(`${year}-${monthString}`);
      }

      year++;
    }

    return options;
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
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-4 text-center text-red-500">
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Records ({attendanceData.length} records)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Code</TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entry Log</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.employee_code}</TableCell>
                  <TableCell>{record.employee_name}</TableCell>
                  <TableCell>{record.employee_dept}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    {record.entry_log.map((entry, entryIndex) => (
                      <div key={entryIndex} className="text-sm">
                        <span>{entry.time} ({entry.type})</span>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{record.calculatedHours} hours</TableCell>
                  <TableCell>
                    <Select
                      value={statuses[`${record.employee_code}-${record.date}`] || ""}
                      onValueChange={(value) => handleStatusChange(`${record.employee_code}-${record.date}`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="paid_leave">Paid Leave/Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      placeholder="Add notes..."
                      value={notes[`${record.employee_code}-${record.date}`] || ''}
                      onChange={(e) => setNotes({
                        ...notes,
                        [`${record.employee_code}-${record.date}`]: e.target.value
                      })}
                      className="min-h-[60px]"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReview;
