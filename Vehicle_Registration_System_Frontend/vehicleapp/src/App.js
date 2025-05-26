// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
//Auth and HomPage Imports
import HomePage from './components/HomePage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';

// User Imports
import UserDashboard from './pages/user/UserDashboard';
import RegisterVehicle from './pages/user/RegisterVehicle';
import RegisterSparePart from './pages/user/RegisterSparePart';
import MyVehicles from './pages/user/MyVehicles';
import MySpareParts from './pages/user/MySpareParts';
import MyOrders from './pages/user/MyOrders';
import AllSpareParts from './pages/user/AllSpareParts';
import ViewUserProfile from './pages/user/ViewUserProfile';
import EditUserProfile from './pages/user/EditUserProfile';
import UserViewVehicleDetail from './pages/user/UserViewVehicleDetail';
import UserViewSparePartDetail from './pages/user/UserViewSparePartDetail';
import EditUserVehicle from './pages/user/EditUserVehicle';
import EditUserSparePart from './pages/user/EditUserSparePart';
// Admin Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import SpareParts from './pages/admin/SpareParts';
import Orders from './pages/admin/Orders';
import EditProfile from './pages/admin/EditProfile';
import Vehicles from './pages/admin/Vehicles';
import ViewUserDetail from './pages/admin/ViewUserDetail';
import ViewSparePartDetail from './pages/admin/ViewSparePartDetail';
import ViewVehicleDetail from './pages/admin/ViewVehicleDetail';
import ViewOrderDetail from './pages/admin/ViewOrderDetail';
import ViewProfile from './pages/admin/ViewProfile';


// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          // Auth and HomePage Routes
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/login" element={<Login />} />
          // User Routes
          <Route path="/user/UserDashboard" element={<UserDashboard />} />
          <Route path="/user/RegisterVehicle" element={<RegisterVehicle />} />
          <Route path="/user/RegisterSparePart" element={<RegisterSparePart />} />
          <Route path="/user/MyVehicles" element={<MyVehicles />} />
          <Route path="/user/MySpareParts" element={<MySpareParts />} />
          <Route path="/user/MyOrders" element={<MyOrders />} />
          <Route path="/user/AllSpareParts" element={<AllSpareParts />} />
          <Route path="/user/ViewUserProfile" element={<ViewUserProfile />} />
          <Route path="/user/EditUserProfile" element={<EditUserProfile />} />
          <Route path="/user/UserViewVehicleDetail/:vehicleId" element={<UserViewVehicleDetail />} />
          <Route path="/user/UserViewSparePartDetail/:partId" element={<UserViewSparePartDetail />} />
          <Route path="/user/EditUserVehicle/:vehicleId" element={<EditUserVehicle />} />
          <Route path="/user/EditUserSparePart/:partId" element={<EditUserSparePart />} />
          // Admin Routes
          <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/Users" element={<Users />} />
          <Route path="/admin/SpareParts" element={<SpareParts />} />
          <Route path="/admin/Orders" element={<Orders />} />
          <Route path="/admin/EditProfile" element={<EditProfile />} />
          <Route path="/admin/Vehicles" element={<Vehicles />} />
          <Route path="/admin/ViewUserDetail/:userId" element={<ViewUserDetail />} />
          <Route path="/admin/ViewSparePartDetail/:partId" element={<ViewSparePartDetail />} />
          <Route path="/admin/ViewVehicleDetail/:vehicleId" element={<ViewVehicleDetail />} />
          <Route path="/admin/ViewOrderDetail/:orderId" element={<ViewOrderDetail />} />
          <Route path="/admin/ViewProfile" element={<ViewProfile />} />

          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;