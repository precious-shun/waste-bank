import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

// const transactions = [
//   {
//     username: "Susanti",
//     total: 1800000,
//     date: new Date("2025-03-06"),
//     products: [
//       { name: "Kertas Daur Ulang", quantity: 3, subtotal: 450000 },
//       { name: "Botol Plastik", quantity: 5, subtotal: 750000 },
//       { name: "Kaleng Aluminium", quantity: 8, subtotal: 600000 },
//     ],
//   },
//   {
//     username: "Susanti",
//     total: 1125000,
//     date: new Date("2025-03-05"),
//     products: [
//       { name: "Botol Kaca", quantity: 2, subtotal: 375000 },
//       { name: "Kardus", quantity: 4, subtotal: 750000 },
//     ],
//   },
// ];

const Homepage = () => {
  const [transactions, setTrans] = useState([]);
  //   const loginID = "aOSiV98JHmOdxEifE8dYQoWH05l2";

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "transactions"));
        const transactionsList = []; // Temporary array to store transactions

        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          const userRef = data.user_id; // Firestore reference to "users"
          const wasteProducts = data.waste_products || []; // Array of waste products

          let fullname = "Unknown"; // Default value
          let wasteProductDetails = []; // To store transformed waste products

          // Fetch User Fullname
          if (userRef) {
            try {
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                fullname = userSnap.data().fullname;
              }
            } catch (err) {
              console.error("Error fetching user data:", err);
            }
          }

          // Fetch Waste Products Data
          wasteProductDetails = await Promise.all(
            wasteProducts.map(async (wp) => {
              let wasteName = "Unknown"; // Default waste name

              if (wp.waste_product_id) {
                try {
                  const wasteSnap = await getDoc(wp.waste_product_id);
                  if (wasteSnap.exists()) {
                    wasteName = wasteSnap.data().waste; // Get waste name
                  }
                } catch (err) {
                  console.error("Error fetching waste data:", err);
                }
              }

              return {
                quantity: wp.quantity,
                subtotal: wp.subtotal,
                waste: wasteName, // Replace waste_product_id with waste name
              };
            })
          );

          // Store transaction in the temporary array
          transactionsList.push({
            id: docSnapshot.id,
            date: data.date.toDate(),
            total: data.total,
            fullname, // Store fullname instead of user_id
            waste_products: wasteProductDetails, // Store waste details instead of waste_product_id
          });
        }

        // Update state once with all transactions
        setTrans(transactionsList);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransaction();
  }, []);

  const totalBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.total,
    0
  );
  return (
    <Box sx={{ backgroundColor: colors.lightGrey, minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ p: 3 }}>
        {/* Greeting Section */}
        <Typography
          variant="h4"
          sx={{ color: colors.darkGreen, fontWeight: "bold" }}
        >
          Selamat datang, User!
        </Typography>

        {/* Account Balance */}
        <Paper
          sx={{
            p: 2,
            mt: 2,
            backgroundColor: colors.white,
            borderLeft: `5px solid ${colors.green}`,
          }}
        >
          <Typography variant="h6" sx={{ color: colors.green }}>
            Saldo Akun
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: colors.orange }}
          >
            Rp {totalBalance.toLocaleString("id-ID")}
          </Typography>
        </Paper>

        {/* Transaction History */}
        <Paper sx={{ p: 2, mt: 3, backgroundColor: colors.white }}>
          <Typography variant="h6" sx={{ color: colors.green, mb: 1 }}>
            Riwayat Transaksi
          </Typography>

          <List>
            {transactions.map((transaction, index) => (
              <ListItem key={index} divider sx={{ display: "block" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: colors.darkGreen }}
                >
                  {transaction.fullname} - Rp{" "}
                  {transaction.total.toLocaleString("id-ID")}
                </Typography>

                <Typography variant="body2" sx={{ color: colors.green }}>
                  {transaction.date.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>

                <List sx={{ pl: 2, mt: 1 }}>
                  {transaction.waste_products.map((product, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <ListItemText
                        primary={`${product.waste} (x${product.quantity})`}
                        secondary={`Subtotal: Rp ${product.subtotal.toLocaleString("id-ID")}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Homepage;
