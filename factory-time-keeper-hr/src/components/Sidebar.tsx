
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  DollarSign,
  FileText,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [attendanceOpen, setAttendanceOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Employees", path: "/employees", icon: Users },
    {
      name: "Attendance",
      icon: Clock,
      submenu: [
        { name: "History", path: "/attendance/history" },
        { name: "Review", path: "/attendance/review" },
      ]
    },
    { name: "Salary Management", path: "/salary-management", icon: DollarSign },
    {
      name: "Reports",
      icon: FileText,
      submenu: [
        { name: "Daily Reports", path: "/reports/daily" },
        { name: "Monthly Reports", path: "/reports/monthly" },
        { name: "Employee Reports", path: "/reports/employee" },
      ]
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => {
                      if (item.name === "Attendance") setAttendanceOpen(!attendanceOpen);
                      if (item.name === "Reports") setReportsOpen(!reportsOpen);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </div>
                    {item.name === "Attendance" ? (
                      attendanceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    ) : (
                      reportsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {((item.name === "Attendance" && attendanceOpen) || (item.name === "Reports" && reportsOpen)) && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 text-sm rounded-md ${
                                isActive
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
