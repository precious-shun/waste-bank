import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { theme, boxStyle } from "../../utils/styles";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={boxStyle}>
        <Typography variant="h6">
          Are you sure you want to delete this item?
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.darkGreen }}
            onClick={onConfirm}
          >
            Yes
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
