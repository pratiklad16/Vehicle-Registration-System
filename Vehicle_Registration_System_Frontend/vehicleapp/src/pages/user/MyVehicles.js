import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  TextField,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserMainLayout from '../../components/UserMainLayout';
import axios from 'axios';

// Icons
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8080/api/user/getUserVehicles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = vehicles.filter((vehicle) =>
      `${vehicle.brand} ${vehicle.name} ${vehicle.vehicleType} ${vehicle.registrationNumber}`
        .toLowerCase()
        .includes(lowerQuery)
    );
    setFilteredVehicles(filtered);
  }, [searchQuery, vehicles]);

  const handleView = (vehicleId) => {
    navigate(`/user/UserViewVehicleDetail/${vehicleId}`);
  };

  const renderVehicleIcon = (type) => {
    switch (type) {
      case 'CAR':
        return <TimeToLeaveIcon sx={{ fontSize: 80, color: '#1976d2' }} />;
      case 'BIKE':
        return <TwoWheelerIcon sx={{ fontSize: 80, color: '#388e3c' }} />;
      case 'TRUCK':
        return <LocalShippingIcon sx={{ fontSize: 80, color: '#f57c00' }} />;
      default:
        return null;
    }
  };

  return (
    <UserMainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Vehicles
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search vehicles"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {filteredVehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}
                >
                  {renderVehicleIcon(vehicle.vehicleType)}
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {vehicle.brand} {vehicle.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Type:</strong> {vehicle.vehicleType}<br />
                      <strong>Registration No:</strong> {vehicle.registrationNumber}<br />
                      <strong>ID:</strong> {vehicle.id}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleView(vehicle.id)}>
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </UserMainLayout>
  );
}
