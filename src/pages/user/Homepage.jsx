import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Navbar from "../../components/Navbar";

const colors = {
  darkGreen: "#2C514B",
  green: "4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const formattedDate = new Date("2025-03-06").toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

console.log(formattedDate);

const transactions = [
  {
    username: "Susanti",
    total: 1800000,
    date: new Date("6 Maret 2025"),
    products: [
      { name: "Kertas Daur Ulang", quantity: 3, subtotal: 450000 },
      { name: "Botol Plastik", quantity: 5, subtotal: 750000 },
      { name: "Kaleng Aluminium", quantity: 8, subtotal: 600000 },
    ],
  },
  {
    username: "Susanti",
    total: 1125000,
    date: new Date("5 Maret 2025"),
    products: [
      { name: "Botol Kaca", quantity: 2, subtotal: 375000 },
      { name: "Kardus", quantity: 4, subtotal: 750000 },
    ],
  },
];

const totalBalance = transactions.reduce(
  (sum, transaction) => sum + transaction.total,
  0
);

const Homepage = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: colors.lightGrey, minHeight: "100vh", p: 3 }}>
        {/* Greeting Section */}
        <Typography
          variant="h4"
          sx={{ color: colors.darkGreen, fontWeight: "bold" }}
        >
          Selamat datang, Susanti!
        </Typography>

        {/* Balance Display */}
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
                  {transaction.username} - Rp{" "}
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
                  {transaction.products.map((product, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <ListItemText
                        primary={`${product.name} (x${product.quantity})`}
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
    </>
  );
};

export default Homepage;
