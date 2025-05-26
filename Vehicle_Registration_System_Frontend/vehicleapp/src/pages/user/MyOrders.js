import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Box,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UserMainLayout from '../../components/UserMainLayout';
import axios from 'axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/orders/user')
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = orders.filter((order) =>
      Object.values({
        id: order.id,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        orderDate: order.orderDate,
        status: order.status,
        partId: order.partId,
        partName: order.partName,
        partNumber: order.partNumber,
        unitPrice: order.unitPrice,
      })
        .join(' ')
        .toLowerCase()
        .includes(lowerQuery)
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'quantity', headerName: 'Quantity', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'totalPrice', headerName: 'Total Price', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'orderDate', headerName: 'Order Date', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'status', headerName: 'Status', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'partId', headerName: 'Part ID', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'partName', headerName: 'Part Name', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'partNumber', headerName: 'Part Number', flex: 1, headerClassName: 'super-app-theme--header' },
    { field: 'unitPrice', headerName: 'Unit Price', flex: 1, headerClassName: 'super-app-theme--header' },
  ];

  return (
    <UserMainLayout>
      <Card
        sx={{
          m: 3,
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            My Orders
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search Orders"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
                '& label.Mui-focused': {
                  color: theme.palette.primary.main,
                },
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              height: 550,
              width: '100%',
              '& .super-app-theme--header': {
                fontWeight: 'bold',
                backgroundColor: theme.palette.grey[200], // subtle light background for header
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              borderRadius: 2,
              boxShadow: 3,
              overflow: 'hidden',
            }}
          >
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={7}
              rowsPerPageOptions={[7, 14, 21]}
              disableSelectionOnClick
              sx={{
                border: 'none',
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </UserMainLayout>
  );
}
