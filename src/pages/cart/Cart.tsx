import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Container,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const BACKEND_URL = "http://localhost:8080";

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Check if any items are out of stock
  const hasOutOfStockItems = cart?.items?.some(item => item.product.stockQuantity === 0) || false;
  const hasOverstockedItems = cart?.items?.some(item => item.quantity > item.product.stockQuantity && item.product.stockQuantity > 0) || false;

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to add items to your cart
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Items ({cart.items.length})
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearCart}
                  size="small"
                >
                  Clear Cart
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  maxHeight: cart.items.length > 3 ? 320 : 'none',
                  overflowY: cart.items.length > 3 ? 'auto' : 'visible',
                  pr: 1,
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
              {cart.items.map((item) => (
                <Box key={item.id} sx={{ mb: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${item.product.id}`)}
                      >
                        <img
                          src={item.product.imageUrl ? (item.product.imageUrl.startsWith('/product-images/') ? BACKEND_URL + item.product.imageUrl : item.product.imageUrl) : 'https://via.placeholder.com/100x100?text=Keyboard'}
                          alt={item.product.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 8,
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ cursor: 'pointer', display: 'inline-block' }}
                        onClick={() => navigate(`/products/${item.product.id}`)}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.product.brand} • {item.product.layout.replace('_', ' ')}
                      </Typography>
                      {/* Show stock status */}
                      <Chip
                        label={item.product.stockQuantity > 0 ? `In Stock (${item.product.stockQuantity})` : 'Out of Stock'}
                        color={item.product.stockQuantity > 0 ? 'success' : 'error'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                      {/* Show warning if item quantity exceeds stock */}
                      {item.quantity > item.product.stockQuantity && item.product.stockQuantity > 0 && (
                        <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                          Only {item.product.stockQuantity} available
                        </Alert>
                      )}
                      {/* Show error if out of stock */}
                      {item.product.stockQuantity === 0 && (
                        <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                          This item is out of stock
                        </Alert>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="h6" color="primary">
                        {formatPrice(item.product.price)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Box>
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

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{formatPrice(cart.totalAmount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">Free</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(cart.totalAmount)}
                  </Typography>
                </Box>
              </Box>

              {/* Show stock warnings */}
              {hasOutOfStockItems && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Some items in your cart are out of stock. Please remove them before checkout.
                </Alert>
              )}
              {hasOverstockedItems && !hasOutOfStockItems && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Some items exceed available stock. Please adjust quantities before checkout.
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/checkout')}
                disabled={hasOutOfStockItems || hasOverstockedItems}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 