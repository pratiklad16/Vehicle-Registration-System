import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import MainLayout from "../../components/AdminMainLayout";

export default function ViewUserDetail() {
  const { userId } = useParams(); // ✅ updated from ownerId to userId
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:8080/api/admin/owners/${userId}`),
      axios.get(`http://localhost:8080/api/admin/ownerVehicles/${userId}`),
      axios.get(`http://localhost:8080/api/spare-parts/user/${userId}`),
      axios.get(`http://localhost:8080/api/orders/user/${userId}`),
    ])
      .then(([userRes, vehiclesRes, partsRes, ordersRes]) => {
        setUser(userRes.data);
        setVehicles(vehiclesRes.data || []);
        setSpareParts(partsRes.data || []);
        setOrders(ordersRes.data || []);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <MainLayout>
        <Typography variant="h5" m={2}>
          Loading user details...
        </Typography>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <Typography variant="h5" m={2}>
          User not found.
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>

      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography variant="h6">👤 Basic Info</Typography>
          <Typography>User ID: {user.userId}</Typography>
          <Typography>Name: {user.ownerName}</Typography>
          <Typography>Email: {user.ownerEmail}</Typography>
          <Typography>
            License Number: {user.ownerLicenseNumber || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom ml={2}>
        🚗 Owned Vehicles
      </Typography>
      <Box sx={{ m: 2 }}>
        <DataGrid
          autoHeight
          rows={vehicles}
          getRowId={(row) => row.id}
          columns={[
            { field: "id", headerName: "ID", width: 90 },
            { field: "brand", headerName: "Brand", width: 150 },
            { field: "name", headerName: "Name", width: 150 },
            { field: "vehicleType", headerName: "Type", width: 150 },
            {
              field: "registrationNumber",
              headerName: "Reg. Number",
              width: 180,
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 180,
              renderCell: (params) => (
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(`/admin/ViewVehicleDetail/${params.row.id}`)
                  }
                >
                  View Vehicle
                </Button>
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom ml={2}>
        🧩 Spare Parts by User
      </Typography>
      <Box sx={{ m: 2 }}>
        <DataGrid
          autoHeight
          rows={spareParts}
          getRowId={(row) => row.id}
          columns={[
            { field: "id", headerName: "ID", width: 90 },
            { field: "partName", headerName: "Name", width: 150 },
            { field: "partNumber", headerName: "Number", width: 150 },
            { field: "vehicleType", headerName: "Type", width: 130 },
            { field: "quantityInStock", headerName: "Stock", width: 100 },
            {
              field: "addedOn",
              headerName: "Added On",
              width: 150,
              valueFormatter: (params) =>
                new Date(params.value).toLocaleDateString(),
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 180,
              renderCell: (params) => (
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(`/admin/ViewSparePartDetail/${params.row.id}`)
                  }
                >
                  View Part
                </Button>
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom ml={2}>
        📦 User Orders
      </Typography>
      <Box sx={{ m: 2 }}>
        <DataGrid
          autoHeight
          rows={orders}
          getRowId={(row) => row.id}
          columns={[
            { field: "id", headerName: "Order ID", width: 130 },
            { field: "quantity", headerName: "Quantity", width: 100 },
            {
              field: "orderDate",
              headerName: "Order Date",
              width: 150,
              valueFormatter: (params) =>
                new Date(params.value).toLocaleDateString(),
            },
            { field: "partName", headerName: "Part Name", width: 150 },
            { field: "unitPrice", headerName: "Unit Price", width: 120 },
            {
              field: "actions",
              headerName: "Actions",
              width: 180,
              renderCell: (params) => (
                <Button
                  variant="outlined"
                  onClick={() =>
                    navigate(`/admin/ViewOrderDetail/${params.row.id}`)
                  }
                >
                  View Order
                </Button>
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
    </MainLayout>
  );
}
