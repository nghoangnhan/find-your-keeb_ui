import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  Product,
  ProductFilterRequest,
  Cart,
  CartItemRequest,
  AuthRequest,
  RegisterRequest,
  User,
  Order,
  CheckoutRequest,
  KeyboardLayout
} from '../types';

// Backend AuthResponse structure
interface BackendAuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: AuthRequest): Promise<BackendAuthResponse> {
    const response = await this.api.post<BackendAuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<BackendAuthResponse> {
    const response = await this.api.post<BackendAuthResponse>('/auth/register', userData);
    return response.data;
  }

  // Product endpoints
  async getProducts(filters?: ProductFilterRequest): Promise<{ content: Product[]; totalElements: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `/products?${params.toString()}`;
    console.log('Making API request to:', url);
    
    try {
      const response = await this.api.get(url);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const response = await this.getProducts();
    return response.content;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.api.get<Product>(`/products/${id}`);
    return response.data;
  }

  async getBrands(): Promise<string[]> {
    const response = await this.api.get<string[]>('/products/brands');
    return response.data;
  }

  async getKeyboardLayouts(): Promise<KeyboardLayout[]> {
    const response = await this.api.get<KeyboardLayout[]>('/products/layouts');
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response = await this.api.get<Cart>('/cart');
    return response.data;
  }

  async addToCart(item: CartItemRequest): Promise<Cart> {
    const response = await this.api.post<Cart>('/cart/items', item);
    return response.data;
  }

  async updateCartItemQuantity(productId: number, quantity: number): Promise<Cart> {
    const response = await this.api.put<Cart>(`/cart/items/${productId}?quantity=${quantity}`);
    return response.data;
  }

  async removeFromCart(productId: number): Promise<Cart> {
    const response = await this.api.delete<Cart>(`/cart/items/${productId}`);
    return response.data;
  }

  async clearCart(): Promise<Cart> {
    const response = await this.api.delete<Cart>('/cart');
    return response.data;
  }

  // Order endpoints
  async checkout(checkoutData: CheckoutRequest): Promise<Order> {
    const response = await this.api.post<Order>('/orders/checkout', checkoutData);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.api.get('/orders');
    return response.data.content;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async getAllOrders(): Promise<any[]> {
    const response = await this.api.get('/admin/orders');
    return response.data;
  }

  async getAdminOrderById(id: number): Promise<Order> {
    const response = await this.api.get(`/admin/orders/${id}`);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await this.api.put(`/admin/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/admin/products/${id}`);
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const response = await this.api.post('/admin/products', product);
    return response.data;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await this.api.put(`/admin/orders/${id}/status?status=${status}`);
    return response.data;
  }
}

export const apiService = new ApiService(); 