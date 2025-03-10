import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { EyeIcon } from "@heroicons/react/24/solid";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const tableHead = [
  { text: "Date", bgColor: colors.lightGreen },
  { text: "Total Balance", bgColor: colors.lightGreen },
  { text: "Total Waste", bgColor: colors.lightGreen },
  { text: "Details", bgColor: colors.lightGreen },
];

function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchTransaction = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "transactions"),
            where("user_id", "==", doc(db, "users", user.uid))
          )
        );
        let transactionsList = [];

        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          const wasteProducts = data.waste_products || [];

          let wasteProductDetails = await Promise.all(
            wasteProducts.map(async (wp) => {
              let wasteName = "Unknown";

              if (wp.waste_product_id) {
                try {
                  const wasteSnap = await getDoc(wp.waste_product_id);
                  if (wasteSnap.exists()) {
                    wasteName = wasteSnap.data().waste;
                  }
                } catch (err) {
                  console.error("Error fetching waste data:", err);
                }
              }

              return {
                quantity: wp.quantity,
                subtotal: wp.subtotal,
                waste: wasteName,
              };
            })
          );

          transactionsList.push({
            id: docSnapshot.id,
            date: data.date.toDate(),
            total: data.total,
            waste_products: wasteProductDetails,
          });
        }

        transactionsList.sort((a, b) => b.date - a.date);

        setTransactions(transactionsList);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransaction();
  }, [user]);

  return (
    <Box sx={{ backgroundColor: colors.lightGrey, minHeight: "100vh" }}>
      <Navbar />
      <div className="p-6">
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: colors.darkGreen }}
        >
          Transaction History
        </h2>

        <TableContainer
          elevation="0"
          sx={{
            backgroundColor: colors.lightGreen,
            height: "75%",
            borderRadius: "20px",
          }}
          component={Paper}
        >
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow className="font-semibold">
                {tableHead.map((item, index) => (
                  <TableCell key={index} sx={{ backgroundColor: item.bgColor }}>
                    <b>{item.text}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {transaction.date.toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    Rp {transaction.total.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {transaction.waste_products.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    Kg
                  </TableCell>
                  <TableCell>
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
                      <EyeIcon className="size-5" />
                      <span className="ms-1.5 mt-0.5">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        >
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogContent>
            {selectedTransaction && (
              <>
                <Typography>
                  Date: {selectedTransaction.date.toLocaleDateString("id-ID")}
                </Typography>
                <Typography>
                  Total Balance: Rp{" "}
                  {selectedTransaction.total.toLocaleString("id-ID")}
                </Typography>
                <Typography>
                  Total Waste:{" "}
                  {selectedTransaction.waste_products.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}{" "}
                  Kg
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Waste Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedTransaction.waste_products.map(
                        (product, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{product.waste}</TableCell>
                            <TableCell>{product.quantity} Kg</TableCell>
                            <TableCell>
                              Rp {product.subtotal.toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setSelectedTransaction(null)}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}

export default TransactionHistory;
