import UsersManagement from "./pages/admin/UsersManagement";
import WasteManagement from "./pages/admin/WasteManagement";
import Dashboard from "./pages/admin/Dashboard";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import TransactionsManagement from "./pages/admin/TransactionsManagement";
import NotificationsManagement from "./pages/admin/NotificationsManagement";
import { green, red } from "@mui/material/colors";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/waste" element={<WasteManagement />} />
        <Route path="/trans" element={<TransactionsManagement />} />
        <Route path="/notification" element={<NotificationsManagement />} />
      </Routes>
    </>
  );
}

export default App;
