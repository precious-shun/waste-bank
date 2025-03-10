import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      console.log(auth?.currentUser?.email);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default AdminDashboard;
