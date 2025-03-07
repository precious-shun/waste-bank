import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Logo from "../assets/logo.svg";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const Navbar = ({ onLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: colors.darkGreen }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box component="img" src={Logo} alt="Logo" sx={{ height: 80 }} />

        <Button
          onClick={handleLogout}
          sx={{
            backgroundColor: colors.orange,
            color: colors.white,
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
