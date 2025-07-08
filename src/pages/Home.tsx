import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Chip,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Keyboard, ShoppingCart, Star, AdminPanelSettings, ShoppingCart as OrdersIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProducts({ size: 6 });
        setFeaturedProducts(response.content || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load featured products');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #181818 0%, #232323 70%, #ffd700 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                {isAdmin ? (
                  <>
                    Welcome to
                    <br />
                    <Typography
                      variant="h2"
                      component="span"
                      sx={{ fontWeight: 700, color: '#ffd700' }}
                    >
                      Admin Dashboard
                    </Typography>
                  </>
                ) : (
                  <>
                    Find Your Perfect<br />
                    <Typography
                      variant="h2"
                      component="span"
                      sx={{ fontWeight: 300, color: '#ffd700' }}
                    >
                      Mechanical Keyboard
                    </Typography>
                  </>
                )}
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                {isAdmin 
                  ? "Manage your store's products and orders. Monitor inventory, update order statuses, and keep your business running smoothly."
                  : "Discover premium mechanical keyboards for gaming, typing, and everything in between. From clicky switches to silent operation, find the perfect keeb for your style."
                }
              </Typography>
              {isAdmin ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/admin/dashboard')}
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      backgroundColor: '#ffd700',
                      color: '#333',
                      '&:hover': {
                        backgroundColor: '#ffed4e',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Admin Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/admin/orders')}
                    startIcon={<OrdersIcon />}
                    sx={{
                      borderColor: '#ffd700',
                      color: '#ffd700',
                      '&:hover': {
                        borderColor: '#ffed4e',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Manage Orders
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    backgroundColor: '#ffd700',
                    color: '#333',
                    '&:hover': {
                      backgroundColor: '#ffed4e',
                    },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Explore Products
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                {isAdmin ? (
                  <AdminPanelSettings sx={{ fontSize: 200, opacity: 0.3 }} />
                ) : (
                  <img
                    src="/cat-typing.png"
                    alt="Find Your Keeb Logo"
                    style={{
                      height: 400,
                      width: 'auto',
                      borderRadius: '16px',
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          {isAdmin ? "Store Inventory Overview" : "Featured Keyboards"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {(featuredProducts || []).map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    src={product.imageUrl}
                    alt={product.name}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {formatPrice(product.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Home;