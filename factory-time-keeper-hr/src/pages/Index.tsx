
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import WorkersManagement from "@/components/WorkersManagement";
import AttendanceReview from "@/components/AttendanceReview";
import SalaryManagement from "@/components/SalaryManagement";
import LoginScreen from "@/components/LoginScreen";
import ProfileModal from "@/components/ProfileModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "HR Manager",
    email: "hr@company.com",
    role: "HR Manager",
    avatar: ""
  });

  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log("Login credentials:", credentials);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  const handleUpdateProfile = (profile: any) => {
    setUserProfile(profile);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "workers":
        return <WorkersManagement />;
      case "attendance":
        return <AttendanceReview />;
      case "salary":
        return <SalaryManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FR</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Face Recognition Attendance</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">HR Dashboard</span>
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium">{userProfile.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                <span className="text-sm font-medium">{userProfile.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderActiveComponent()}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
};

export default Index;
