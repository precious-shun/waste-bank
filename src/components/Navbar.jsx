import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const Navbar = () => {
  const { handleLogout } = useAuth();

  const navigate = useNavigate();

  return (
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
          <Box sx={{ display: "flex", gap: 1 }}>
            {[
              { label: "Home", path: "/user/" },
              { label: "Profile", path: "/user/profile" },
              { label: "Detailed History", path: "/user/history" },
            ].map(({ label, path }) => (
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
                  padding: "8px 16px",
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
        </Box>

        {/* Right Side: Logout Button */}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
