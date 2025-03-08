import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function PublicRoute() {
  const { user, role } = useAuth();

  //   useEffect(() => {
  //     console.log("User state changed:", user); // Debugging: Pastikan state berubah
  //   }, [user]);

  if (user) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/user"} />;
  }

  console.log(role);

  return <Outlet />;
}

export default PublicRoute;
