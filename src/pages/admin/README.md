# Admin Pages

This folder contains all admin-related pages for the Find Your Keeb e-commerce application.

## Components

### AdminDashboard
- **Purpose**: Main admin dashboard showing overview statistics and quick access to admin functions
- **Features**: 
  - Store statistics overview
  - Quick navigation to product and order management
  - Admin-specific welcome message

### AdminProducts
- **Purpose**: Product management interface for admins
- **Features**:
  - View all products in a table format
  - Edit existing products
  - Delete products
  - Add new products (redirects to AdminProductForm)
  - Stock quantity management

### AdminProductForm
- **Purpose**: Form for creating new products
- **Features**:
  - Comprehensive product creation form
  - Form validation
  - Image preview
  - Keyboard layout selection
  - Feature toggles (RGB, Wireless)

### AdminOrders
- **Purpose**: Order management interface for admins
- **Features**:
  - View all customer orders
  - Update order status
  - Order details navigation
  - Order filtering and management

## Usage

All admin pages are protected by role-based authentication and require the `ADMIN` role to access.

## Routes

- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Create new product
- `/admin/orders` - Order management

## Import Pattern

```typescript
import { AdminDashboard, AdminProducts, AdminProductForm, AdminOrders } from './pages/admin';
``` 