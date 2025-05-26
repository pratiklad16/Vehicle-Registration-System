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

export default function SpareParts() {
  const [spareParts, setSpareParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = () => {
    axios
      .get('http://localhost:8080/api/spare-parts')
      .then((res) => setSpareParts(res.data))
      .catch((err) => console.error('Error fetching spare parts:', err));
  };

  const handleDelete = async (partId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/deleteSparePart/${partId}`);
      alert('Spare part deleted successfully');
      fetchSpareParts();
    } catch (err) {
      console.error('Error deleting spare part:', err);
      alert('Failed to delete spare part');
    }
  };

  const handleView = (partId) => {
    navigate(`/admin/ViewSparePartDetail/${partId}`);
  };

  const columns = [
    { field: 'id', headerName: 'Part ID', flex: 1 },
    { field: 'partName', headerName: 'Part Name', flex: 1 },
    { field: 'partNumber', headerName: 'Part Number', flex: 1 },
    { field: 'quantityInStock', headerName: 'Stock Qty', flex: 1 },
    { field: 'vendorName', headerName: 'Vendor Name', flex: 1 },
    { field: 'price', headerName: 'Price (₹)', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.2,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton color="primary" onClick={() => handleView(params.row.id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Spare Part">
            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // Filtered rows based on search query
  const filteredParts = spareParts.filter((part) =>
    Object.values(part).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <MainLayout>
      <Card sx={{ m: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Spare Parts Management
          </Typography>

          <TextField
            label="Search Spare Parts"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field..."
          />

          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredParts}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
