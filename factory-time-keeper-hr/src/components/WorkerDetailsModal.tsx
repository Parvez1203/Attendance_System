
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface WorkerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: Worker | null;
  onEdit: (worker: Worker) => void;
}

const WorkerDetailsModal = ({ isOpen, onClose, worker, onEdit }: WorkerDetailsModalProps) => {
  if (!worker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Worker Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{worker.name}</h3>
              <p className="text-sm text-gray-500">{worker.id}</p>
              <Badge variant={worker.status === "active" ? "default" : "secondary"}>
                {worker.status}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-sm">{worker.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Shift</label>
              <p className="text-sm">{worker.shift}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
              <p className="text-sm">₹{worker.hourlyRate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Join Date</label>
              <p className="text-sm">{new Date(worker.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(worker)}>
              Edit Worker
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDetailsModal;
