# Order Pages

This folder contains all order-related pages for the Find Your Keeb e-commerce application.

## Components

### Orders
- **Purpose**: User's order history page
- **Features**:
  - List of user's orders
  - Order status display
  - Order summary information
  - Navigation to order details
  - Empty state handling

### OrderDetail
- **Purpose**: Detailed view of a specific order
- **Features**:
  - Complete order information
  - Order status tracking
  - Item details and pricing
  - Shipping and billing information
  - Order timeline/stepper

## Routes

- `/orders` - User's order history
- `/orders/:id` - Order detail page

## Import Pattern

```typescript
import { Orders, OrderDetail } from './pages/orders';
``` 