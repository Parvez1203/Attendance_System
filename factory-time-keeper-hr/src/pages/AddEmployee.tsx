import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";

const API_URL =
  "https://r0ufd2jdfk.execute-api.ap-south-1.amazonaws.com/register_employee";

function toHHMMSS(t: string) {
  // expects "09:00" or "09:00:00" -> "09:00:00"
  const [h = "00", m = "00", s = "00"] = t.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${(s ?? "00")
    .toString()
    .padStart(2, "0")}`;
}

function dataUrlToBase64(dataUrl: string) {
  // strips "data:image/png;base64,...." -> "...."
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [photoError, setPhotoError] = useState(false);

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
    photo: "", // data URL
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setFormData((prev) => ({ ...prev, photo: result }));
      setPhotoError(false); // Reset error when photo is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.photo) {
      setPhotoError(true);
      toast({
        title: "Photo required",
        description: "Please upload an employee photo.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Build API payload with your required keys
      const payload = {
        employee_code: formData.employee_code,
        employee_name: formData.employee_name,
        employee_shift_in_time: toHHMMSS(formData.shift_in),
        employee_shift_out_time: toHHMMSS(formData.shift_out),
        employee_dept: formData.dept,
        employee_job_role: formData.job_role,
        employee_monthly_salary: parseFloat(formData.monthly_salary || "0"),
        employee_joining_date: formData.joining_date, // already YYYY-MM-DD
        image_data: dataUrlToBase64(formData.photo), // base64 string
        phone_number: formData.phone,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Request failed (${res.status}) ${res.statusText} ${
            text ? `- ${text}` : ""
          }`
        );
      }

      toast({
        title: "Employee saved",
        description: `${formData.employee_name} has been registered.`,
      });
      navigate("/employees");
    } catch (err: any) {
      console.error("Employee register failed:", err);
      toast({
        title: "Failed to save",
        description:
          err?.message ??
          "Something went wrong while saving the employee record.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/employees")} disabled={submitting}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
          <p className="text-gray-600">Create a new employee record</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.photo} />
                  <AvatarFallback>
                    {formData.employee_name
                      ? formData.employee_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "Photo"}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Click camera icon to upload photo</p>
              <p className="text-xs text-blue-600">*Photo required for face recognition system</p>
              {photoError && (
                <p className="text-xs text-red-500">Please upload a photo.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="employee_code">
                  Employee Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employee_code"
                  value={formData.employee_code}
                  onChange={(e) => handleInputChange("employee_code", e.target.value)}
                  placeholder="EMP001"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="employee_name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employee_name"
                  value={formData.employee_name}
                  onChange={(e) => handleInputChange("employee_name", e.target.value)}
                  placeholder="John Smith"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="dept">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dept"
                  value={formData.dept}
                  onChange={(e) => handleInputChange("dept", e.target.value)}
                  placeholder="Engineering"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="job_role">
                  Job Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job_role"
                  value={formData.job_role}
                  onChange={(e) => handleInputChange("job_role", e.target.value)}
                  placeholder="Software Developer"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="monthly_salary">
                  Monthly Salary <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="monthly_salary"
                  type="number"
                  value={formData.monthly_salary}
                  onChange={(e) => handleInputChange("monthly_salary", e.target.value)}
                  placeholder="75000"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1234567890"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="joining_date">
                  Joining Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => handleInputChange("joining_date", e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Shift Timing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="shift_in">
                    Check In Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="shift_in"
                    type="time"
                    value={formData.shift_in}
                    onChange={(e) => handleInputChange("shift_in", e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <Label htmlFor="shift_out">
                    Check Out Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="shift_out"
                    type="time"
                    value={formData.shift_out}
                    onChange={(e) => handleInputChange("shift_out", e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/employees")}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEmployee;
