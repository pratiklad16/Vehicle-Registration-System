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
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserMainLayout from '../../components/UserMainLayout';

export default function ViewUserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/user/GetUserProfile')
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load user profile');
        setLoading(false);
      });
  }, []);

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

  if (error) {
    return (
      <UserMainLayout>
        <Container maxWidth="sm">
          <Alert severity="error">{error}</Alert>
        </Container>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
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
                {userData.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>ID:</strong> {userData.id}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {userData.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Role:</strong> {userData.userRole}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>License Number:</strong> {userData.licenseNumber}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={() => navigate('/user/EditUserProfile')}
            >
              Edit User Profile
            </Button>
          </CardActions>
        </Card>
      </Container>
    </UserMainLayout>
  );
}
