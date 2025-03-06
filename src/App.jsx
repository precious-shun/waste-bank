import UsersManagement from "./pages/admin/UsersManagement";
import WasteManagement from "./pages/admin/WasteManagement";
import Dashboard from "./pages/admin/Dashboard";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/waste" element={<WasteManagement />} />
      </Routes>
    </>
  );
}

export default App;
