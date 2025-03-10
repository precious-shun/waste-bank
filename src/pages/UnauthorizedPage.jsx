import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { theme } from "../utils/styles";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen "
      style={{ backgroundColor: theme.darkGreen }}
    >
      <div
        className="text-center p-8 m-8 rounded-lg shadow-lg max-w-md"
        style={{ backgroundColor: theme.lightGreen, borderRadius: "20px" }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Unauthorized Access
        </h2>

        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please log in with
          appropriate credentials or contact your administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            className="normal-case"
            style={{ backgroundColor: theme.orange, borderRadius: "10px" }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
