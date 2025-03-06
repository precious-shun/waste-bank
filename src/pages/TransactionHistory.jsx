import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";

//import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { List, ListItem, ListItemText } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#ebebeb",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0),
  createData("Ice cream sandwich", 237, 9.0),
  createData("Eclair", 262, 16.0),
  createData("Cupcake", 305, 3.7),
  createData("Gingerbread", 356, 16.0),
];

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionRef = collection(db, "transaction");
        const q = query(
          transactionRef,
          where("user_id", "==", `users/${currentUser.uid}`)
        );
        const querySnapshot = await getDocs(q);

        const transactionData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(transactionData);
      } catch (error) {
        console.error("Gagal mengambil data transaksi:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-900">
        Transaction History
      </h2>

      <TableContainer
        sx={{ p: 3, mt: 3, backgroundColor: "#c2d1c8", borderRadius: `20px` }}
      >
        <Table>
          <TableHead>
            <TableRow className="font-semibold">
              <TableCell>Date</TableCell>
              <TableCell>Total Balance</TableCell>
              <TableCell>Total Waste</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.calories}</TableCell>
                <TableCell align="center">{row.fat}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleOpen(row)}
                    sx={{
                      backgroundColor: "#2c514b",
                      borderRadius: 100,
                      height: 34,
                      textTransform: "none",
                    }}
                    variant="contained"
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Transaction Detail
          </Typography>
          <List id="modal-modal-description">
            <ListItem>
              <ListItemText primary="Item 1" />
            </ListItem>
            {/* {selectedTransaction.waste_products.map((item, index) => (
              <ListItem key={index} className="py-1">
                Sampah ID: {item.waste_product_id} | Qty: {item.quantity} |
                Subtotal: Rp {item.subtotal.toLocaleString("id-ID")}
              </ListItem>
            ))} */}
          </List>
        </Box>
      </Modal>
    </div>
  );
}

export default TransactionHistory;
