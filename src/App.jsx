import UsersManagement from "./pages/admin/UsersManagement";
import WasteManagement from "./pages/admin/WasteManagement";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UsersManagement />} />
        <Route path="/waste" element={<WasteManagement />} />
      </Routes>
    </>
  );
}

export default App;
