import { Avatar, Button, Divider, TextField } from "@mui/material";
import Navbar from "../../components/Navbar";
import { theme } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullname: "",
    address: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.uid) return; // Ensure user is logged in
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data()); // Set state with user data
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 py-8">
        <div className="bg-white mx-8 p-8 rounded-xl">
          <span className="text-green-800 font-bold text-2xl">My Profile</span>
          <div className="border border-1 mt-6 p-6 rounded-lg gap-4 flex flex-col">
            <div className="flex items-center">
              <span className="w-1/6">Profile Picture</span>
              <Avatar sx={{ width: 48, height: 48 }} />
            </div>

            <Divider />
            <div className="flex items-center">
              <span className="w-1/5">Name</span>
              <TextField
                fullWidth
                size="small"
                defaultValue={profile?.fullname || ""}
              />
            </div>
            <Divider />
            <div className="flex items-center">
              <span className="w-1/5">Address</span>
              <TextField
                fullWidth
                size="small"
                defaultValue={profile?.address || ""}
              />
            </div>
            <Divider />
            <div className="flex items-center">
              <span className="w-1/5">Email</span>
              <TextField
                fullWidth
                size="small"
                defaultValue={profile?.email || ""}
              />
            </div>
            <Divider />
            <div className="flex items-center mb-1.5">
              <span className="w-1/5">Gender</span>
              <TextField
                fullWidth
                size="small"
                defaultValue={profile?.gender || ""}
              />
            </div>
            <Button
              variant="contained"
              sx={{
                marginLeft: "auto",
                textTransform: "none",
                backgroundColor: theme.green,
              }}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
