import UsersManagement from "./pages/admin/UsersManagement";
import WasteManagement from "./pages/admin/WasteManagement";
import Dashboard from "./pages/admin/Dashboard";
import Homepage from "./pages/user/Homepage";
import { Routes, Route } from "react-router-dom";
// import { Home } from "@mui/icons-material";

function App() {
  return (
    <>
      <Homepage />
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/waste" element={<WasteManagement />} />
      </Routes> */}
    </>
  );
}

export default App;
