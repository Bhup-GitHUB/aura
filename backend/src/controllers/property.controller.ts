import { Context } from "hono";
import { PropertyService } from "../services/property.service";
import {
  Bindings,
  ApiResponse,
  PropertyInput,
  PropertySearchParams,
  SavedPropertyInput,
} from "../types";
import { createDb } from "../db";

export class PropertyController {
  static async createProperty(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const data = (await c.req.json()) as PropertyInput;
      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const property = await propertyService.createProperty(data);

      const response: ApiResponse = {
        success: true,
        message: "Property created successfully",
        data: property,
      };

      return c.json(response, 201);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PROPERTY_CREATE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create property",
        },
      };

      return c.json(response, 400);
    }
  }

  static async searchProperties(c: Context<{ Bindings: Bindings }>) {
    try {
      const params = c.req.query();
      const searchParams: PropertySearchParams = {
        city: params.city as any,
        locality: params.locality,
        propertyType: params.propertyType as any,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        minArea: params.minArea ? Number(params.minArea) : undefined,
        maxArea: params.maxArea ? Number(params.maxArea) : undefined,
        bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
        bathrooms: params.bathrooms ? Number(params.bathrooms) : undefined,
        furnishingStatus: params.furnishingStatus as any,
        page: params.page ? Number(params.page) : 1,
        limit: params.limit ? Number(params.limit) : 20,
      };

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const result = await propertyService.searchProperties(searchParams);

      const response: ApiResponse = {
        success: true,
        data: result,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PROPERTY_SEARCH_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to search properties",
        },
      };

      return c.json(response, 400);
    }
  }

  static async getPropertyById(c: Context<{ Bindings: Bindings }>) {
    try {
      const propertyId = Number(c.req.param("id"));

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const property = await propertyService.getPropertyById(propertyId);

      const response: ApiResponse = {
        success: true,
        data: property,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PROPERTY_NOT_FOUND",
          message:
            error instanceof Error ? error.message : "Property not found",
        },
      };

      return c.json(response, 404);
    }
  }

  static async updateProperty(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const propertyId = Number(c.req.param("id"));
      const data = (await c.req.json()) as Partial<PropertyInput>;

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const property = await propertyService.updateProperty(propertyId, data);

      const response: ApiResponse = {
        success: true,
        message: "Property updated successfully",
        data: property,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PROPERTY_UPDATE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update property",
        },
      };

      return c.json(response, 400);
    }
  }

  static async deleteProperty(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const propertyId = Number(c.req.param("id"));

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const result = await propertyService.deleteProperty(propertyId);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PROPERTY_DELETE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete property",
        },
      };

      return c.json(response, 400);
    }
  }

  static async getPropertyAnalysis(c: Context<{ Bindings: Bindings }>) {
    try {
      const propertyId = Number(c.req.param("id"));

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const analyses = await propertyService.getPropertyAnalysis(propertyId);

      const response: ApiResponse = {
        success: true,
        data: analyses,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "ANALYSIS_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get property analysis",
        },
      };

      return c.json(response, 400);
    }
  }

  static async getNearbyProperties(c: Context<{ Bindings: Bindings }>) {
    try {
      const propertyId = Number(c.req.param("id"));
      const radius = Number(c.req.query("radius")) || 2;

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const nearby = await propertyService.getNearbyProperties(
        propertyId,
        radius
      );

      const response: ApiResponse = {
        success: true,
        data: nearby,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "NEARBY_PROPERTIES_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get nearby properties",
        },
      };

      return c.json(response, 400);
    }
  }

  static async compareProperties(c: Context<{ Bindings: Bindings }>) {
    try {
      const { propertyIds } = (await c.req.json()) as { propertyIds: number[] };

      if (
        !propertyIds ||
        !Array.isArray(propertyIds) ||
        propertyIds.length === 0
      ) {
        throw new Error("Property IDs are required");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const comparison = await propertyService.compareProperties(propertyIds);

      const response: ApiResponse = {
        success: true,
        data: comparison,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "COMPARE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to compare properties",
        },
      };

      return c.json(response, 400);
    }
  }

  static async saveProperty(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const propertyId = Number(c.req.param("propertyId"));
      const data = (await c.req.json()) as SavedPropertyInput;

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const saved = await propertyService.saveProperty(
        userId,
        propertyId,
        data
      );

      const response: ApiResponse = {
        success: true,
        message: "Property saved successfully",
        data: saved,
      };

      return c.json(response, 201);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "SAVE_PROPERTY_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to save property",
        },
      };

      return c.json(response, 400);
    }
  }

  static async getSavedProperties(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const saved = await propertyService.getSavedProperties(userId);

      const response: ApiResponse = {
        success: true,
        data: saved,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "GET_SAVED_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get saved properties",
        },
      };

      return c.json(response, 400);
    }
  }

  static async removeSavedProperty(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const propertyId = Number(c.req.param("propertyId"));

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const result = await propertyService.removeSavedProperty(
        userId,
        propertyId
      );

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "REMOVE_SAVED_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to remove saved property",
        },
      };

      return c.json(response, 400);
    }
  }

  static async updateSavedProperty(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const propertyId = Number(c.req.param("propertyId"));
      const data = (await c.req.json()) as SavedPropertyInput;

      if (isNaN(propertyId)) {
        throw new Error("Invalid property ID");
      }

      const db = createDb(c.env.DB);
      const propertyService = new PropertyService(db);

      const result = await propertyService.updateSavedProperty(
        userId,
        propertyId,
        data
      );

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "UPDATE_SAVED_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to update saved property",
        },
      };

      return c.json(response, 400);
    }
  }
}
