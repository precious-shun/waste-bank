import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [umur, setUmur] = useState(Number);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "users"), {
        nama: name,
        alamat: alamat,
        umur: umur,
      });
      console.log("Data added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

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
