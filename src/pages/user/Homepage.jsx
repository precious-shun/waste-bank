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
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const Homepage = () => {
  const [transactions, setTrans] = useState([]);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const { user } = useAuth();
  const [fullname, setFullname] = useState("Guest");

  console.log("Current User UID:", user?.uid);

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
        const transactionsList = [];

        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          const wasteProducts = data.waste_products || [];
          let wasteProductDetails = [];

          wasteProductDetails = await Promise.all(
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
            fullname,
            waste_products: wasteProductDetails,
          });
        }

        setTrans(transactionsList);

        if (transactionsList.length > 0) {
          const sortedTransactions = transactionsList.sort(
            (a, b) => b.date - a.date
          );
          setLatestTransaction(sortedTransactions[0]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransaction();
  }, [user]);

  useEffect(() => {
    const fetchUserFullname = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            setFullname(userDoc.data().fullname);
          }
        } catch (error) {
          console.error("Error fetching logged-in user's fullname:", error);
        }
      }
    };

    fetchUserFullname();
  }, [user]);

  const totalBalance = transactions.reduce(
    (sum, transaction) => sum + transaction.total,
    0
  );
  return (
    <Box sx={{ backgroundColor: colors.lightGrey, minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{ color: colors.darkGreen, fontWeight: "bold" }}
        >
          Selamat datang, {fullname || "Guest"}!
        </Typography>

        <Paper
          sx={{
            p: 2,
            mt: 2,
            backgroundColor: colors.white,
            borderLeft: `5px solid ${colors.green}`,
            borderRadius: "10px",
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
        <Paper
          sx={{
            p: 2,
            mt: 3,
            backgroundColor: colors.white,
            borderRadius: "20px",
          }}
        >
          <Typography variant="h6" sx={{ color: colors.green, mb: 1 }}>
            Transaksi Terbaru
          </Typography>

          {latestTransaction ? (
            <ListItem divider sx={{ display: "block" }}>
              <Typography
                variant="body2"
                sx={{ color: colors.green, fontWeight: "bold" }}
              >
                {latestTransaction.date.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: colors.darkGreen }}
              >
                Rp {latestTransaction.total.toLocaleString("id-ID")}
              </Typography>

              <List sx={{ pl: 2, mt: 1 }}>
                {latestTransaction.waste_products.map((product, idx) => (
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
          ) : (
            <Typography variant="body2" sx={{ color: colors.orange }}>
              Tidak ada transaksi terbaru.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Homepage;
