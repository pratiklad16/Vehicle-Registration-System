import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Alert,
  Box
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserMainLayout from '../../components/UserMainLayout';

const vehicleTypes = ['CAR', 'BIKE', 'TRUCK'];

export default function EditUserVehicle() {
  const { vehicleId } = useParams();
  const [formData, setFormData] = useState({
    brand: '',
    color: '',
    name: '',
    model: '',
    vehicleType: '',
    registrationNumber: '',
    manufactureYear: '',
    vehicleIdentificationNumber: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/MyVehicles/${vehicleId}`);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to fetch vehicle details');
        console.error(err);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.put(`http://localhost:8080/api/user/updateVehicle/${vehicleId}`, {
        ...formData,
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to update vehicle');
      console.error(err);
    }
  };

  return (
    <UserMainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Edit Vehicle
        </Typography>

        {success && <Alert severity="success">Vehicle updated successfully!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="brand"
                    label="Brand"
                    fullWidth
                    required
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="color"
                    label="Color"
                    fullWidth
                    required
                    value={formData.color}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Vehicle Name"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="model"
                    label="Model"
                    fullWidth
                    required
                    value={formData.model}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="vehicleType"
                    label="Vehicle Type"
                    select
                    fullWidth
                    required
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    {vehicleTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="registrationNumber"
                    label="Registration Number"
                    fullWidth
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="manufactureYear"
                    label="Manufacture Year"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={formData.manufactureYear}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="vehicleIdentificationNumber"
                    label="VIN (Vehicle Identification Number)"
                    fullWidth
                    required
                    value={formData.vehicleIdentificationNumber}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary" size="large">
                      Update Vehicle
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </UserMainLayout>
  );
}
