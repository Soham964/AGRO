const API_BASE_URL = 'http://localhost:8000/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'buyer' | 'seller' | 'admin';
  phone: string;
  location: string;
  is_verified: boolean;
  date_joined: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: 'spices' | 'oils' | 'flours' | 'vegetables' | 'grains';
  price: number;
  unit: string;
  available_quantity: number;
  in_stock: boolean;
  freshness: 'Very Fresh' | 'Fresh' | 'Good';
  image: string;
  rating: number;
  total_ratings: number;
  supplier: number;
  supplier_name: string;
  supplier_business: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  product: Product;
  product_id: number;
  quantity: number;
  total: number;
  added_at: string;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  buyer: number;
  buyer_name: string;
  seller: number;
  seller_name: string;
  total_amount: number;
  status: 'pending' | 'accepted' | 'delivered' | 'cancelled';
  order_date: string;
  delivery_eta: string | null;
  delivery_address: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price_at_order_time: number;
  total: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  role: 'buyer' | 'seller';
  phone: string;
  location: string;
  address?: string;
  aadhar_number?: string;
  aadhar_card_image?: File;
  trade_license_number?: string;
}

// API Service Class
class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    // Don't set Content-Type for FormData, let the browser set it with boundary
    const isFormData = options.body instanceof FormData;
    
    const config: RequestInit = {
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Token ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Authentication required');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    // Handle file upload using FormData
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      const value = data[key as keyof RegisterData];
      if (value !== undefined && value !== null) {
        if (key === 'aadhar_card_image' && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
      }
    });

    return this.request<{ token: string; user: User }>('/users/register/', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
    });
  }

  // Products
  async getProducts(params?: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
  }): Promise<{ results: Product[]; count: number; next: string | null; previous: string | null }> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('ordering', params.sort);
    if (params?.page) searchParams.append('page', params.page.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products/?${queryString}` : '/products/';
    
    return this.request(endpoint);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}/`);
  }

  async getProductCategories(): Promise<{ value: string; label: string }[]> {
    return this.request<{ value: string; label: string }[]>('/products/categories/');
  }

  async searchProducts(params: {
    q?: string;
    category?: string;
    sort?: string;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products/search/?${queryString}` : '/products/search/';
    
    return this.request<Product[]>(endpoint);
  }

  // Cart
  async getCart(): Promise<Cart> {
    return this.request<Cart>('/carts/my_cart/');
  }

  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    return this.request<Cart>('/carts/add_item/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    return this.request<Cart>('/carts/update_item/', {
      method: 'PUT',
      body: JSON.stringify({ item_id: itemId, quantity }),
    });
  }

  async removeFromCart(itemId: number): Promise<Cart> {
    return this.request<Cart>(`/carts/remove_item/?item_id=${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<Cart> {
    return this.request<Cart>('/carts/clear_cart/', {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders/');
  }

  async createOrderFromCart(deliveryAddress: string): Promise<Order[]> {
    return this.request<Order[]>('/orders/create_from_cart/', {
      method: 'POST',
      body: JSON.stringify({ delivery_address: deliveryAddress }),
    });
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}/`);
  }

  // User Profile
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me/');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>('/users/me/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService(); 