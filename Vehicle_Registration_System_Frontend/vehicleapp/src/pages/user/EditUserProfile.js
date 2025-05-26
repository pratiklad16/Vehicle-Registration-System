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
import axios from 'axios';
import UserMainLayout from '../../components/UserMainLayout';

export default function EditUserProfile() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    userRole: '',
    licenseNumber: '',
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/GetUserProfile');
        setFormData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    try {
      await axios.put('http://localhost:8080/api/user/updateProfile', formData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <UserMainLayout>
        <Container maxWidth="sm">
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
          Edit User Profile
        </Typography>

        {success && <Alert severity="success">Profile updated successfully!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="id"
                    label="User ID"
                    value={formData.id}
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="userRole"
                    label="User Role"
                    value={formData.userRole}
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="email"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="licenseNumber"
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

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
