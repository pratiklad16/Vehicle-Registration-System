import React, { useState } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Container,
  Alert,
  Box
} from '@mui/material';
import axios from 'axios';
import UserMainLayout from '../../components/UserMainLayout';

const vehicleTypes = ['CAR', 'BIKE', 'TRUCK'];

export default function RegisterVehicle() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/user/registerVehicle', {
        ...formData,
      });
      setSuccess(true);
      setFormData({
        brand: '',
        color: '',
        name: '',
        model: '',
        vehicleType: '',
        registrationNumber: '',
        manufactureYear: '',
        vehicleIdentificationNumber: '',
      });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to register vehicle. Please try again.';
      setError(message);
      console.error(err);
    }
  };

  return (
    <UserMainLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Register Vehicle
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Vehicle registered successfully!
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  name="brand"
                  label="Brand"
                  fullWidth
                  required
                  value={formData.brand}
                  onChange={handleChange}
                />
                <TextField
                  name="color"
                  label="Color"
                  fullWidth
                  required
                  value={formData.color}
                  onChange={handleChange}
                />
                <TextField
                  name="name"
                  label="Vehicle Name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  name="model"
                  label="Model"
                  fullWidth
                  required
                  value={formData.model}
                  onChange={handleChange}
                />
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
                <TextField
                  name="registrationNumber"
                  label="Registration Number"
                  fullWidth
                  required
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
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
                <TextField
                  name="vehicleIdentificationNumber"
                  label="VIN (Vehicle Identification Number)"
                  fullWidth
                  required
                  value={formData.vehicleIdentificationNumber}
                  onChange={handleChange}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Register Vehicle
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </UserMainLayout>
  );
}
