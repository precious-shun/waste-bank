//component management
import { Box, Typography, Grid, Paper, colors } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../../components/Sidebar";

import { useEffect, useState } from "react";
//firebase
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        setTotalUsers(usersSnapshot.size); // Number of documents in the collection
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchTotalUsers();
  }, []);

  const [report, setReport] = useState({
    total_balance: 0,
    total_quantity: 0,
    total_transactions: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsSnapshot = await getDocs(
          collection(db, "transactions")
        );

        let totalBalance = 0;
        let totalQuantity = 0;
        let totalTransactions = transactionsSnapshot.size;
        let monthlyData = {};

        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          totalBalance += data.total;

          // Hitung total quantity dari semua waste products
          if (data.waste_products) {
            data.waste_products.forEach((waste) => {
              totalQuantity += waste.quantity;
            });
          }
        });

        setReport({
          total_balance: totalBalance,
          total_quantity: totalQuantity,
          total_transactions: totalTransactions,
        });

        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.date);
          const monthYear = date.toLocaleString("id-ID", {
            month: "short",
            year: "numeric",
          });

          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { month: monthYear, revenue: 0 };
          }

          monthlyData[monthYear].revenue += data.total;
        });

        // Konversi ke array dan urutkan berdasarkan bulan
        const formattedData = Object.values(monthlyData).sort(
          (a, b) => new Date("1 " + a.month) - new Date("1 " + b.month)
        );

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <div
        style={{ backgroundColor: "#EBEBEB" }}
        className="px-8 flex h-screen"
      >
        <Sidebar />
        <div className="w-full py-4 h-screen">
          <div className="text-3xl font-bold mb-4 text-green-900">
            Dashboard
          </div>
          <div className="mb-6 flex flex-row gap-4">
            <Box sx={{ flexGrow: 1, p: 1, ml: "0px", mt: "0px" }}>
              {/* Statistics Cards */}
              <Grid container spacing={3}>
                {[
                  { title: "Total Users", value: totalUsers },
                  {
                    title: "Total Waste",
                    value: `${report.total_quantity} Kg`,
                  },
                  {
                    title: "Total Balance",
                    value: `Rp ${report.total_balance.toLocaleString("id-ID")}`,
                  },
                  {
                    title: "Total Transaction",
                    value: `${report.total_transactions}`,
                  },
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "#c2d1c8",
                      }}
                    >
                      <Typography variant="h6" sx={{ color: " #2c514b" }}>
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ mt: 1, color: " #2c514b" }}
                      >
                        {stat.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* example */}
              <Paper sx={{ p: 3, mt: 3, backgroundColor: "#c2d1c8" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: " #2c514b" }}
                >
                  Monthly Revenue
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#d66c42"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
