import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product, KeyboardLayout } from '../../types';
import { apiService } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = "http://localhost:8080";
const MAX_IMAGE_SIZE_MB = 10;

const AdminProductForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [keyboardLayouts, setKeyboardLayouts] = useState<KeyboardLayout[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    layout: KeyboardLayout.FULL_SIZE,
    switchType: '',
    keycapMaterial: '',
    caseMaterial: '',
    rgbSupport: false,
    wirelessSupport: false,
    stockQuantity: '',
    imageUrl: '',
  });

  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchKeyboardLayouts();
  }, []);

  const fetchKeyboardLayouts = async () => {
    try {
      const layouts = await apiService.getKeyboardLayouts();
      setKeyboardLayouts(layouts);
    } catch (err) {
      console.error('Error fetching keyboard layouts:', err);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image size must be less than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${BACKEND_URL}/api/products/upload-image`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      const imagePath = await response.text();
      setFormData(prev => ({
        ...prev,
        imageUrl: imagePath
      }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.price || !formData.brand || !formData.stockQuantity) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      setError('Please enter a valid stock quantity');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      };

      await apiService.createProduct(productData);
      // Save image to public/product-images if uploaded
      if (uploadedImageFile && formData.imageUrl.startsWith('/product-images/')) {
        const ext = uploadedImageFile.name.split('.').pop();
        const filename = formData.imageUrl.replace('/product-images/', '');
        const destPath = `/product-images/${filename}`;
        // Save file using FileReader and download link (simulate save to public)
        const reader = new FileReader();
        reader.onload = function(e) {
          const a = document.createElement('a');
          a.href = e.target?.result as string;
          a.download = filename;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
        reader.readAsDataURL(uploadedImageFile);
      }
      setSuccess('Product created successfully');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setError('Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/products')}
          sx={{ mr: 2 }}
        >
          Back to Products
        </Button>
        <Typography variant="h4" component="h1">
          Add New Product
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand *"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description *"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity *"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              {/* Technical Specifications */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Technical Specifications
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Keyboard Layout *</InputLabel>
                  <Select
                    value={formData.layout}
                    onChange={(e) => handleInputChange('layout', e.target.value)}
                    label="Keyboard Layout *"
                    required
                  >
                    {keyboardLayouts.map((layout) => (
                      <MenuItem key={layout} value={layout}>
                        {layout.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Switch Type"
                  value={formData.switchType}
                  onChange={(e) => handleInputChange('switchType', e.target.value)}
                  placeholder="e.g., Cherry MX Blue, Gateron Red"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Keycap Material"
                  value={formData.keycapMaterial}
                  onChange={(e) => handleInputChange('keycapMaterial', e.target.value)}
                  placeholder="e.g., ABS, PBT"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Case Material"
                  value={formData.caseMaterial}
                  onChange={(e) => handleInputChange('caseMaterial', e.target.value)}
                  placeholder="e.g., Plastic, Aluminum"
                />
              </Grid>

              {/* Features */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rgbSupport}
                      onChange={(e) => handleInputChange('rgbSupport', e.target.checked)}
                    />
                  }
                  label="RGB Support"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.wirelessSupport}
                      onChange={(e) => handleInputChange('wirelessSupport', e.target.checked)}
                    />
                  }
                  label="Wireless Support"
                />
              </Grid>

              {/* Image URL */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Product Image
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              </Grid>

              {formData.imageUrl && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Image Preview:
                    </Typography>
                    <img
                      src={formData.imageUrl.startsWith('/product-images/') ? BACKEND_URL + formData.imageUrl : formData.imageUrl}
                      alt="Product preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Box>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    disabled={loading || !formData.imageUrl}
                    size="large"
                  >
                    {loading ? 'Creating...' : 'Create Product'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin/products')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminProductForm; 