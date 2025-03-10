//component management
import {
  Box,
  Typography,
  Grid,
  Paper,
  colors,
  MenuItem,
  Select,
} from "@mui/material";
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
import { db } from "../../services/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { toast } from "sonner";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
          const date = data.date.toDate
            ? data.date.toDate()
            : new Date(data.date);
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
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];

        const formattedData = Object.values(monthlyData).sort((a, b) => {
          const [monthA, yearA] = a.month.split(" "); // Pisahkan bulan & tahun
          const [monthB, yearB] = b.month.split(" ");

          const yearDiff = parseInt(yearA) - parseInt(yearB); // Bandingkan tahun
          if (yearDiff !== 0) return yearDiff;

          return monthNames.indexOf(monthA) - monthNames.indexOf(monthB); // Bandingkan bulan
        });

        const filteredData = formattedData.filter((data) => {
          const year = parseInt(data.month.split(" ")[1]);
          return year === selectedYear;
        });

        setChartData(filteredData);
      } catch (error) {
        toast.error("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, [selectedYear]);

  return (
    <>
      <div
        style={{ backgroundColor: "#EBEBEB" }}
        className="px-4 md:px-8 flex h-screen"
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
                  <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        backgroundColor: "#c2d1c8",
                        borderRadius: "20px",
                      }}
                    >
                      <div className="text-darkgreen text-xl mb-3">
                        {stat.title}
                      </div>
                      <div className="text-darkgreen text-3xl font-bold">
                        {stat.value}
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {[
                  { title: "Total Users", value: report.total_users },
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
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-600">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div> */}

              {/* example */}
              <Paper
                sx={{
                  p: 3,
                  mt: 3,
                  backgroundColor: "#c2d1c8",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: " #2c514b", fontWeight: 600 }}
                >
                  Monthly Revenue
                </Typography>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  data-testid="year-dropdown"
                  sx={{
                    mb: 2,
                    backgroundColor: "#ebebeb",
                    borderRadius: "10px",
                  }}
                  MenuProps={{ disablePortal: true }}
                >
                  {[2022, 2023, 2024, 2025, 2026, 2027].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
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
