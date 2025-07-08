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
  Button,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../../types';
import { apiService } from '../../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await apiService.getOrders();
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  // Sort orders by createdAt descending (latest first)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start shopping to see your orders here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {sortedOrders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Order #{order.id}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Chip
                        label={order.status.replace('_', ' ')}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Visibility />}
                        component={Link}
                        to={`/orders/${order.id}`}
                        sx={{ mt: 1 }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Placed on {formatDate(order.createdAt)}
                  </Typography>

                  <Box 
                    sx={{
                      mb: 2,
                      maxHeight: (order.items && order.items.length > 3) ? 180 : 'none',
                      overflowY: (order.items && order.items.length > 3) ? 'auto' : 'visible',
                      pr: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      background: 'rgba(30,30,30,0.7)',
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
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box
                          sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 1, background: '#222', mr: 1, cursor: 'pointer' }}
                          onClick={() => window.location.href = `/products/${item.product.id}`}
                        >
                          <img
                            src={item.product.imageUrl || 'https://via.placeholder.com/80x80?text=Keyboard'}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ flex: 1, minWidth: 0, mr: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                          onClick={() => window.location.href = `/products/${item.product.id}`}
                        >
                          {item.product.name} x {item.quantity}
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                      Total: {formatPrice(order.totalAmount)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders; 