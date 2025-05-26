import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/AdminMainLayout';
import {
  Typography,
  Card,
  CardContent,
  IconButton,
  Box,
  Stack,
  Tooltip,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/getAllVehicles');
      // Ensure each vehicle has an id field
      const vehiclesWithIds = response.data.map((vehicle, index) => ({
        ...vehicle,
        id: vehicle.id || index + 1, // Fallback ID if missing
      }));
      setVehicles(vehiclesWithIds);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/deleteVehicle/${vehicleId}`);
      alert('Vehicle deleted successfully');
      fetchVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert('Failed to delete vehicle');
    }
  };

  const handleView = (vehicleId) => {
    navigate(`/admin/ViewVehicleDetail/${vehicleId}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'brand', headerName: 'Brand', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'model', headerName: 'Model', flex: 1 },
    {
      field: 'vehicleType',
      headerName: 'Type',
      flex: 1,
    },
    { field: 'registrationNumber', headerName: 'Reg. Number', flex: 1.2 },
    { field: 'ownerName', headerName: 'Owner Name', flex: 1.2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // Add null check for params and params.row
        if (!params || !params.row) {
          return null;
        }
        
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton color="primary" onClick={() => handleView(params.row.id)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Vehicle">
              <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!vehicle) return false;
    
    return Object.values(vehicle).some((value) => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  return (
    <MainLayout>
      <Card sx={{ m: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Vehicle Management
          </Typography>

          <TextField
            label="Search Vehicles"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field..."
          />

          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredVehicles}
              columns={columns}
              loading={loading}
              getRowId={(row) => row?.id || Math.random()}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
    </MainLayout>
  );
}