import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RecyclingIcon from "@mui/icons-material/Recycling";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

import Product from "./Product";
import Dashboard from "./Dashboard";
import Transaction from "./Transaction";
import Users from "./Users";

const NAVIGATION = [
  {
    kind: "header",
    title: "Admin Menu",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon style={{ color: "#FFFFFF" }} />,
  },
  {
    segment: "users",
    title: "Users",
    icon: <AccountCircleIcon style={{ color: "#FFFFFF" }} />,
  },
  {
    segment: "waste",
    title: "Waste Products",
    icon: <RecyclingIcon style={{ color: "#FFFFFF" }} />,
  },
  {
    segment: "transaction",
    title: "Transaction",
    icon: <ReceiptLongIcon style={{ color: "#FFFFFF" }} />,
  },
];

const colorPalette = {
  hijau: "#2c514b",
  hijau_muda: "#4e7972",
  hijau_lebih_muda: "#c2d1c8",
  coklat: "#7b5642",
  abu_abu: "#c6c6c6",
  abu_abu_muda: "#ebebeb",
  orange: "#d66c42",
  abu_orange: "#e6dbcd",
  putih: "#ffffff",
  hitam: "#000000",
};

const demoTheme = createTheme({
  palette: {
    primary: {
      main: colorPalette.putih,
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: colorPalette.putih,
      paper: colorPalette.hijau,
    },
    text: {
      primary: colorPalette.putih,
      secondary: colorPalette.putih,
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  //   colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const Sidebar = (props) => {
  const { window } = props;

  const router = useDemoRouter("/page");
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="src/img/ecobank.png" alt="EcoBank" />,
        title: "EcoBank",
        homeUrl: "/toolpad/core/introduction",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
};

Sidebar.propTypes = {
  window: PropTypes.func,
};

export default Sidebar;

// const Sidebar = () => {
//   return <h1>Hello</h1>;
// };

// export default Sidebar;
