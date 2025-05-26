// pages/VehicleDetails.jsx
import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Box } from "@mui/material";
import UserMainLayout from "../../components/UserMainLayout";

export default function UserDashboard() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <UserMainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {username} 👋
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          Here's an overview of your registered vehicles.
        </Typography>

        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Use the sidebar to navigate through the system. You can register
              vehicles, manage spare parts, and view your orders easily from
              there.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </UserMainLayout>
  );
}
