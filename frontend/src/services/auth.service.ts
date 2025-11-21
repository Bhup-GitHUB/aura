import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface SignupData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id: number;
      username: string;
    };
  };
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.signup}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }

    return result;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // Store token in localStorage
    if (result.data?.token) {
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser(): { id: number; username: string } | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

