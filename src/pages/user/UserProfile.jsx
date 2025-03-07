import { Avatar, Button, Divider, TextField } from "@mui/material";
import Navbar from "../../components/Navbar";
import { theme } from "../../theme";

const UserProfile = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-200 py-8">
        <div className="bg-white mx-8 p-8 rounded-xl">
          <span className="text-green-800 font-bold text-2xl">My Profile</span>
          <div className="border border-1 mt-6 p-6 rounded-lg gap-4 flex flex-col">
            <div className="flex items-center">
              <span className="w-1/6">Profile Picture</span>
              <Avatar sx={{ width: 48, height: 48 }}></Avatar>
            </div>
            <Divider></Divider>
            <div className="flex items-center">
              <span className="w-1/5">Name</span>
              <TextField fullWidth value={"Arif Camaludin"} size="small"></TextField>
            </div>
            <Divider></Divider>
            <div className="flex items-center">
              <span className="w-1/5">Address</span>
              <TextField fullWidth value={"Bogor"} size="small"></TextField>
            </div>
            <Divider></Divider>
            <div className="flex items-center">
              <span className="w-1/5">Email</span>
              <TextField fullWidth value={"arif@gmail.com"} size="small"></TextField>
            </div>
            <Divider></Divider>
            <div className="flex items-center mb-1.5">
              <span className="w-1/5">Gender</span>
              <TextField fullWidth value={"Male"} size="small"></TextField>
            </div>
            <Button variant="contained" sx={{ marginLeft: "auto", textTransform: "none", backgroundColor: theme.green }}>
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
