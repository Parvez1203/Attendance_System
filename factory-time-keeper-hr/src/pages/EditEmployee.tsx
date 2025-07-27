
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Camera, UserX, UserCheck } from "lucide-react";
import data from "@/data/data.json";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employee_code: "",
    employee_name: "",
    dept: "",
    job_role: "",
    monthly_salary: "",
    phone: "",
    joining_date: "",
    shift_in: "09:00",
    shift_out: "18:00",
    status: "active",
    photo: ""
  });

  useEffect(() => {
    const emp = data.employees.find(e => e.employee_id === id);
    if (emp) {
      setEmployee(emp);
      setFormData({
        employee_code: emp.employee_code,
        employee_name: emp.employee_name,
        dept: emp.dept,
        job_role: emp.job_role,
        monthly_salary: emp.monthly_salary.toString(),
        phone: emp.phone,
        joining_date: emp.joining_date,
        shift_in: emp.shift_in,
        shift_out: emp.shift_out,
        status: emp.status,
        photo: emp.photo
      });
    }
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating employee:", formData);
    navigate("/employees");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleStatus = () => {
    setFormData(prev => ({ 
      ...prev, 
      status: prev.status === "active" ? "inactive" : "active" 
    }));
  };

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600">Update employee information</p>
        </div>
        <Button 
          variant={formData.status === "active" ? "destructive" : "default"}
          onClick={toggleStatus}
        >
          {formData.status === "active" ? (
            <>
              <UserX className="h-4 w-4 mr-2" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-2" />
              Activate
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.photo} />
                  <AvatarFallback>
                    {formData.employee_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Click camera icon to update photo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="employee_code">Employee Code</Label>
                <Input
                  id="employee_code"
                  value={formData.employee_code}
                  onChange={(e) => handleInputChange("employee_code", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="employee_name">Full Name</Label>
                <Input
                  id="employee_name"
                  value={formData.employee_name}
                  onChange={(e) => handleInputChange("employee_name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dept">Department</Label>
                <Input
                  id="dept"
                  value={formData.dept}
                  onChange={(e) => handleInputChange("dept", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="job_role">Job Role</Label>
                <Input
                  id="job_role"
                  value={formData.job_role}
                  onChange={(e) => handleInputChange("job_role", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="monthly_salary">Monthly Salary</Label>
                <Input
                  id="monthly_salary"
                  type="number"
                  value={formData.monthly_salary}
                  onChange={(e) => handleInputChange("monthly_salary", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="joining_date">Joining Date</Label>
                <Input
                  id="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => handleInputChange("joining_date", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-4">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                    {formData.status}
                  </Badge>
                  <Button type="button" variant="outline" size="sm" onClick={toggleStatus}>
                    {formData.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Shift Timing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="shift_in">Check In Time</Label>
                  <Input
                    id="shift_in"
                    type="time"
                    value={formData.shift_in}
                    onChange={(e) => handleInputChange("shift_in", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shift_out">Check Out Time</Label>
                  <Input
                    id="shift_out"
                    type="time"
                    value={formData.shift_out}
                    onChange={(e) => handleInputChange("shift_out", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit">Update Employee</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/employees")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEmployee;
