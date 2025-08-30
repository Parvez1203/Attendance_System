import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit } from "lucide-react";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [employees, setEmployees] = useState([]);

  // Fetch employee data from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://ju57aw1d9g.execute-api.ap-south-1.amazonaws.com/get-employees-list"
        );
        const data = await response.json();
        if (response.ok && data.employees) {
          // Assuming data.employees is an array of employee objects
          setEmployees(
            [...data.employees].sort((a, b) =>
              a.employee_code.localeCompare(b.employee_code)
            )
          );
        } else {
          console.error(
            "Failed to fetch employees:",
            data.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term and selected department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      !selectedDept || employee.employee_dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(employees.map((emp) => emp.employee_dept))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">
            Manage employee information and records
          </p>
        </div>
        <Link to="/employees/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Employee
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.employee_code}>
                  <TableCell className="font-medium">
                    {employee.employee_code}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {employee.employee_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.phone_number}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employee_dept}</TableCell>
                  <TableCell>{employee.employee_job_role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.is_active ? "default" : "secondary"}
                    >
                      {employee.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/employees/edit/${employee.employee_code}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
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

export default Employees;
