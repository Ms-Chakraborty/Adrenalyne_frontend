import { useAuth } from "@/lib/dev-auth";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("Protected Route - Loading:", isLoading, "Auth:", isAuthenticated);

  if (isLoading) {
    return <div>Verifying your identity...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
