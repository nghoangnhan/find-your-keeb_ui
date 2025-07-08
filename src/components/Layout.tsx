import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Logout,
  AccountCircle,
  AdminPanelSettings,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    // Navigate to profile page or show profile info
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <img
                src="/cat-typing.png"
                alt="Find Your Keeb Logo"
                style={{
                  height: '40px',
                  width: 'auto',
                  borderRadius: '8px',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'inherit',
                }}
              >
                Find Your Keeb
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user?.role !== 'ADMIN' && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/products"
                  sx={{ textTransform: 'none' }}
                >
                  Products
                </Button>
              )}

              {isAuthenticated ? (
                <>
                  {user?.role !== 'ADMIN' && (
                    <IconButton
                      color="inherit"
                      component={RouterLink}
                      to="/cart"
                      sx={{ position: 'relative' }}
                    >
                      <Badge badgeContent={cartItemCount} color="secondary">
                        <ShoppingCart />
                      </Badge>
                    </IconButton>
                  )}

                  {/* Only show Orders link if not admin */}
                  {user?.role !== 'ADMIN' && (
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/orders"
                      sx={{ textTransform: 'none' }}
                    >
                      Orders
                    </Button>
                  )}

                  {user?.role === 'ADMIN' && (
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/admin/dashboard"
                      startIcon={<AdminPanelSettings />}
                      sx={{ textTransform: 'none' }}
                    >
                      Admin
                    </Button>
                  )}

                  {/* User Profile Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: 'inherit',
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      Welcome, {user?.username}
                    </Typography>
                    
                    <IconButton
                      color="inherit"
                      onClick={handleMenuOpen}
                      sx={{ 
                        ml: 1,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          border: '1px solid rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Box>

                  {/* User Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                      }
                    }}
                  >
                    <MenuItem onClick={handleMenuClose} disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user?.username}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <Divider />
                    {user?.role === 'ADMIN' && (
                      <>
                        <MenuItem 
                          onClick={handleMenuClose}
                          component={RouterLink}
                          to="/admin/dashboard"
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AdminPanelSettings sx={{ fontSize: 20 }} />
                            <Typography variant="body2">Admin Dashboard</Typography>
                          </Box>
                        </MenuItem>
                        <Divider />
                      </>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Logout sx={{ fontSize: 20 }} />
                        <Typography variant="body2">Logout</Typography>
                      </Box>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    sx={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    component={RouterLink}
                    to="/register"
                    sx={{ textTransform: 'none' }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Find Your Keeb. Premium mechanical keyboards for enthusiasts.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 