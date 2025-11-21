import { Context } from "hono";
import { PropertyService } from "../services/property.service";
import { GeminiService } from "../services/gemini.service";
import {
  Bindings,
  ApiResponse,
  PropertyInput,
  PropertySearchParams,
  SavedPropertyInput,
} from "../types";
import { createDb } from "../db";
import { schema } from "../db";

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

  static async analyzePropertyWithAI(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const data = (await c.req.json()) as PropertyInput;

      // Validate required fields
      if (!data.city || !data.locality || !data.price || !data.areaSqft) {
        throw new Error(
          "Missing required fields: city, locality, price, areaSqft"
        );
      }

      // Check if GEMINI_API_KEY is available
      if (!c.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
      }

      const db = createDb(c.env.DB);
      const geminiService = new GeminiService(c.env.GEMINI_API_KEY);

      // Analyze with Gemini AI
      const analysis = await geminiService.analyzeProperty(data);

      // Calculate micro and macro market averages
      const pricePerSqft = data.price / data.areaSqft;
      const microMarketAvg = pricePerSqft;
      const macroMarketAvg = pricePerSqft * 0.95;

      // Store the analysis in database
      const analysisRecord = await db
        .insert(schema.propertyAnalyses)
        .values({
          // propertyId is omitted for on-demand analysis without property ID
          userId,
          fairMarketValueMin: analysis.fairMarketValueMin,
          fairMarketValueMax: analysis.fairMarketValueMax,
          confidenceScore: analysis.confidenceScore,
          valuationStatus: analysis.valuationStatus,
          priceAdvantagePercent: analysis.priceAdvantagePercent,
          aiSummary: analysis.summary,
          riskFactors: JSON.stringify(analysis.riskFactors),
          growthFactors: JSON.stringify(analysis.growthFactors),
          rentalYieldPercent: analysis.rentalYieldPercent,
          projected5yGrowthPercent: analysis.projected5yGrowthPercent,
          livabilityScore: analysis.livabilityScore,
          infrastructureScore: analysis.infrastructureScore,
          connectivityScore: analysis.connectivityScore,
          microMarketAvgPrice: microMarketAvg,
          macroMarketAvgPrice: macroMarketAvg,
          analyzedAt: new Date().toISOString(),
        })
        .returning();

      const response: ApiResponse = {
        success: true,
        message: "Property analyzed successfully",
        data: {
          analysisId: analysisRecord[0].id,
          propertyInput: data,
          analysis: {
            fairMarketValue: {
              min: analysis.fairMarketValueMin,
              max: analysis.fairMarketValueMax,
            },
            valuationStatus: analysis.valuationStatus,
            priceAdvantagePercent: analysis.priceAdvantagePercent,
            confidenceScore: analysis.confidenceScore,
            summary: analysis.summary,
            metrics: {
              rentalYieldPercent: analysis.rentalYieldPercent,
              projected5yGrowthPercent: analysis.projected5yGrowthPercent,
              livabilityScore: analysis.livabilityScore,
              infrastructureScore: analysis.infrastructureScore,
              connectivityScore: analysis.connectivityScore,
            },
            riskFactors: analysis.riskFactors,
            growthFactors: analysis.growthFactors,
            marketContext: {
              microMarketAvgPrice: microMarketAvg,
              macroMarketAvgPrice: macroMarketAvg,
            },
            analyzedAt: analysisRecord[0].analyzedAt,
          },
        },
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "AI_ANALYSIS_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to analyze property with AI",
        },
      };

      return c.json(response, 400);
    }
  }

  static async quickPriceEstimate(c: Context<{ Bindings: Bindings }>) {
    try {
      const { city, locality, areaSqft, propertyType } = c.req.query();

      if (!city || !locality || !areaSqft || !propertyType) {
        throw new Error(
          "Missing required parameters: city, locality, areaSqft, propertyType"
        );
      }

      if (!c.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
      }

      const geminiService = new GeminiService(c.env.GEMINI_API_KEY);

      const estimate = await geminiService.getQuickPriceEstimate(
        city,
        locality,
        Number(areaSqft),
        propertyType
      );

      const response: ApiResponse = {
        success: true,
        data: {
          city,
          locality,
          areaSqft: Number(areaSqft),
          propertyType,
          estimate: {
            minPrice: estimate.minPrice,
            maxPrice: estimate.maxPrice,
            avgPrice: (estimate.minPrice + estimate.maxPrice) / 2,
            pricePerSqft: {
              min: Math.round(estimate.minPrice / Number(areaSqft)),
              max: Math.round(estimate.maxPrice / Number(areaSqft)),
            },
            confidence: estimate.confidence,
          },
        },
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PRICE_ESTIMATE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get price estimate",
        },
      };

      return c.json(response, 400);
    }
  }
}
