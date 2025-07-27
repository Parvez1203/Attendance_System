
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onUpdateProfile: (profile: any) => void;
}

const ProfileModal = ({ isOpen, onClose, profile, onUpdateProfile }: ProfileModalProps) => {
  const [formData, setFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password fields if any password field is filled
    if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.currentPassword) {
        toast.error("Current password is required");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (passwordData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }
    }
    
    onUpdateProfile(formData);
    
    if (passwordData.newPassword) {
      toast.success("Profile and password updated successfully");
    } else {
      toast.success("Profile updated successfully");
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Change Password</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
