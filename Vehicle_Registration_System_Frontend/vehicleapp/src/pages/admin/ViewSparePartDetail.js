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

export default function ViewSparePartDetail() {
  const { partId } = useParams();
  const navigate = useNavigate();
  const [sparePart, setSparePart] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/spare-parts/${partId}`)
      .then((res) => setSparePart(res.data))
      .catch((err) => console.error('Error fetching spare part:', err));
  }, [partId]);

  if (!sparePart) {
    return (
      <MainLayout>
        <Typography variant="h5" m={2}>
          Loading spare part details...
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Spare Part Details
      </Typography>

      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚙️ Spare Part Info
          </Typography>
          <Typography>Part ID: {sparePart.id}</Typography>
          <Typography>Part Name: {sparePart.partName}</Typography>
          <Typography>Part Number: {sparePart.partNumber}</Typography>
          <Typography>Vehicle Type: {sparePart.vehicleType}</Typography>
          <Typography>Compatible Models: {sparePart.compatibleModels}</Typography>
          <Typography>Quantity In Stock: {sparePart.quantityInStock}</Typography>
          <Typography>Vendor Name: {sparePart.vendorName}</Typography>
          <Typography>Unit Price: ₹{sparePart.price}</Typography>
          <Typography>Added On: {sparePart.addedOn}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            👤 User Details
          </Typography>
          <Typography>User ID: {sparePart.userId}</Typography>
          <Typography>User Name: {sparePart.userName}</Typography>
          <Typography>User Email: {sparePart.userEmail}</Typography>

          <CardActions sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate(`/admin/ViewUserDetail/${sparePart.userId}`)
              }
            >
              View User Details
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
