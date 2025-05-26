import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  TextField,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserMainLayout from '../../components/UserMainLayout';
import axios from 'axios';

export default function MySpareParts() {
  const [spareParts, setSpareParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/spare-parts/user');
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
      `${part.partName} ${part.partNumber} ${part.price}`
        .toLowerCase()
        .includes(lowerQuery)
    );
    setFilteredParts(filtered);
  }, [searchQuery, spareParts]);

  const handleView = (partId) => {
    navigate(`/user/UserViewSparePartDetail/${partId}`);
  };

  return (
    <UserMainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        My Spare Parts
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search spare parts"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {filteredParts.map((part) => (
            <Grid item xs={12} sm={6} md={4} key={part.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {part.partName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Part Number:</strong> {part.partNumber}<br />
                      <strong>Quantity:</strong> {part.quantityInStock}<br />
                      <strong>Price:</strong> ₹{part.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleView(part.id)}>
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </UserMainLayout>
  );
}
