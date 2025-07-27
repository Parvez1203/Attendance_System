
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import mockData from "@/data/mockData.json";
import AddEditWorkerModal from "./AddEditWorkerModal";
import WorkerDetailsModal from "./WorkerDetailsModal";

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

const WorkersManagement = () => {
  const [workers, setWorkers] = useState<Worker[]>(mockData.workers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWorker = (workerData: Partial<Worker>) => {
    const newWorker = workerData as Worker;
    setWorkers([...workers, newWorker]);
  };

  const handleEditWorker = (workerData: Partial<Worker>) => {
    setWorkers(workers.map(w => w.id === workerData.id ? { ...w, ...workerData } : w));
    setEditingWorker(null);
  };

  const handleViewDetails = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsDetailsModalOpen(true);
  };

  const handleEditFromDetails = (worker: Worker) => {
    setIsDetailsModalOpen(false);
    setEditingWorker(worker);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Workers Management</h1>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => {
            setEditingWorker(null);
            setIsAddDialogOpen(true);
          }}
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Worker</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{worker.name}</CardTitle>
                  <p className="text-sm text-gray-500">{worker.id}</p>
                </div>
                <Badge variant={worker.status === "active" ? "default" : "secondary"}>
                  {worker.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Department:</span>
                <span className="text-sm font-medium">{worker.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Shift:</span>
                <span className="text-sm font-medium">{worker.shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Hourly Rate:</span>
                <span className="text-sm font-medium">₹{worker.hourlyRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Join Date:</span>
                <span className="text-sm font-medium">{new Date(worker.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditingWorker(worker);
                    setIsAddDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(worker)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddEditWorkerModal
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        worker={editingWorker}
        onSave={editingWorker ? handleEditWorker : handleAddWorker}
      />

      <WorkerDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        worker={selectedWorker}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default WorkersManagement;
