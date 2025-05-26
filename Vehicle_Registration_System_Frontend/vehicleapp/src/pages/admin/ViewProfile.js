import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  Container,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/AdminMainLayout';
import axios from 'axios';

export default function ViewProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/admin/viewCurrentProfile')
      .then((response) => {
        setAdminData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load admin profile');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="sm">
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="sm">
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Card sx={{ maxWidth: 600, mx: 'auto', boxShadow: 5 }}>
          <CardActionArea>
            <Box
              sx={{
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'grey.300',
              }}
            >
              <PersonIcon
                sx={{
                  color: 'primary.main',
                  fontSize: 100,
                }}
              />
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                {adminData.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ID:</strong> {adminData.id}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {adminData.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Role:</strong> {adminData.userRole}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={() => navigate('/admin/EditProfile')}
            >
              Edit Admin Profile
            </Button>
          </CardActions>
        </Card>
      </Container>
    </MainLayout>
  );
}
