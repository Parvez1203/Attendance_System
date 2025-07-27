import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Eye, Check, X, Edit, Search, Filter, Download } from "lucide-react";
import data from "@/data/data.json";

const SalaryManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [editingSalary, setEditingSalary] = useState<any>(null);
  
  // Filter states
  const [searchEmployee, setSearchEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const salaryData = data.salary.map(salary => {
    const employee = data.employees.find(e => e.employee_id === salary.employee_id);
    return { 
      ...salary, 
      employee_name: employee?.employee_name || "Unknown", 
      department: employee?.dept || "Unknown",
      employee_code: employee?.employee_code || ""
    };
  });

  // Get unique departments for filter dropdown
  const departments = [...new Set(salaryData.map(s => s.department))];

  // Filter the salary data based on current filters
  const filteredSalaryData = salaryData.filter(record => {
    const matchesSearch = record.employee_name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                         record.employee_code.toLowerCase().includes(searchEmployee.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || record.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = [
      'Employee Name',
      'Employee Code', 
      'Department',
      'Total Working Days',
      'Present Days',
      'Absent Days',
      'Half Days',
      'Late Days',
      'Total Hours',
      'Expected Hours',
      'Base Salary',
      'Deductions',
      'Bonus',
      'Final Salary',
      'Status',
      'Admin Remarks'
    ];

    const csvData = filteredSalaryData.map(record => [
      record.employee_name,
      record.employee_code,
      record.department,
      record.total_working_days,
      record.present_days,
      record.absent_days,
      record.half_days,
      record.late_days,
      record.total_hours,
      record.expected_hours,
      record.base_salary,
      record.deductions,
      record.bonus,
      record.calculated_salary,
      record.status,
      record.admin_remarks || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `salary_report_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const handleApprove = (salaryId: string, remarks: string = "") => {
    console.log("Approving salary for:", salaryId, "with remarks:", remarks);
    // Here you would update the salary status
  };

  const handleReject = (salaryId: string, remarks: string = "") => {
    console.log("Rejecting salary for:", salaryId, "with remarks:", remarks);
    // Here you would update the salary status
  };

  const handleEditSalary = (salary: any) => {
    setEditingSalary({ ...salary });
  };

  const handleSaveEdit = () => {
    console.log("Saving edited salary:", editingSalary);
    setEditingSalary(null);
  };

  const totalApproved = filteredSalaryData.filter(s => s.status === "approved").reduce((sum, s) => sum + s.calculated_salary, 0);
  const totalPending = filteredSalaryData.filter(s => s.status === "pending").reduce((sum, s) => sum + s.calculated_salary, 0);
  const pendingCount = filteredSalaryData.filter(s => s.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
              <SelectItem value="2023-11">November 2023</SelectItem>
            </SelectContent>
          </Select>
          <DollarSign className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-employee">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search-employee"
                  placeholder="Search by name or code..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filter-department">Department</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
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
            
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchEmployee || filterDepartment !== "all" || filterStatus !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredSalaryData.length} of {salaryData.length} records
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchEmployee("");
                  setFilterDepartment("all");
                  setFilterStatus("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">₹{totalApproved.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Total Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">₹{totalPending.toLocaleString()}</div>
            <p className="text-sm text-gray-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredSalaryData.length}</div>
            <p className="text-sm text-gray-500">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{pendingCount}</div>
            <p className="text-sm text-gray-500">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Salary Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Working Days</TableHead>
                <TableHead>Present/Absent/Half</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Final Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalaryData.map((record) => (
                <TableRow key={record.salary_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.employee_name}</div>
                      <div className="text-sm text-gray-500">{record.employee_code}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.total_working_days}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>Present: {record.present_days}</div>
                      <div>Absent: {record.absent_days}</div>
                      <div>Half: {record.half_days}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.total_hours}h</TableCell>
                  <TableCell>₹{record.base_salary.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">₹{record.calculated_salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Salary Review - {record.employee_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Attendance Summary</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Total Working Days: {record.total_working_days}</div>
                                  <div>Present Days: {record.present_days}</div>
                                  <div>Absent Days: {record.absent_days}</div>
                                  <div>Half Days: {record.half_days}</div>
                                  <div>Late Days: {record.late_days}</div>
                                  <div>Total Hours: {record.total_hours}h</div>
                                  <div>Expected Hours: {record.expected_hours}h</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Salary Calculation</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Base Salary: ₹{record.base_salary.toLocaleString()}</div>
                                  <div>Deductions: ₹{record.deductions.toLocaleString()}</div>
                                  <div>Bonus: ₹{record.bonus.toLocaleString()}</div>
                                  <div className="font-bold">Final Salary: ₹{record.calculated_salary.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Admin Remarks</h4>
                              <Textarea
                                defaultValue={record.admin_remarks}
                                placeholder="Add your review notes..."
                                className="min-h-[80px]"
                                id={`remarks-${record.salary_id}`}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => {
                                const remarks = (document.getElementById(`remarks-${record.salary_id}`) as HTMLTextAreaElement)?.value || "";
                                handleReject(record.salary_id, remarks);
                              }}>
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button onClick={() => {
                                const remarks = (document.getElementById(`remarks-${record.salary_id}`) as HTMLTextAreaElement)?.value || "";
                                handleApprove(record.salary_id, remarks);
                              }}>
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Salary - {record.employee_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="base-salary">Base Salary</Label>
                                <Input 
                                  id="base-salary"
                                  type="number" 
                                  defaultValue={record.base_salary}
                                />
                              </div>
                              <div>
                                <Label htmlFor="deductions">Deductions</Label>
                                <Input 
                                  id="deductions"
                                  type="number" 
                                  defaultValue={record.deductions}
                                />
                              </div>
                              <div>
                                <Label htmlFor="bonus">Bonus</Label>
                                <Input 
                                  id="bonus"
                                  type="number" 
                                  defaultValue={record.bonus}
                                />
                              </div>
                              <div>
                                <Label htmlFor="calculated-salary">Final Salary</Label>
                                <Input 
                                  id="calculated-salary"
                                  type="number" 
                                  defaultValue={record.calculated_salary}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-remarks">Admin Remarks</Label>
                              <Textarea
                                id="edit-remarks"
                                defaultValue={record.admin_remarks}
                                placeholder="Add remarks..."
                                className="min-h-[60px]"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={handleSaveEdit}>Save Changes</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {record.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleReject(record.salary_id)}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleApprove(record.salary_id)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSalaryData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No salary records found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryManagement;
