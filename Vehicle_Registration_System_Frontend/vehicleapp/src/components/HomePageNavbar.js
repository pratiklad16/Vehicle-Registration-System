// src/components/Navbar.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#0d47a1', // Deep blue
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Toolbar>
        {/* Left side - Icon and App name */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <DirectionsCarIcon sx={{ mr: 1, fontSize: 30 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}
          >
            Vehicle Registration System
          </Typography>
        </Box>

        {/* Right side - Login and Signup buttons */}
        <Box>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/auth/login')}
            sx={{
              color: '#fff',
              borderColor: '#fff',
              mr: 1,
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/auth/signup')}
            sx={{
              backgroundColor: '#ffc107',
              color: '#000',
              '&:hover': {
                backgroundColor: '#ffb300'
              }
            }}
          >
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
