import React from "react";
import { Button, Paper, TextField } from "@mui/material";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { theme } from "../../utils/styles";

const ManagementHeader = ({
  title,
  onAddClick,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold mb-4 text-green-900">
        {title}
      </div>
      <div className="mb-6 flex flex-row gap-4">
        {onAddClick && (
          <Button
            onClick={onAddClick}
            sx={{
              backgroundColor: theme.green,
              borderRadius: 100,
              width: { xs: "40%", sm: 280 },
              textTransform: "none",
            }}
            startIcon={<PlusIcon className="size-5" />}
            variant="contained"
          >
            Add
          </Button>
        )}
        <Paper elevation={0} sx={{ borderRadius: 100, width: "100%" }}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <MagnifyingGlassIcon
                    style={{ color: theme.orange }}
                    className="size-5 mr-2"
                  />
                ),
              },
            }}
            sx={{
              "& fieldset": { borderRadius: 100 },
              input: { "&::placeholder": { color: theme.orange } },
            }}
            size="small"
          />
        </Paper>
      </div>
    </div>
  );
};

export default ManagementHeader;
