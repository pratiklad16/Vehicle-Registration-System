import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import UserMainLayout from "../../components/UserMainLayout";
import axios from "axios";

export default function UserViewSparePartDetail() {
  const { partId } = useParams();
  const [sparePart, setSparePart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSparePartDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/spare-parts/${partId}`
        );
        setSparePart(response.data);
      } catch (err) {
        console.error("Failed to fetch spare part details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSparePartDetails();
  }, [partId]);

  const handleEdit = () => {
    navigate(`/user/EditUserSparePart/${partId}`);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/user/deleteSparePart/${partId}`
      );
      alert(response.data.message || "Spare part deleted successfully!");
      navigate("/user/MySpareParts");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete spare part. Please try again.");
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!sparePart) {
    return (
      <UserMainLayout>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
          Spare part not found.
        </Typography>
      </UserMainLayout>
    );
  }

  return (
    <UserMainLayout>
      <Typography variant="h4" gutterBottom textAlign="center" mt={3}>
        Spare Part Details
      </Typography>

      <Card
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mt: 4,
          boxShadow: 4,
          borderRadius: 3,
          p: 3,
        }}
      >
        <SectionTitle title="Basic Information" />
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Part ID" value={sparePart.id} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Part Name" value={sparePart.partName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Part Number" value={sparePart.partNumber} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Vehicle Type" value={sparePart.vehicleType} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Compatible Models" value={sparePart.compatibleModels} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Quantity In Stock" value={sparePart.quantityInStock} />
          </Grid>
        </Grid>

        <SectionTitle title="Vendor & Pricing Info" mt={5} />
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Vendor Name" value={sparePart.vendorName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox label="Price" value={`₹${sparePart.price}`} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox
              label="Added On"
              value={new Date(sparePart.addedOn).toLocaleDateString()}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <CardActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleEdit} size="large">
            Edit Spare Part
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete} size="large">
            Delete Spare Part
          </Button>
        </CardActions>
      </Card>
    </UserMainLayout>
  );
}

// Section Title component for consistent section headers
const SectionTitle = ({ title, mt = 3 }) => (
  <Typography
    variant="h6"
    gutterBottom
    sx={{
      fontWeight: "600",
      mt,
      borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
      pb: 1,
    }}
  >
    {title}
  </Typography>
);

// Reusable InfoBox Component with slight elevation and padding
const InfoBox = ({ label, value }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      backgroundColor: "#fafafa",
      borderRadius: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600}>
      {value || "N/A"}
    </Typography>
  </Paper>
);
