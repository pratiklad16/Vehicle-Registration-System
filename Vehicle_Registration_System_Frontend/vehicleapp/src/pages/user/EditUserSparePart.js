import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserMainLayout from '../../components/UserMainLayout';

export default function EditUserSparePart() {
  const { partId } = useParams();
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    vehicleType: '',
    compatibleModels: '',
    quantityInStock: '',
    vendorName: '',
    price: '',
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch part details
  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/spare-parts/${partId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch spare part details');
        setLoading(false);
      }
    };
    fetchPart();
  }, [partId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.put(`http://localhost:8080/api/spare-parts/${partId}`, formData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update spare part');
    }
  };

  if (loading) {
    return (
      <UserMainLayout>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        </Container>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Edit Spare Part
        </Typography>

        {success && <Alert severity="success">Spare part updated successfully!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {[
                  { name: 'partName', label: 'Part Name' },
                  { name: 'partNumber', label: 'Part Number' },
                  { name: 'vehicleType', label: 'Vehicle Type' },
                  { name: 'compatibleModels', label: 'Compatible Models' },
                  { name: 'quantityInStock', label: 'Quantity In Stock', type: 'number' },
                  { name: 'vendorName', label: 'Vendor Name' },
                  { name: 'price', label: 'Price (₹)', type: 'number' },
                ].map(({ name, label, type = 'text' }) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <TextField
                      name={name}
                      label={label}
                      type={type}
                      fullWidth
                      required
                      value={formData[name]}
                      onChange={handleChange}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    <Button type="submit" variant="contained" color="primary" size="large">
                      Save Changes
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
