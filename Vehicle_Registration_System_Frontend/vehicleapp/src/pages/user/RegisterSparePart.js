// pages/VehicleDetails.jsx
import React, { useState } from 'react';
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
import UserMainLayout from '../../components/UserMainLayout';

const vehicleTypes = ['CAR', 'BIKE', 'TRUCK']; // Adjust based on your enum

export default function RegisterSparePart() {
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    vehicleType: '',
    compatibleModels: '',
    quantityInStock: '',
    vendorName: '',
    price: ''
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
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:8080/api/spare-parts',
        {
          ...formData,
          quantityInStock: parseInt(formData.quantityInStock),
          price: parseFloat(formData.price)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess(true);
      setFormData({
        partName: '',
        partNumber: '',
        vehicleType: '',
        compatibleModels: '',
        quantityInStock: '',
        vendorName: '',
        price: ''
      });
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to register spare part';
      setError(message);
      console.error(err);
    }
  };

  return (
    <UserMainLayout>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Register Spare Part
        </Typography>

        {success && <Alert severity="success">Spare part registered successfully!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <TextField
                    name="partName"
                    label="Part Name"
                    fullWidth
                    required
                    value={formData.partName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="partNumber"
                    label="Part Number"
                    fullWidth
                    required
                    value={formData.partNumber}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
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

                <Grid item xs={12}>
                  <TextField
                    name="compatibleModels"
                    label="Compatible Models"
                    fullWidth
                    required
                    value={formData.compatibleModels}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="quantityInStock"
                    label="Quantity In Stock"
                    type="number"
                    fullWidth
                    required
                    value={formData.quantityInStock}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="vendorName"
                    label="Vendor Name"
                    fullWidth
                    required
                    value={formData.vendorName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="price"
                    label="Price (₹)"
                    type="number"
                    fullWidth
                    required
                    value={formData.price}
                    onChange={handleChange}
                    inputProps={{ step: "0.01" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary" size="large">
                      Register Spare Part
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
