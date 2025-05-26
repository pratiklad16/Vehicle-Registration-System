import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/AdminMainLayout';
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Box,
  Stack,
  Tooltip,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get('http://localhost:8080/api/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error fetching orders:', err));
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/deleteOrder/${orderId}`);
      alert('Order deleted successfully');
      fetchOrders(); // Refresh data after delete
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order');
    }
  };

  const handleView = (orderId) => {
    navigate(`/admin/ViewOrderDetail/${orderId}`);
  };

  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'totalPrice', headerName: 'Total Price', flex: 1 },
    { field: 'orderDate', headerName: 'Order Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'partId', headerName: 'Part ID', flex: 1 },
    { field: 'partName', headerName: 'Part Name', flex: 1 },
    { field: 'partNumber', headerName: 'Part Number', flex: 1 },
    { field: 'unitPrice', headerName: 'Unit Price', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton color="primary" onClick={() => handleView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Order">
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // Filtered rows based on search query
  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <MainLayout>
      <Card sx={{ m: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Orders Management
          </Typography>

          <TextField
            label="Search Orders"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field..."
          />

          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
