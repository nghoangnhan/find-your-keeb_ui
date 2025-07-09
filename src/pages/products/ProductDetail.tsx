import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  Container,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  IconButton
} from '@mui/material';
import { ShoppingCart, ArrowBack, Close as CloseIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { apiService } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const BACKEND_URL = "http://localhost:8080";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await apiService.getProductById(parseInt(id));
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await addToCart({ productId: product.id, quantity });
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

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 0, m: 0, boxShadow: 3, borderRadius: 3 }}>
            <img
              src={product.imageUrl ? (product.imageUrl.startsWith('/product-images/') ? BACKEND_URL + product.imageUrl : product.imageUrl) : 'https://via.placeholder.com/600x400?text=Keyboard'}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                display: 'block',
                margin: 0,
                padding: 0,
                borderRadius: 'inherit',
              }}
              onClick={() => {
                setModalImage(product.imageUrl ? (product.imageUrl.startsWith('/product-images/') ? BACKEND_URL + product.imageUrl : product.imageUrl) : 'https://via.placeholder.com/600x400?text=Keyboard');
                setIsModalOpen(true);
              }}
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              label={product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              color={product.stockQuantity > 0 ? 'success' : 'error'}
              size="medium"
              sx={{ fontSize: '1rem', py: 1 }}
            />
          </Box>

          <Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
            {formatPrice(product.price)}
          </Typography>

          {/* Stock Status */}
          <Box sx={{ mb: 3 }}>
            {product.stockQuantity === 0 && (
              <Alert severity="error" sx={{ mt: 1 }}>
                This product is currently out of stock. Please check back later or contact us for availability updates.
              </Alert>
            )}
            {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Only {product.stockQuantity} left in stock! Order soon to avoid disappointment.
              </Alert>
            )}
          </Box>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Product Features */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label={product.brand} color="primary" />
              <Chip label={product.layout.replace('_', ' ')} variant="outlined" />
              <Chip label={product.switchType} variant="outlined" />
              {product.rgbSupport && <Chip label="RGB" color="secondary" />}
              {product.wirelessSupport && <Chip label="Wireless" color="secondary" />}
            </Box>
          </Box>

          {/* Specifications */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Switch Type
                </Typography>
                <Typography variant="body1">{product.switchType}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Keycap Material
                </Typography>
                <Typography variant="body1">{product.keycapMaterial}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Case Material
                </Typography>
                <Typography variant="body1">{product.caseMaterial}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Stock Quantity
                </Typography>
                <Typography variant="body1">{product.stockQuantity}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Add to Cart Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stockQuantity}
              >
                +
              </Button>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              sx={{ py: 1.5 }}
            >
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {product.stockQuantity === 0 && (
              <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                This product is currently out of stock
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
        <Box sx={{ position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              backgroundColor: 'rgba(255,255,255,0.7)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
              p: 1,
              width: 'auto',
              height: 'auto',
            }}
          >
            <CloseIcon sx={{ fontSize: '1.5rem', color: '#333' }} />
          </IconButton>
          <img
            src={typeof modalImage === 'string' ? modalImage : ''}
            alt="Product"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              display: 'block',
              maxWidth: '800px',
              maxHeight: '80vh',
            }}
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default ProductDetail; 