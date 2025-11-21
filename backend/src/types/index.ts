import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  brokerage: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  brokerage: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  propertyType: z.enum(["apartment", "villa", "penthouse", "studio", "plot"]),
  location: z.string().min(1, "Location is required"),
  city: z.enum(["Mumbai", "Delhi", "Bangalore"]),
  locality: z.string().min(1, "Locality is required"),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().positive("Price must be positive"),
  areaSqft: z.number().positive("Area must be positive"),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  furnishingStatus: z
    .enum(["unfurnished", "semi-furnished", "fully-furnished"])
    .optional(),
  floorNumber: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  ageYears: z.number().int().optional(),
  amenities: z.array(z.string()).optional(),
});

export const propertyAnalysisRequestSchema = z.object({
  location: z.string().min(1, "Location is required"),
  price: z.number().positive("Price must be positive"),
  areaSqft: z.number().positive("Area must be positive"),
  propertyType: z.enum(["apartment", "villa", "penthouse", "studio", "plot"]),
  furnishingStatus: z
    .enum(["unfurnished", "semi-furnished", "fully-furnished"])
    .optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  floorNumber: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  ageYears: z.number().int().optional(),
});

export const propertySearchSchema = z.object({
  city: z.enum(["Mumbai", "Delhi", "Bangalore"]).optional(),
  locality: z.string().optional(),
  propertyType: z
    .enum(["apartment", "villa", "penthouse", "studio", "plot"])
    .optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  furnishingStatus: z
    .enum(["unfurnished", "semi-furnished", "fully-furnished"])
    .optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const savedPropertySchema = z.object({
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type PropertyAnalysisRequest = z.infer<
  typeof propertyAnalysisRequestSchema
>;
export type PropertySearchParams = z.infer<typeof propertySearchSchema>;
export type SavedPropertyInput = z.infer<typeof savedPropertySchema>;

export interface Bindings {
  DB: D1Database;
  JWT_SECRET: string;
  GEMINI_API_KEY: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id: number;
      email: string;
      username: string;
      subscriptionTier: string;
    };
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PropertyAnalysisResult {
  analysisId: number;
  fairMarketValue: {
    min: number;
    max: number;
    confidence: number;
  };
  valuationStatus: "undervalued" | "fair" | "overvalued";
  priceAdvantagePercent: number;
  aiSummary: string;
  metrics: {
    rentalYieldPercent: number;
    projected5yGrowthPercent: number;
    livabilityScore: number;
    infrastructureScore: number;
    connectivityScore: number;
  };
  riskFactors: Array<{
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
  }>;
  growthFactors: Array<{
    type: string;
    description: string;
    impact: "low" | "medium" | "high";
  }>;
  marketContext: {
    microMarketAvgPrice: number;
    macroMarketAvgPrice: number;
  };
  analyzedAt: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
  subscriptionTier: string;
  iat: number;
  exp: number;
}
