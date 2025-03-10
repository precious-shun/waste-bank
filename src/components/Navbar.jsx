import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { theme } from "../theme";
import { Bars3Icon } from '@heroicons/react/24/solid'
import { useState } from "react";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const navList = [
  { label: "Home", path: "/user" },
  { label: "Profile", path: "/user/profile" },
  { label: "Detailed History", path: "/user/history" },
  { label: "Waste Exchange Rate", path: "/user/calc" },
]

const Navbar = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  console.log(isMenuOpen)

  return (
    <>
    <AppBar
      position="static"
      sx={{
        backgroundColor: colors.darkGreen,
        height: "70px", // Explicit height for proper alignment
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Side: Logo & Tabs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box component="img" src={Logo} alt="Logo" sx={{ height: 65 }} />
          <div className="hidden md:flex">
            <Box sx={{ display: "flex", gap: 1 }}>
              {navList.map(({ label, path }) => (
                <Button
                  key={label}
                  onClick={() => navigate(path)}
                  sx={{
                    backgroundColor:
                      location.pathname === path
                        ? colors.orange
                        : colors.darkGreen,
                    color: colors.white,
                    borderRadius: "8px 8px 0 0", // Tab-like shape
                    fontWeight: "bold",
                    borderBottom:
                      location.pathname === path
                        ? "none"
                        : `2px solid ${colors.lightGreen}`,
                    "&:hover": {
                      backgroundColor: colors.green,
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </div>
        </Box>

        {/* Right Side: Logout Button */}
        <div className="space-x-4 flex">
          <NotificationBell />
          <div className="hidden md:flex">
            <Button
              onClick={handleLogout}
              sx={{
                backgroundColor: colors.orange,
                color: colors.white,
                borderRadius: "20px",
                padding: "6px 16px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: colors.green,
                },
              }}
            >
              Logout
            </Button>
          </div>
          <button onClick={() => setIsMenuOpen((prev) => !prev)} className="md:hidden"><Bars3Icon className="text-white size-6"/></button>
        </div>
      </Toolbar>
    </AppBar>
    <div className={`${isMenuOpen ? "" : "hidden"} bg-darkgreen border md:hidden flex border-t-1 flex-col gap-3 border-normalgreen z-10 p-5 top-20`}>
      {navList.map(({label, path}) => (
      <>
        <button onClick={() => navigate(path)} style={{backgroundColor: location.pathname === path ? `${theme.orange}` : `${theme.darkGreen}` , borderBottom: location.pathname === path ? "" : "1.2px solid white", color: "white", fontWeight: "bold"}} className="p-2.5 text-left rounded-t-lg">
          {label.toUpperCase()}
        </button>
      </>
      ))
      }
      <button onClick={handleLogout} style={{backgroundColor: theme.orange}} className="p-1 w-36 mx-auto rounded-full mt-4 text-white font-semibold">LOGOUT</button>
    </div>
    </>
  );
};

export default Navbar;
