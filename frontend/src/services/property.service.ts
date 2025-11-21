import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { authService } from './auth.service';

export interface Property {
  id: number;
  title: string;
  description?: string;
  propertyType: string;
  location: string;
  city: string;
  locality: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  pricePerSqft?: number;
  areaSqft: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  floorNumber?: number;
  totalFloors?: number;
  ageYears?: number;
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertySearchParams {
  city?: string;
  locality?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  page?: number;
  limit?: number;
}

export interface CreatePropertyData {
  title: string;
  description?: string;
  propertyType: 'apartment' | 'villa' | 'penthouse' | 'studio' | 'plot';
  location: string;
  city: 'Mumbai' | 'Delhi' | 'Bangalore';
  locality: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  areaSqft: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: 'unfurnished' | 'semi-furnished' | 'fully-furnished';
  floorNumber?: number;
  totalFloors?: number;
  ageYears?: number;
  amenities?: string[];
}

export interface SavedProperty {
  id: number;
  propertyId: number;
  notes?: string;
  tags?: string[];
  savedAt: string;
  property?: Property;
}

const getAuthHeaders = () => {
  const token = authService.getToken();
  if (!token) throw new Error('Not authenticated');
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const propertyService = {
  async searchProperties(params: PropertySearchParams = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.properties}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to search properties');
    }

    return result;
  },

  async getPropertyById(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.properties}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to get property');
    }

    return result;
  },

  async createProperty(data: CreatePropertyData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.properties}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to create property');
    }

    return result;
  },

  async updateProperty(id: number, data: Partial<CreatePropertyData>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.properties}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to update property');
    }

    return result;
  },

  async deleteProperty(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.properties}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to delete property');
    }

    return result;
  },

  async getSavedProperties(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.savedProperties}/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to get saved properties');
    }

    return result;
  },

  async saveProperty(propertyId: number, notes?: string, tags?: string[]): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.savedProperties}/${propertyId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes, tags }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to save property');
    }

    return result;
  },

  async removeSavedProperty(propertyId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.savedProperties}/${propertyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to remove saved property');
    }

    return result;
  },

  async analyzeProperty(data: CreatePropertyData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.analyzeProperty}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to analyze property');
    }

    return result;
  },

  async quickPriceEstimate(params: { city: string; locality: string; areaSqft: number; propertyType: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.quickEstimate}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to get price estimate');
    }

    return result;
  },
};

