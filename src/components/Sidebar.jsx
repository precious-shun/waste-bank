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
import { ArchiveBoxIcon, DocumentTextIcon, Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Avatar } from "@mui/material";

const Sidebar = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }} variant="permanent" anchor="left">
          <Toolbar sx={{ backgroundColor: "#2C514B" }}>
            <div className="text-2xl font-bold text-white">Logo</div>
          </Toolbar>
          <Divider sx={{ backgroundColor: "#4E7972" }} />
          <List sx={{ backgroundColor: "#2C514B", height: "100%" }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <UserGroupIcon className="size-6 ms-2 text-white" />
                </ListItemIcon>
                <ListItemText sx={{ color: "white" }} primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ "&.Mui-selected": { backgroundColor: "#335F58", ":hover": { backgroundColor: "#335F58" } } }} selected>
                <ListItemIcon>
                  <Squares2X2Icon className="size-6 ms-2 text-white" />
                </ListItemIcon>
                <ListItemText sx={{ color: "white" }} primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ArchiveBoxIcon className="size-6 ms-2 text-white" />
                </ListItemIcon>
                <ListItemText sx={{ color: "white" }} primary="Waste Products" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DocumentTextIcon className="size-6 ms-2 text-white" />
                </ListItemIcon>
                <ListItemText sx={{ color: "white" }} primary="Transactions" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ backgroundColor: "#4E7972" }} />
          <List sx={{ marginTop: "auto", backgroundColor: "#2C514B" }}>
            <ListItem disablePadding>
              <ListItemButton>
                <Avatar sx={{ height: 32, width: 32, marginRight: 2, marginLeft: 1 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <ListItemText sx={{ color: "white" }} primary="Arief Kamaluddin" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
