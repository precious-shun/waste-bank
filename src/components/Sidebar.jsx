import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logo from "../assets/logo.svg";
import { Avatar, Button, colors } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArchiveBoxIcon,
  BellAlertIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  UserGroupIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { use, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const logoutColors = {
  green: "#4E7972",
  orange: "#D66C42",
  white: "#ffffff",
};

const sidebarColor = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  white: "#ffffff",
};

const sidebarItem = [
  {
    name: "Dashboard",
    icon: <Squares2X2Icon className="size-6 ms-2 text-white" />,
    path: "/admin/dashboard",
  },
  {
    name: "Users",
    icon: <UserGroupIcon className="size-6 ms-2 text-white" />,
    path: "/admin/users",
  },
  {
    name: "Waste Products",
    icon: <ArchiveBoxIcon className="size-6 ms-2 text-white" />,
    path: "/admin/wastes",
  },
  {
    name: "Transactions",
    icon: <DocumentTextIcon className="size-6 ms-2 text-white" />,
    path: "/admin/transactions",
  },
  {
    name: "Notification",
    icon: <BellAlertIcon className="size-6 ms-2 text-white" />,
    path: "/admin/notifications",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 640) {
        document.body.style.overflow = "unset";
      } else {
        document.body.style.overflow = "hidden";
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  },[])

  return (
    <>
      <button
        onClick={() => {
          setIsMenuOpen((prev) => !prev);
          document.body.style.overflow = "hidden";
        }}
        className="sm:hidden absolute right-6 top-6"
      >
        <Bars3Icon style={{ color: colors.darkGreen }} className="size-6" />
      </button>
      <div className={`${isMenuOpen ? "absolute sm:max-sm:hidden sm:static" : "hidden"} sm:flex`}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <button
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              document.body.style.overflow = "unset";
            }}
            className="sm:hidden z-40 tetx-black bg-gray-900/70 w-screen h-screen"
          ></button>
          <Drawer
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
            }}
            variant="permanent"
            anchor="left"
          >
            <Toolbar
              className="flex justify-center"
              sx={{ backgroundColor: sidebarColor.darkGreen }}
            >
              <img src={Logo} className="h-28" alt="Logo" />
            </Toolbar>
            <Divider sx={{ backgroundColor: sidebarColor.green }} />
            <List
              sx={{ backgroundColor: sidebarColor.darkGreen, height: "100%" }}
            >
              {sidebarItem.map((item, index) => {
                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => {
                        navigate(item.path);
                        document.body.style.overflow = "unset";
                      }}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#335F58",
                          ":hover": { backgroundColor: "#335F58" },
                        },
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        sx={{ color: sidebarColor.white }}
                        primary={item.name}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ backgroundColor: sidebarColor.green }} />

            <List
              sx={{
                marginTop: "auto",
                backgroundColor: sidebarColor.darkGreen,
              }}
              className="flex justify-center"
            >
              <Button
                onClick={handleLogout}
                sx={{
                  backgroundColor: logoutColors.orange,
                  color: logoutColors.white,
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: logoutColors.green,
                  },
                }}
              >
                Logout
              </Button>
            </List>
          </Drawer>
        </Box>
      </div>
    </>
  );
};

export default Sidebar;
