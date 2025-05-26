import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import axios from 'axios';
import MainLayout from '../../components/AdminMainLayout';

export default function ViewOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error('Error fetching order:', err));
  }, [orderId]);

  if (!order) {
    return (
      <MainLayout>
        <Typography variant="h5" m={2}>
          Loading order details...
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      <Card sx={{ m: 2 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            📦 Order Info
          </Typography>
          <Typography>Order ID: {order.id}</Typography>
          <Typography>Quantity: {order.quantity}</Typography>
          <Typography>Total Price: ₹{order.totalPrice}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Typography>Order Date: {order.orderDate}</Typography>
          <Typography>Inventory Transaction: {order.isInventoryTransaction ? 'Yes' : 'No'}</Typography>
          <Typography>Changes Made: {order.deliveryAddress}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            ⚙️ Spare Part Details
          </Typography>
          <Typography>Part ID: {order.partId}</Typography>
          <Typography>Part Name: {order.partName}</Typography>
          <Typography>Part Number: {order.partNumber}</Typography>
          <Typography>Unit Price: ₹{order.unitPrice}</Typography>

          <CardActions sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                navigate(`/admin/ViewSparePartDetail/${order.partId}`)
              }
            >
              View Spare Part Details
            </Button>
          </CardActions>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            👤 User Details
          </Typography>
          <Typography>User ID: {order.userId}</Typography>
          <Typography>User Name: {order.userName}</Typography>
          <Typography>User Email: {order.userEmail}</Typography>

          <CardActions sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/admin/ViewUserDetail/${order.userId}`)}
            >
              View User Details
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
