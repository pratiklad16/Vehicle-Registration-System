// src/components/HomePage.js
import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import Navbar from './HomePageNavbar';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ my: 6 }}>
          <Paper elevation={6} sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              🚗 Vehicle Registration System
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ color: '#555' }}>
              A Complete Solution for Vehicle and Spare Part Management
            </Typography>

            <Typography variant="body1" paragraph sx={{ mt: 3 }}>
              <DirectionsCarIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Seamlessly register, view, and manage your vehicles.
            </Typography>

            <Typography variant="body1" paragraph>
              <BuildIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Track your spare parts with accurate stock and pricing details.
            </Typography>

            <Typography variant="body1" paragraph>
              <PersonIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Whether you're an owner, vendor, or admin — everything you need is just a click away.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" sx={{ color: 'gray' }}>
              Use the navigation bar above to log in or sign up and get started.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;
