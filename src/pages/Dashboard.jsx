//db management
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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

//example
const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 8000 },
];

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

  return (
    <Box sx={{ flexGrow: 1, p: 1, ml: "0px", mt: "0px" }}>
      <Typography variant="h4" gutterBottom sx={{ color: " #2c514b" }}>
        Dashboard
      </Typography>
      {/* Statistics Cards */}
      <Grid container spacing={3}>
        {[
          { title: "Total Users", value: totalUsers },
          { title: "Outcome", value: "Rp250.000,00" },
          { title: "Revenue", value: "Rp500.000,00" },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{ p: 3, textAlign: "center", backgroundColor: "#c2d1c8" }}
            >
              <Typography variant="h6" sx={{ color: " #2c514b" }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: " #2c514b" }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* example */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: "#c2d1c8" }}>
        <Typography variant="h6" gutterBottom sx={{ color: " #2c514b" }}>
          Monthly Revenue
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
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
  );
};

export default Dashboard;
