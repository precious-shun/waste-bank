import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Sidebar from "../../components/Sidebar";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const theme = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const boxStyle = {
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

const tableHead = [
  { text: "Full Name", bgColor: theme.lightGreen },
  { text: "Address", bgColor: theme.lightGreen },
  { text: "Email", bgColor: theme.lightGreen },
  { text: "Balance", bgColor: theme.lightGreen },
  { text: "Gender", bgColor: theme.lightGreen },
  { text: "Role", bgColor: theme.lightGreen },
  { text: "", bgColor: theme.lightGreen },
];

const UsersManagement = () => {
  // Get Users
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    await getDocs(collection(db, "users")).then((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(data);
      //console.log(data);
    });
  };

  // Edit User
  const [editUserData, setEditUserData] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditButton = (user) => {
    setEditUserData(user);
    handleOpen();
  };

  const handleInput = (e) => {
    setEditUserData({ ...editUserData, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    try {
      await updateDoc(doc(db, "users", editUserData.id), editUserData);
      handleClose();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete User
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const confirmOpen = () => setConfirmModal(true);
  const confirmClose = () => setConfirmModal(false);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", deleteTarget.id));
      setDeleteTarget(null);
      confirmClose();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    return search === ""
      ? user
      : user.fullname && user.fullname.toLowerCase().includes(search);
  });

  // Table Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const Rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        style={{ backgroundColor: theme.lightGrey }}
        className="px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-screen">
          <div className="text-3xl font-bold mb-4 text-green-900">Users</div>
          <div className="mb-6 flex flex-row gap-4">
            <Paper elevation="0" sx={{ borderRadius: 100, width: "100%" }}>
              <TextField
                onChange={(e) => {
                  setSearch(e.target.value.toLowerCase());
                }}
                fullWidth
                placeholder="Search"
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
              backgroundColor: theme.lightGreen,
              height: "75%",
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
                  {tableHead.map((item, index) => {
                    return (
                      <TableCell
                        key={index}
                        sx={{ backgroundColor: item.bgColor }}
                      >
                        <b>{item.text}</b>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <p
                    className="text-center text-green-900 text-lg left-1/2 ms-14 top-1/2 absolute"
                    aria-label="simple table"
                  >
                    User not found
                  </p>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{user.fullname}</TableCell>
                          <TableCell>{user.address}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{Rupiah.format(user.balance)}</TableCell>
                          <TableCell>{user.gender}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell
                            align="right"
                            sx={{ display: "flex", gap: 1 }}
                          >
                            <Button
                              onClick={() => {
                                setDeleteTarget(user);
                                confirmOpen();
                              }}
                              sx={{
                                backgroundColor: theme.green,
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
                              onClick={() => handleEditButton(user)}
                              sx={{
                                backgroundColor: theme.green,
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
                        </TableRow>
                      );
                    })
                )}
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
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>

      {/* //Edit User */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={boxStyle}>
          <div className="text-2xl font-semibold mb-6">Edit User</div>
          <div className="flex flex-col gap-4">
            <TextField
              value={editUserData.fullname}
              onChange={(e) => handleInput(e)}
              fullWidth
              size="small"
              name="fullname"
              type="text"
              label="Name"
              variant="filled"
            />
            <TextField
              value={editUserData.address}
              onChange={(e) => handleInput(e)}
              fullWidth
              size="small"
              name="address"
              type="text"
              label="Address"
              variant="filled"
            />
            <TextField
              value={editUserData.email}
              onChange={(e) => handleInput(e)}
              fullWidth
              size="small"
              name="email"
              type="email"
              label="Email"
              variant="filled"
            />
            <TextField
              value={editUserData.balance}
              onChange={(e) => handleInput(e)}
              fullWidth
              size="small"
              name="balance"
              type="number"
              label="Balance"
              variant="filled"
            />
            <TextField
              value={editUserData.gender}
              select
              onChange={(e) => handleInput(e)}
              fullWidth
              size="small"
              name="gender"
              label="Gender"
              variant="filled"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>
          </div>
          <div className="mt-8">
            <Button
              onClick={updateUser}
              style={{ backgroundColor: theme.green }}
              size="large"
              fullWidth
              variant="contained"
            >
              Update
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={confirmModal}
        onClose={confirmClose}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <Box sx={boxStyle}>
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            component="h2"
          >
            Are you sure you want to delete this data?
          </Typography>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{ mt: 2, mr: 2, backgroundColor: theme.darkGreen }}
          >
            Yes
          </Button>
          <Button
            onClick={confirmClose}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            No
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default UsersManagement;
