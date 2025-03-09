import {
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { theme } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullname: "",
    address: "",
    email: "",
    gender: "",
  });

  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

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

  //handle update
  const handleUpdate = async () => {
    if (!currentUser) return alert("No user logged in!");

    const userRef = doc(db, "users", currentUser.uid);

    try {
      await updateDoc(userRef, {
        fullname,
        address,
        email,
        gender,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    }

    setOpenDialog(false); // Close dialog after updating
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 py-8">
        <div className="bg-white mx-8 p-8 rounded-2xl">
          <span className="text-green-800 font-bold text-2xl">My Profile</span>
          <div className="border border-1 mt-6 p-6 rounded-lg gap-4 flex flex-col">
            <div className="sm:flex sm:items-center">
              <span className="w-1/6">Profile Picture</span>
              <Avatar sx={{ width: 48, height: 48 }} />
            </div>

            <Divider />
            <div className="sm:flex sm:items-center">
              <span className="w-1/5">Name</span>
              <TextField
                fullWidth
                size="small"
                onChange={(e) => setFullname(e.target.value)}
                defaultValue={profile?.fullname || ""}
              />
            </div>
            <Divider />
            <div className="sm:flex sm:items-center">
              <span className="w-1/5">Address</span>
              <TextField
                fullWidth
                size="small"
                onChange={(e) => setAddress(e.target.value)}
                defaultValue={profile?.address || ""}
              />
            </div>
            <Divider />
            <div className="sm:flex sm:items-center">
              <span className="w-1/5">Email</span>
              <TextField
                fullWidth
                size="small"
                onChange={(e) => setEmail(e.target.value)}
                defaultValue={profile?.email || ""}
              />
            </div>
            <Divider />
            <div className="sm:flex sm:items-center mb-1.5">
              <span className="w-1/5">Gender</span>
              <TextField
                fullWidth
                size="small"
                onChange={(e) => setGender(e.target.value)}
                defaultValue={profile?.gender || ""}
              />
            </div>
            <Button
              variant="contained"
              sx={{
                marginLeft: "auto",
                textTransform: "none",
                backgroundColor: theme.green,
                borderRadius: "10px",
              }}
              onClick={() => setOpenDialog(true)}
            >
              Update Profile
            </Button>
          </div>
        </div>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogContent>
            Are you sure you want to update your profile?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Yes, Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default UserProfile;
