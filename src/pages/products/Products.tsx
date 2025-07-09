import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ShoppingCart, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product, ProductFilterRequest, KeyboardLayout } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const BACKEND_URL = "http://localhost:8080";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [layouts, setLayouts] = useState<KeyboardLayout[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Active filters that are currently applied
  const [activeFilters, setActiveFilters] = useState<ProductFilterRequest>({
    page: 0,
    size: 12,
  });

  // Draft filters that user is setting up (not yet applied)
  const [draftFilters, setDraftFilters] = useState<ProductFilterRequest>({
    page: 0,
    size: 12,
  });

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching products with filters:', activeFilters);
        console.log('API base URL:', 'http://localhost:8080/api');
        
        const [productsResponse, brandsData, layoutsData] = await Promise.all([
          apiService.getProducts(activeFilters),
          apiService.getBrands(),
          apiService.getKeyboardLayouts(),
        ]);

        console.log('Products response:', productsResponse);
        console.log('Brands data:', brandsData);
        console.log('Layouts data:', layoutsData);

        setProducts(productsResponse.content || []);
        setTotalPages(productsResponse.totalPages || 0);
        setBrands(brandsData || []);
        setLayouts(layoutsData || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: err.config
        });
        setError(`Failed to load products: ${err.message}`);
        setProducts([]);
        setBrands([]);
        setLayouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeFilters]);

  // Handle draft filter changes (not applied yet)
  const handleDraftFilterChange = (key: keyof ProductFilterRequest, value: any) => {
    setDraftFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply all draft filters at once
  const applyFilters = () => {
    setActiveFilters({
      ...draftFilters,
      page: 0, // Reset to first page when applying new filters
    });
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setActiveFilters(prev => ({
      ...prev,
      page: page - 1,
    }));
  };

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

  const clearFilters = () => {
    const clearedFilters = {
      page: 0,
      size: 12,
    };
    setDraftFilters(clearedFilters);
    setActiveFilters(clearedFilters);
    setCurrentPage(1);
  };

  // Check if there are any active filters (excluding page and size)
  const hasActiveFilters = () => {
    const { page, size, ...filterFields } = activeFilters;
    return Object.values(filterFields).some(value => 
      value !== undefined && value !== null && value !== '' && value !== false
    );
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {isAdmin ? "Product Inventory Management" : "Mechanical Keyboards"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="h6">Filters</Typography>
              </Box>

              {/* Brand Filter */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={draftFilters.brand || ''}
                  label="Brand"
                  onChange={(e) => handleDraftFilterChange('brand', e.target.value || undefined)}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Layout Filter */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Layout</InputLabel>
                <Select
                  value={draftFilters.layout || ''}
                  label="Layout"
                  onChange={(e) => handleDraftFilterChange('layout', e.target.value || undefined)}
                >
                  <MenuItem value="">All Layouts</MenuItem>
                  {layouts.map((layout) => (
                    <MenuItem key={layout} value={layout}>
                      {layout.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price Range */}
              <Typography variant="subtitle2" gutterBottom>
                Price Range
              </Typography>
              <Box sx={{ px: 2, mb: 2 }}>
                <Slider
                  value={[draftFilters.minPrice || 0, draftFilters.maxPrice || 500]}
                  onChange={(_, newValue: number | number[]) => {
                    if (Array.isArray(newValue)) {
                      let [min, max] = newValue;
                      if (min > max) min = max;
                      handleDraftFilterChange('minPrice', min);
                      handleDraftFilterChange('maxPrice', max);
                    }
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500}
                  step={10}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="Min"
                    type="number"
                    value={draftFilters.minPrice || ''}
                    onChange={(e) => {
                      let min = Number(e.target.value) || 0;
                      let max = draftFilters.maxPrice || 500;
                      if (min > max) max = min;
                      handleDraftFilterChange('minPrice', min);
                      handleDraftFilterChange('maxPrice', max);
                    }}
                    sx={{ width: '50%' }}
                  />
                  <TextField
                    size="small"
                    label="Max"
                    type="number"
                    value={draftFilters.maxPrice || ''}
                    onChange={(e) => {
                      let max = Number(e.target.value) || 0;
                      let min = draftFilters.minPrice || 0;
                      if (max < min) min = max;
                      handleDraftFilterChange('maxPrice', max);
                      handleDraftFilterChange('minPrice', min);
                    }}
                    sx={{ width: '50%' }}
                  />
                </Box>
              </Box>

              {/* Features */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={draftFilters.rgbSupport || false}
                    onChange={(e) => handleDraftFilterChange('rgbSupport', e.target.checked || undefined)}
                  />
                }
                label="RGB Support"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={draftFilters.wirelessSupport || false}
                    onChange={(e) => handleDraftFilterChange('wirelessSupport', e.target.checked || undefined)}
                  />
                }
                label="Wireless"
                sx={{ mb: 2 }}
              />

              {/* Apply and Clear Buttons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{ flex: 1 }}
                >
                  Clear
                </Button>
              </Box>

              {/* Show active filters summary */}
              {hasActiveFilters() && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Active Filters:
                  </Typography>
                  {activeFilters.brand && (
                    <Chip label={`Brand: ${activeFilters.brand}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                  {activeFilters.layout && (
                    <Chip label={`Layout: ${activeFilters.layout.replace('_', ' ')}`} size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                  {(activeFilters.minPrice || activeFilters.maxPrice) && (
                    <Chip 
                      label={`Price: $${activeFilters.minPrice || 0} - $${activeFilters.maxPrice || 500}`} 
                      size="small" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  )}
                  {activeFilters.rgbSupport && (
                    <Chip label="RGB Support" size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                  {activeFilters.wirelessSupport && (
                    <Chip label="Wireless" size="small" sx={{ mr: 1, mb: 1 }} />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {(products || []).map((product) => (
              <Grid item xs={12} sm={6} lg={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl ? (product.imageUrl.startsWith('/product-images/') ? BACKEND_URL + product.imageUrl : product.imageUrl) : 'https://via.placeholder.com/300x200?text=Keyboard'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description.substring(0, 80)}...
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={product.brand}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip
                        label={product.layout.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      {product.rgbSupport && (
                        <Chip
                          label="RGB"
                          size="small"
                          color="secondary"
                          sx={{ mb: 1 }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                        color={product.stockQuantity > 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatPrice(product.price)}
                      </Typography>
                      {!isAdmin && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          disabled={product.stockQuantity === 0}
                        >
                          {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      )}
                      {isAdmin && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/products`);
                          }}
                        >
                          Manage
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products; 