import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UserMainLayout from '../../components/UserMainLayout';
import axios from 'axios';

export default function AllSpareParts() {
  const [spareParts, setSpareParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/spare-parts');
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setSpareParts(data);
        setFilteredParts(data);
      } catch (err) {
        console.error('Failed to fetch spare parts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = spareParts.filter((part) =>
      Object.values({
        id: part.id,
        partName: part.partName,
        partNumber: part.partNumber,
        compatibleModels: part.compatibleModels,
        quantityInStock: part.quantityInStock,
        vendorName: part.vendorName,
        price: part.price,
        userId: part.userId,
        userName: part.userName
      })
        .join(' ')
        .toLowerCase()
        .includes(lowerQuery)
    );
    setFilteredParts(filtered);
  }, [searchQuery, spareParts]);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 60 },
    { field: 'partName', headerName: 'Part Name', flex: 1, minWidth: 120 },
    { field: 'partNumber', headerName: 'Part Number', flex: 1, minWidth: 120 },
    { field: 'compatibleModels', headerName: 'Compatible Models', flex: 1.5, minWidth: 160 },
    { field: 'quantityInStock', headerName: 'Quantity', flex: 0.7, minWidth: 90 },
    { field: 'vendorName', headerName: 'Vendor Name', flex: 1, minWidth: 130 },
    { field: 'price', headerName: 'Price (₹)', flex: 0.8, minWidth: 100 },
    { field: 'userId', headerName: 'User ID', flex: 0.7, minWidth: 80 },
    { field: 'userName', headerName: 'User Name', flex: 1, minWidth: 130 }
  ];

  return (
    <UserMainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        All Spare Parts
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Search by any field"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

          <Box sx={{
            height: '75vh',
            width: '100%',
            overflowX: 'auto',
            backgroundColor: '#fff',
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
          }}>
            <DataGrid
              rows={filteredParts}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
              getRowId={(row) => row.id}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#e0e0e0',
                  fontWeight: '600',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f1f1f1',
                },
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                  backgroundColor: '#fafafa',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflowX: 'auto',
                },
                fontSize: '0.9rem',
              }}
            />
          </Box>
        </>
      )}
    </UserMainLayout>
  );
}
