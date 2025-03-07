import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { Box, Button, ListItem, ListItemText } from "@mui/material";
import Navbar from "../../components/Navbar";

const colors = {
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
  bgcolor: "#ebebeb",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

const transactions1 = [
  {
    user_id: "users/aOSiV98JHmOdxEifE8dYQoWH05l2",
    date: "2025-03-05T04:50:50.225Z",
    total: 40100,
    waste_products: [
      {
        waste_product_id: "1vt8ZR1FoVNm7tz7d2Zq",
        quantity: 3,
        subtotal: 22500,
      },
      {
        waste_product_id: "5daXP6htmdONySFdKh7e",
        quantity: 5,
        subtotal: 14000,
      },
    ],
  },
  {
    user_id: "users/aOSiV98JHmOdxEifE8dYQoWH05l2",
    date: "2025-03-05T04:50:50.225Z",
    total: 40100,
    waste_products: [
      {
        waste_product_id: "1vt8ZR1FoVNm7tz7d2Zq",
        quantity: 3,
        subtotal: 22500,
      },
      {
        waste_product_id: "5daXP6htmdONySFdKh7e",
        quantity: 5,
        subtotal: 14000,
      },
    ],
  },
];

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    // const fetchTransactions = async () => {
    //   try {
    //     const transactionsRef = collection(db, "transaction");
    //     const q = query(
    //       transactionsRef,
    //       where("user_id", "==", `users/${currentUser.uid}`)
    //     );
    //     const querySnapshot = await getDocs(q);
    //     const transactionData = querySnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     console.log(transactionData);
    //     setTransactions(transactionData);
    //   } catch (error) {
    //     console.error("Gagal mengambil data transaksi:", error);
    //   }
    // };
    // fetchTransactions();
  }, []);

  return (
    <Box sx={{ backgroundColor: colors.lightGrey, minHeight: "100vh" }}>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-900">
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
              {transactions1.map((transaction, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {new Date(transaction.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell align="center">
                    Rp {transaction.total.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.waste_products.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    Kg
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => setSelectedTransaction(transaction)}
                      sx={{
                        backgroundColor: "#2c514b",
                        borderRadius: 100,
                        height: 34,
                        textTransform: "none",
                      }}
                      variant="contained"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedTransaction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-2xl w-96">
              <h3 className="text-lg font-semibold mb-4">Detail Transaksi</h3>
              <ul className="mb-4">
                {selectedTransaction.waste_products.map((product, idx) => (
                  <ListItem
                    key={idx}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <ListItemText
                      primary={`${product.waste} (x${product.quantity})`}
                      secondary={`Subtotal: Rp ${product.subtotal.toLocaleString(
                        "id-ID"
                      )}`}
                    />
                  </ListItem>
                ))}
              </ul>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="bg-green-900 rounded-xl text-white px-4 py-2 mt-4"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}

export default TransactionHistory;
