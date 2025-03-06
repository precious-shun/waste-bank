import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Fixed Width */}
      <div className="w-54">
        <Sidebar />
      </div>

      {/* Main Content - Takes Remaining Space */}
      <div className="flex-1 p-4" style={{ background: "#ebebeb" }}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
