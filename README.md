# Find Your Keeb - React Frontend

A modern React TypeScript frontend for the Find Your Keeb mechanical keyboard e-commerce application.

## Features

- 🛍️ **Product Catalog**: Browse and filter mechanical keyboards
- 🔍 **Advanced Filtering**: Filter by brand, layout, price, features (RGB, wireless)
- 🛒 **Shopping Cart**: Add, remove, and manage cart items
- 👤 **User Authentication**: Login and registration system
- 💳 **Checkout Process**: Complete order placement
- 📦 **Order History**: View past orders and their status
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Built with Material-UI components

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- The Spring Boot backend running on `http://localhost:8080`

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Route protection for authenticated users
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── CartContext.tsx # Shopping cart state management
├── pages/              # Page components
│   ├── Home.tsx        # Landing page with featured products
│   ├── Products.tsx    # Product catalog with filters
│   ├── ProductDetail.tsx # Individual product page
│   ├── Login.tsx       # User login
│   ├── Register.tsx    # User registration
│   ├── Cart.tsx        # Shopping cart
│   ├── Checkout.tsx    # Checkout process
│   └── Orders.tsx      # Order history
├── services/           # API services
│   └── api.ts          # Axios configuration and API calls
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types and interfaces
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## API Integration

The frontend communicates with the Spring Boot backend through the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/brands` - Get all brands
- `GET /api/products/layouts` - Get keyboard layouts

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{productId}` - Update cart item quantity
- `DELETE /api/cart/items/{productId}` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders/checkout` - Place order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID

## Environment Configuration

The application is configured to proxy API requests to `http://localhost:8080` (the Spring Boot backend). This is configured in the `package.json` file:

```json
{
  "proxy": "http://localhost:8080"
}
```

## Features in Detail

### Product Catalog
- Grid layout with product cards
- Product images, names, prices, and ratings
- Quick "Add to Cart" functionality
- Responsive design for all screen sizes

### Advanced Filtering
- Filter by brand (dropdown)
- Filter by keyboard layout (dropdown)
- Price range slider
- Feature checkboxes (RGB, wireless)
- Clear filters option

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Empty cart state
- Continue shopping option

### User Authentication
- Login form with validation
- Registration form with password confirmation
- JWT token management
- Protected routes
- Automatic logout on token expiration

### Checkout Process
- Shipping address input
- Payment method selection
- Order summary
- Form validation

### Order History
- List of all user orders
- Order status with color-coded chips
- Order details and totals
- Date formatting

## Styling and Theming

The application uses Material-UI with a custom theme that includes:
- Primary color: Blue (#1976d2)
- Secondary color: Pink (#dc004e)
- Custom button styling (no text transform, rounded corners)
- Custom card styling (rounded corners, subtle shadows)
- Responsive typography

## State Management

The application uses React Context API for state management:

### AuthContext
- User authentication state
- Login/logout functions
- Token management
- User information

### CartContext
- Shopping cart state
- Cart operations (add, remove, update)
- Cart item count
- Integration with authentication

## Error Handling

- API error handling with user-friendly messages
- Loading states for better UX
- Form validation
- Network error handling

## Performance Optimizations

- Lazy loading of components (can be implemented)
- Image optimization
- Efficient re-renders with React.memo
- Optimized bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

To build the application for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Find Your Keeb e-commerce application. 