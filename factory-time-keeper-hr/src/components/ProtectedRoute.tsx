
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const token = localStorage.getItem('jwt');
  //   setIsAuthenticated(!!token);
  // }, []);

  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>;
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
