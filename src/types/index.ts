export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  layout: KeyboardLayout;
  switchType: string;
  keycapMaterial: string;
  caseMaterial: string;
  rgbSupport: boolean;
  wirelessSupport: boolean;
  stockQuantity: number;
  imageUrl: string;
}

export enum KeyboardLayout {
  FULL_SIZE = 'FULL_SIZE',
  TKL = 'TKL',
  SEVENTY_FIVE_PERCENT = 'SEVENTY_FIVE_PERCENT',
  SIXTY_FIVE_PERCENT = 'SIXTY_FIVE_PERCENT',
  SIXTY_PERCENT = 'SIXTY_PERCENT',
  FORTY_PERCENT = 'FORTY_PERCENT',
  SPLIT = 'SPLIT',
  ORTHOLINEAR = 'ORTHOLINEAR',
  CUSTOM = 'CUSTOM'
}

export interface ProductFilterRequest {
  layout?: KeyboardLayout;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  switchType?: string;
  rgbSupport?: boolean;
  wirelessSupport?: boolean;
  page?: number;
  size?: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CheckoutRequest {
  items: CartItemRequest[];
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
} 