
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
