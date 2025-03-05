import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from "../../components/Sidebar";
import { UserPlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const WasteManagement = () => {
  const [wastes, setWastes] = useState([]);

  const fetchData = async () => {
    await getDocs(collection(db, "waste-products")).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setWastes(data);
    });
  };

  const Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        style={{ backgroundColor: "#EBEBEB" }}
        className="px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-screen">
          <div className="text-2xl font-bold mb-4 text-green-900">Users</div>
          <div className="mb-6 flex flex-row gap-4">
            <Button
              onClick={handleOpen}
              sx={{
                backgroundColor: "#4E7972",
                borderRadius: 100,
                width: 280,
                textTransform: "none",
              }}
              startIcon={<UserPlusIcon className="size-5" />}
              variant="contained"
            >
              Add Waste Product
            </Button>
            <Paper elevation="0" sx={{ borderRadius: 100, width: "100%" }}>
              <TextField
                fullWidth
                placeholder="Search"
                slotProps={{
                  input: {
                    startAdornment: (
                      <MagnifyingGlassIcon className="size-5 mr-2" />
                    ),
                  },
                }}
                sx={{ "& fieldset": { borderRadius: 100 } }}
                size="small"
              />
            </Paper>
          </div>
          <TableContainer
            elevation="0"
            sx={{ backgroundColor: "#C2D1C8", height: "80%" }}
            component={Paper}
          >
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Waste</b>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Unit</b>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Price</b>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Quantity</b>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Total Value</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wastes.map((waste, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{waste.waste}</TableCell>
                      <TableCell>{waste.unit}</TableCell>
                      <TableCell>{Rupiah.format(waste.price)}</TableCell>
                      <TableCell>{waste.quantity}</TableCell>
                      <TableCell>{Rupiah.format(parseInt(waste.price) * parseInt(waste.quantity))}</TableCell>
                      <TableCell>{waste.role}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Waste Product
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default WasteManagement;
