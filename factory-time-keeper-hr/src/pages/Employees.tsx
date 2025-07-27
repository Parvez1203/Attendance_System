
import { useState } from "react";
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
import data from "@/data/data.json";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const filteredEmployees = data.employees.filter(employee => {
    const matchesSearch = employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !selectedDept || employee.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = [...new Set(data.employees.map(emp => emp.dept))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage employee information and records</p>
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
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
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
                <TableRow key={employee.employee_id}>
                  <TableCell className="font-medium">{employee.employee_code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.employee_name}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.dept}</TableCell>
                  <TableCell>{employee.job_role}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/employees/edit/${employee.employee_id}`}>
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
