import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  Dashboard,
  Add,
  Visibility,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your store's products and orders
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Products Management */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', backgroundColor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Inventory sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="h2">
                    Products
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your product catalog
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                Add, edit, and manage your mechanical keyboard products. Update inventory, 
                prices, and product details.
              </Typography>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                component={Link}
                to="/admin/products"
                fullWidth
                sx={{ mb: 1 }}
              >
                Manage Products
              </Button>
              <Button
                variant="outlined"
                startIcon={<Add />}
                component={Link}
                to="/admin/products/new"
                fullWidth
              >
                Add New Product
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Orders Management */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', backgroundColor: 'background.paper', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" component="h2">
                    Orders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage customer orders
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                View and manage customer orders. Update order status, track shipments, 
                and handle customer inquiries.
              </Typography>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Visibility />}
                component={Link}
                to="/admin/orders"
                fullWidth
              >
                View All Orders
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  component={Link}
                  to="/admin/products/new"
                  fullWidth
                >
                  Add Product
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Inventory />}
                  component={Link}
                  to="/admin/products"
                  fullWidth
                >
                  View Products
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCart />}
                  component={Link}
                  to="/admin/orders"
                  fullWidth
                >
                  View Orders
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<Dashboard />}
                  component={Link}
                  to="/"
                  fullWidth
                >
                  View Store
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 