import UsersManagement from "./pages/admin/UsersManagement";
import WasteManagement from "./pages/admin/WasteManagement";
import Dashboard from "./pages/admin/Dashboard";
import Homepage from "./pages/user/Homepage";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import TransactionsManagement from "./pages/admin/TransactionsManagement";
import NotificationsManagement from "./pages/admin/NotificationsManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { AuthProvider } from "./context/AuthContext";
import TransactionHistory from "./pages/user/TransactionHistory";
import UserProfile from "./pages/user/UserProfile";
import WastePrices from "./pages/user/WastePrices";
import PublicRoute from "./components/PublicRoute";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/*" element={<NotFoundPage />} />

        {/* client */}
        <Route element={<ProtectedRoute requiredRole="client" />}>
          <Route path="/user/calc" element={<WastePrices />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user" element={<Homepage />} />
          <Route path="/user/history" element={<TransactionHistory />} />
        </Route>

        {/* admin */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route
            path="/admin/transactions"
            element={<TransactionsManagement />}
          />
          <Route
            path="/admin/notifications"
            element={<NotificationsManagement />}
          />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/wastes" element={<WasteManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
