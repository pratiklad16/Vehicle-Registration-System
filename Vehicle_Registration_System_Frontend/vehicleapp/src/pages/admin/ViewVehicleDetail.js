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

export default function ViewVehicleDetail() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/admin/vehicles/${vehicleId}`)
      .then((res) => setVehicle(res.data))
      .catch((err) => console.error('Error fetching vehicle:', err));
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <MainLayout>
        <Typography variant="h5" m={2}>
          Loading vehicle details...
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Vehicle Details
      </Typography>

      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚗 Vehicle Info
          </Typography>
          <Typography><strong>Vehicle ID:</strong> {vehicle.id}</Typography>
          <Typography><strong>Brand:</strong> {vehicle.brand}</Typography>
          <Typography><strong>Name:</strong> {vehicle.name}</Typography>
          <Typography><strong>Model:</strong> {vehicle.model}</Typography>
          <Typography><strong>Type:</strong> {vehicle.vehicleType}</Typography>
          <Typography><strong>Color:</strong> {vehicle.color}</Typography>
          <Typography><strong>Registration Number:</strong> {vehicle.registrationNumber}</Typography>
          <Typography><strong>Manufacture Year:</strong> {new Date(vehicle.manufactureYear).getFullYear()}</Typography>
          <Typography><strong>Vehicle Identification Number:</strong> {vehicle.vehicleIdentificationNumber}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            👤 Owner Info
          </Typography>
          <Typography><strong>Owner Name:</strong> {vehicle.ownerName}</Typography>
          <Typography><strong>Owner Email:</strong> {vehicle.ownerEmail}</Typography>
          <Typography><strong>Owner ID:</strong> {vehicle.userId}</Typography>

          <CardActions sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/admin/ViewUserDetail/${vehicle.userId}`)}
            >
              View Owner Details
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
