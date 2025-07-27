
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import ProfileModal from "./ProfileModal";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@company.com",
    role: "System Administrator",
    avatar: ""
  });
  const navigate = useNavigate();

  // Update time every minute
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  const handleUpdateProfile = (updatedProfile: any) => {
    setProfile(updatedProfile);
    console.log("Profile updated:", updatedProfile);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">HR Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {formatDateTime(currentTime)}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{profile.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />
    </>
  );
};

export default Header;
