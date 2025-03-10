import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const PublicRoute = () => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  }

  if (user && role) {
    return (
      <Navigate to={role === "admin" ? "/admin/dashboard" : "/user"} replace />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
