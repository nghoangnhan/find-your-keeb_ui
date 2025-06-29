# Cart Pages

This folder contains all cart and checkout related pages for the Find Your Keeb e-commerce application.

## Components

### Cart
- **Purpose**: Shopping cart management page
- **Features**:
  - Cart items display
  - Quantity adjustment
  - Item removal
  - Stock status warnings
  - Cart total calculation
  - Proceed to checkout

### Checkout
- **Purpose**: Order checkout and payment page
- **Features**:
  - Order summary
  - Shipping address form
  - Billing address form
  - Payment method selection
  - Order confirmation
  - Form validation

## Routes

- `/cart` - Shopping cart
- `/checkout` - Checkout page

## Import Pattern

```typescript
import { Cart, Checkout } from './pages/cart';
``` 