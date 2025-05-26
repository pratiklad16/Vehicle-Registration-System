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

export default function Users() {
  const [owners, setOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/getAllOwners');
      const ownersWithIds = response.data.map((owner, index) => ({
        ...owner,
        id: owner.userId || index + 1,
      }));
      setOwners(ownersWithIds);
    } catch (err) {
      console.error('Error fetching owners:', err);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/DeleteUser/${userId}`);
      alert('Owner deleted successfully');
      fetchOwners();
    } catch (err) {
      console.error('Error deleting owner:', err);
      alert('Failed to delete owner');
    }
  };

  const handleView = (userId) => {
    navigate(`/admin/ViewUserDetail/${userId}`);
  };

  const columns = [
    { field: 'userId', headerName: 'User ID', flex: 1 },
    { field: 'ownerName', headerName: 'Owner Name', flex: 1.5 },
    { field: 'ownerEmail', headerName: 'Email', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        if (!params || !params.row) return null;

        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton color="primary" onClick={() => handleView(params.row.userId)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Owner">
              <IconButton color="error" onClick={() => handleDelete(params.row.userId)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const filteredOwners = owners.filter((owner) =>
    Object.values(owner).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <MainLayout>
      <Card sx={{ m: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Owners Management
          </Typography>

          <TextField
            label="Search Owners"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field..."
          />

          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredOwners}
              columns={columns}
              loading={loading}
              getRowId={(row) => row?.id || Math.random()}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
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
