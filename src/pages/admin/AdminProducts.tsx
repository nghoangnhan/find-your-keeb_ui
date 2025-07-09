import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Product, KeyboardLayout } from '../../types';
import { apiService } from '../../services/api';

const BACKEND_URL = "http://localhost:8080";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      brand: product.brand,
      layout: product.layout,
      switchType: product.switchType,
      keycapMaterial: product.keycapMaterial,
      caseMaterial: product.caseMaterial,
      rgbSupport: product.rgbSupport,
      wirelessSupport: product.wirelessSupport,
      stockQuantity: product.stockQuantity.toString(),
      imageUrl: product.imageUrl,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = {
        ...editForm,
        price: parseFloat(editForm.price),
        stockQuantity: parseInt(editForm.stockQuantity),
      };

      await apiService.updateProduct(selectedProduct.id, updatedProduct);
      await fetchProducts();
      setEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await apiService.deleteProduct(selectedProduct.id);
      await fetchProducts();
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/admin/products/new"
        >
          Add New Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Layout</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Features</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.imageUrl ? (product.imageUrl.startsWith('/product-images/') ? BACKEND_URL + product.imageUrl : product.imageUrl) : 'https://via.placeholder.com/50x50?text=KB'}
                    alt={product.name}
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{product.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.switchType}
                  </Typography>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <Chip
                    label={product.layout.replace('_', ' ')}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <Chip
                    label={product.stockQuantity}
                    color={product.stockQuantity > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {product.rgbSupport && (
                      <Chip label="RGB" size="small" color="primary" />
                    )}
                    {product.wirelessSupport && (
                      <Chip label="Wireless" size="small" color="secondary" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/products/${product.id}`}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(product)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Brand"
              value={editForm.brand}
              onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              fullWidth
            />
            <TextField
              label="Stock Quantity"
              type="number"
              value={editForm.stockQuantity}
              onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Layout</InputLabel>
              <Select
                value={editForm.layout}
                onChange={(e) => setEditForm({ ...editForm, layout: e.target.value as KeyboardLayout })}
                label="Layout"
              >
                {Object.values(KeyboardLayout).map((layout) => (
                  <MenuItem key={layout} value={layout}>
                    {(layout as string).replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Switch Type"
              value={editForm.switchType}
              onChange={(e) => setEditForm({ ...editForm, switchType: e.target.value })}
              fullWidth
            />
            <TextField
              label="Keycap Material"
              value={editForm.keycapMaterial}
              onChange={(e) => setEditForm({ ...editForm, keycapMaterial: e.target.value })}
              fullWidth
            />
            <TextField
              label="Case Material"
              value={editForm.caseMaterial}
              onChange={(e) => setEditForm({ ...editForm, caseMaterial: e.target.value })}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={editForm.imageUrl}
              onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              sx={{ gridColumn: '1 / -1' }}
            />
            <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.rgbSupport}
                    onChange={(e) => setEditForm({ ...editForm, rgbSupport: e.target.checked })}
                  />
                }
                label="RGB Support"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.wirelessSupport}
                    onChange={(e) => setEditForm({ ...editForm, wirelessSupport: e.target.checked })}
                  />
                }
                label="Wireless Support"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProducts; 