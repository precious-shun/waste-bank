import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from "../../components/Sidebar";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Modal,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";

import { db } from "../../firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const theme = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

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
  const [waste, setWaste] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [editingWaste, setEditingWaste] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddWaste = async () => {
    if (!waste || !unit || !price) return;

    const newWaste = {
      waste,
      unit,
      price: parseInt(price),
    };

    try {
      await addDoc(collection(db, "waste-products"), newWaste);

      setWastes([...wastes, newWaste]);

      setWaste("");
      setUnit("");
      setPrice("");

      handleClose();
      toast.success("Success adding waste");
    } catch (error) {
      toast.error("Error adding waste");
    }
  };

  const handleEdit = (wasteItem) => {
    setEditingWaste(wasteItem);
    setWaste(wasteItem.waste);
    setUnit(wasteItem.unit);
    setPrice(wasteItem.price);
    handleOpen();
  };

  const handleUpdateWaste = async () => {
    if (!editingWaste) return;

    try {
      const wasteRef = doc(db, "waste-products", editingWaste.id);
      await updateDoc(wasteRef, {
        waste,
        unit,
        price: parseInt(price),
      });

      setWastes((prevWastes) =>
        prevWastes.map((item) =>
          item.id === editingWaste.id
            ? {
                ...item,
                waste,
                unit,
                price: parseInt(price),
              }
            : item
        )
      );

      setEditingWaste(null);
      setWaste("");
      setUnit("");
      setPrice("");
      handleClose();
      toast.success("Success updating waste");
    } catch (error) {
      toast.error("Error updating waste");
    }
  };

  const [wastes, setWastes] = useState([]);

  const filteredWastes = wastes.filter((waste) =>
    waste.waste.toLowerCase().includes(searchQuery)
  );

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

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDoc(doc(db, "waste-products", deleteTarget.id));

      setWastes((prevWastes) =>
        prevWastes.filter((item) => item.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
      confirmClose();
      toast.success("Success deleting waste");
    } catch (error) {
      toast.error("Error deleting waste");
    }
  };

  const [confirmModal, setConfirmModal] = useState(false);
  const confirmOpen = () => setConfirmModal(true);
  const confirmClose = () => setConfirmModal(false);

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
          <div className="text-2xl font-bold mb-4 text-green-900">
            Waste Products
          </div>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
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
          <TableContainer
            elevation="0"
            sx={{
              backgroundColor: "#C2D1C8",
              height: "80%",
              borderRadius: "20px",
            }}
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
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}></TableCell>
                  {/* <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Quantity</b>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#C2D1C8" }}>
                    <b>Total Value</b>
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWastes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((waste, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{waste.waste}</TableCell>
                        <TableCell>{waste.unit}</TableCell>
                        <TableCell>{Rupiah.format(waste.price)}</TableCell>
                        <TableCell
                          align="right"
                          sx={{ display: "flex", gap: 1 }}
                        >
                          <Button
                            onClick={() => {
                              setDeleteTarget(waste);
                              confirmOpen();
                            }}
                            sx={{
                              backgroundColor: "#4E7972",
                              borderRadius: 100,
                              height: 34,
                              textTransform: "none",
                            }}
                            variant="contained"
                          >
                            <TrashIcon className="size-5" />
                            <span className="ms-1.5 mt-0.5">Delete</span>
                          </Button>
                          <Button
                            onClick={() => handleEdit(waste)}
                            sx={{
                              backgroundColor: "#4E7972",
                              borderRadius: 100,
                              height: 34,
                              textTransform: "none",
                            }}
                            variant="contained"
                          >
                            <PencilSquareIcon className="size-5" />
                            <span className="ms-1.5 mt-0.5">Edit</span>
                          </Button>
                        </TableCell>

                        {/* <TableCell>{waste.quantity}</TableCell>
                      <TableCell>{Rupiah.format(parseInt(waste.price) * parseInt(waste.quantity))}</TableCell>
                      <TableCell>{waste.role}</TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              marginTop: 1,
            }}
            component="div"
            count={filteredWastes.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>

      <Modal
        open={confirmModal}
        onClose={confirmClose}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <Box sx={style}>
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            component="h2"
          >
            Are you sure you want to delete this data?
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 2, mr: 2, backgroundColor: theme.darkGreen }}
            onClick={handleDelete}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={confirmClose}
          >
            No
          </Button>
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-2xl font-semibold mb-6">
            {editingWaste ? "Edit Waste" : "Add Waste Category"}
          </div>
          <div className="flex flex-col gap-4">
            <TextField
              fullWidth
              size="small"
              name="waste"
              type="text"
              variant="filled"
              label="Waste Name"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              name="unit"
              type="text"
              variant="filled"
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              name="price"
              variant="filled"
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mt-8">
            <Button
              style={{ backgroundColor: theme.green }}
              size="large"
              fullWidth
              onClick={editingWaste ? handleUpdateWaste : handleAddWaste}
              variant="contained"
              sx={{ mt: 2 }}
            >
              {editingWaste ? "Update" : "Add"}
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default WasteManagement;
