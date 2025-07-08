import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Container,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
} from '@mui/material';
import { ArrowBack, LocalShipping, Payment, LocationOn } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Use admin endpoint if user is admin, otherwise use regular endpoint
        const orderData = user?.role === 'ADMIN' 
          ? await apiService.getAdminOrderById(parseInt(id))
          : await apiService.getOrderById(parseInt(id));
        setOrder(orderData);
        setError(null);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user?.role]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.CONFIRMED:
        return 'info';
      case OrderStatus.SHIPPED:
        return 'primary';
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 0;
      case OrderStatus.CONFIRMED:
        return 1;
      case OrderStatus.SHIPPED:
        return 2;
      case OrderStatus.DELIVERED:
        return 3;
      case OrderStatus.CANCELLED:
        return -1;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/orders' : '/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/orders' : '/orders')}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1">
          Order #{order.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Order Status</Typography>
                <Chip
                  label={order.status.replace('_', ' ')}
                  color={getStatusColor(order.status) as any}
                  size="medium"
                />
              </Box>
              
              {order.status !== OrderStatus.CANCELLED && (
                <Stepper activeStep={getStatusStep(order.status)} sx={{ mt: 2 }}>
                  <Step>
                    <StepLabel>Order Placed</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Confirmed</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Shipped</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Delivered</StepLabel>
                  </Step>
                </Stepper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items ({(order.items || []).length})
              </Typography>
              <Box
                sx={{
                  maxHeight: 320,
                  overflowY: 'auto',
                  pr: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  background: 'rgba(30,30,30,0.7)',
                  mb: 2,
                  // Custom scrollbar for dark theme
                  '&::-webkit-scrollbar': {
                    width: 8,
                    background: '#181818',
                    borderRadius: 8,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#444',
                    borderRadius: 8,
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#666',
                  },
                  scrollbarColor: '#444 #181818',
                  scrollbarWidth: 'thin',
                }}
              >
                {(order.items || []).map((item) => (
                  <Paper key={item.id} sx={{ p: 2, mb: 2, boxShadow: 'none', background: 'transparent' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <Box sx={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 1, background: '#222' }}>
                          <img
                            src={item.product.imageUrl || 'https://via.placeholder.com/80x80?text=Keyboard'}
                            alt={item.product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.product.brand} • {item.product.layout.replace('_', ' ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h6" color="primary" align="right">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="right">
                          {formatPrice(item.unitPrice)} each
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{formatPrice(order.totalAmount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">Free</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Information */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Order Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order Date: {formatDate(order.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order Number: #{order.id}
                </Typography>
              </Box>

              {/* Shipping Information */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping fontSize="small" />
                  Shipping Address
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {order.shippingAddress}
                </Typography>
              </Box>

              {/* Billing Information */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  Billing Address
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {order.billingAddress}
                </Typography>
              </Box>

              {/* Payment Information */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Payment fontSize="small" />
                  Payment Method
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.paymentMethod.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail; 