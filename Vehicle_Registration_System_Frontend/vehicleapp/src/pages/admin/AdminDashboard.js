import React from "react";
import MainLayout from "../../components/AdminMainLayout"; // Adjust the path as needed
import { Typography, Box } from "@mui/material";

export default function AdminDashboard() {
  return (
    <MainLayout>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          This is your central hub for managing users, vehicles, spare parts, and orders.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Use the menu on the left to navigate through the administrative tools. Monitor activity,
          ensure smooth operations, and keep everything running efficiently.
        </Typography>
      </Box>
    </MainLayout>
  );
}
