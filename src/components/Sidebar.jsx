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
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArchiveBoxIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

const sidebarColor = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  white: "#ffffff",
};

const sidebarItem = [
  {
    name: "Dashboard",
    icon: <Squares2X2Icon className="size-6 ms-2 text-white" />,
    path: "/",
  },
  {
    name: "Users",
    icon: <UserGroupIcon className="size-6 ms-2 text-white" />,
    path: "/users",
  },
  {
    name: "Waste Products",
    icon: <ArchiveBoxIcon className="size-6 ms-2 text-white" />,
    path: "/waste",
  },
  {
    name: "Transactions",
    icon: <DocumentTextIcon className="size-6 ms-2 text-white" />,
    path: "/transaction",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
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
                    onClick={() => navigate(item.path)}
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
            sx={{ marginTop: "auto", backgroundColor: sidebarColor.darkGreen }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <Avatar
                  sx={{ height: 32, width: 32, marginRight: 2, marginLeft: 1 }}
                  alt="Remy Sharp"
                  src="/static/images/avatar/1.jpg"
                />
                <ListItemText
                  sx={{ color: sidebarColor.white }}
                  primary="Arief Kamaluddin"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
