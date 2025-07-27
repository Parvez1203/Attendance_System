
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  department: string;
  shift: string;
  joinDate: string;
  photo: string;
  hourlyRate: number;
  status: string;
}

interface AddEditWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: Worker | null;
  onSave: (worker: Partial<Worker>) => void;
}

const AddEditWorkerModal = ({ isOpen, onClose, worker, onSave }: AddEditWorkerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    shift: "",
    hourlyRate: "",
    photo: "",
  });

  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name,
        department: worker.department,
        shift: worker.shift,
        hourlyRate: worker.hourlyRate.toString(),
        photo: worker.photo,
      });
    } else {
      setFormData({
        name: "",
        department: "",
        shift: "",
        hourlyRate: "",
        photo: "",
      });
    }
  }, [worker, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workerData = {
      ...formData,
      hourlyRate: parseInt(formData.hourlyRate),
      id: worker?.id || `W${String(Date.now()).slice(-3)}`,
      joinDate: worker?.joinDate || new Date().toISOString().split('T')[0],
      status: worker?.status || "active",
    };
    onSave(workerData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{worker ? "Edit Worker" : "Add New Worker"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={formData.photo} />
                <AvatarFallback>
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'Photo'}
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
            <p className="text-sm text-gray-500">Click camera icon to upload photo</p>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assembly">Assembly</SelectItem>
                <SelectItem value="Quality Control">Quality Control</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="shift">Shift</Label>
            <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning (8AM-4PM)</SelectItem>
                <SelectItem value="Evening">Evening (4PM-12AM)</SelectItem>
                <SelectItem value="Night">Night (12AM-8AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
            <Input
              id="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              placeholder="150"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {worker ? "Update Worker" : "Add Worker"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditWorkerModal;
