import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Route guard: unauthenticated visitors are redirected to login and returned
// to their intended destination after signing in.
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader label="Checking your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
