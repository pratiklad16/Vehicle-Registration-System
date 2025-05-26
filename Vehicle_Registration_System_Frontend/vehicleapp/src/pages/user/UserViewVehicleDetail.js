import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Grid,
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import UserMainLayout from '../../components/UserMainLayout';
import axios from 'axios';

// Icons
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function UserViewVehicleDetail() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/MyVehicles/${vehicleId}`);
        setVehicle(response.data);
      } catch (err) {
        console.error('Failed to fetch vehicle details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  const handleEdit = () => {
    navigate(`/user/EditUserVehicle/${vehicleId}`);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/user/deleteVehicle/${vehicleId}`);
      alert(response.data.message || 'Vehicle deleted successfully!');
      navigate('/user/MyVehicles');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete vehicle. Please try again.');
    }
  };

  const renderVehicleIcon = (type) => {
    switch (type) {
      case 'CAR':
        return <TimeToLeaveIcon sx={{ fontSize: 160, color: '#1976d2' }} />;
      case 'BIKE':
        return <TwoWheelerIcon sx={{ fontSize: 160, color: '#388e3c' }} />;
      case 'TRUCK':
        return <LocalShippingIcon sx={{ fontSize: 160, color: '#f57c00' }} />;
      default:
        return null;
    }
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  if (!vehicle) {
    return (
      <UserMainLayout>
        <Typography variant="h6" color="error">
          Vehicle not found.
        </Typography>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Vehicle Details
      </Typography>

      <Card sx={{ maxWidth: 1100, mx: 'auto', mt: 4, boxShadow: 4, borderRadius: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="280px"
          sx={{ backgroundColor: '#eef3f8', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        >
          {renderVehicleIcon(vehicle.vehicleType)}
        </Box>

        <CardContent>
          {/* Section: Basic Info */}
          <SectionCard title="Basic Information">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><InfoBox label="Vehicle ID" value={vehicle.id} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="Brand" value={vehicle.brand} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="Name" value={vehicle.name} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="Model" value={vehicle.model} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="Color" value={vehicle.color} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="Type" value={vehicle.vehicleType} /></Grid>
            </Grid>
          </SectionCard>

          {/* Section: Registration Info */}
          <SectionCard title="Registration & Manufacturer Info" mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><InfoBox label="Registration Number" value={vehicle.registrationNumber} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="Manufacture Year" value={new Date(vehicle.manufactureYear).getFullYear()} /></Grid>
              <Grid item xs={12} sm={6}><InfoBox label="VIN" value={vehicle.vehicleIdentificationNumber} /></Grid>
            </Grid>
          </SectionCard>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        <CardActions>
          <Stack direction="row" spacing={2} justifyContent="center" width="100%" pb={2}>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Vehicle
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete Vehicle
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </UserMainLayout>
  );
}

// Info Display Box
const InfoBox = ({ label, value }) => (
  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff' }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600}>
      {value}
    </Typography>
  </Paper>
);

// Section Wrapper
const SectionCard = ({ title, children, mt = 0 }) => (
  <Box sx={{ mt }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);
