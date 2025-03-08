import UsersManagement from "./pages/admin/UsersManagement";
import WasteManagement from "./pages/admin/WasteManagement";
import Dashboard from "./pages/admin/Dashboard";
import Homepage from "./pages/user/Homepage";
import { Routes, Route } from "react-router-dom";
// import { Home } from "@mui/icons-material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
// import CreateTransaction from "./pages/client/CreateTransaction";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { AuthProvider } from "./context/AuthContext";
import TransactionHistory from "./pages/user/TransactionHistory";
import UserProfile from "./pages/user/UserProfile";
import WastePrices from "./pages/user/WastePrices";
// import NotificationList from "./pages/admin/notification/NotificationList";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
          </ProtectedRoute>
          }
          /> */}
        <Route
          path="/user/calc"
          element={
            <ProtectedRoute requiredRole="client">
              <WastePrices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute requiredRole="client">
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/"
          element={
            <ProtectedRoute requiredRole="client">
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/history"
          element={
            <ProtectedRoute requiredRole="client">
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute requiredRole="admin">
              <NotificationList />
              </ProtectedRoute>
              }
              /> */}
        {/* <Route
          path="/create-transaction"
          element={
            <ProtectedRoute requiredRole="client">
            <CreateTransaction />
            </ProtectedRoute>
            }
            /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
