import { eq, and, gte, lte, like, sql } from "drizzle-orm";
import { Database, schema } from "../db";
import {
  PropertyInput,
  PropertySearchParams,
  PropertyAnalysisRequest,
  SavedPropertyInput,
} from "../types";

export class PropertyService {
  constructor(private db: Database) {}

  async createProperty(data: PropertyInput) {
    const pricePerSqft = data.price / data.areaSqft;

    const result = await this.db
      .insert(schema.properties)
      .values({
        title: data.title,
        description: data.description,
        propertyType: data.propertyType,
        location: data.location,
        city: data.city,
        locality: data.locality,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        price: data.price,
        pricePerSqft,
        areaSqft: data.areaSqft,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        furnishingStatus: data.furnishingStatus,
        floorNumber: data.floorNumber,
        totalFloors: data.totalFloors,
        ageYears: data.ageYears,
        amenities: data.amenities ? JSON.stringify(data.amenities) : null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return result[0];
  }

  async searchProperties(params: PropertySearchParams) {
    const { page = 1, limit = 20, ...filters } = params;
    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (filters.city) {
      whereConditions.push(eq(schema.properties.city, filters.city));
    }

    if (filters.locality) {
      whereConditions.push(
        like(schema.properties.locality, `%${filters.locality}%`)
      );
    }

    if (filters.propertyType) {
      whereConditions.push(
        eq(schema.properties.propertyType, filters.propertyType)
      );
    }

    if (filters.minPrice) {
      whereConditions.push(gte(schema.properties.price, filters.minPrice));
    }

    if (filters.maxPrice) {
      whereConditions.push(lte(schema.properties.price, filters.maxPrice));
    }

    if (filters.minArea) {
      whereConditions.push(gte(schema.properties.areaSqft, filters.minArea));
    }

    if (filters.maxArea) {
      whereConditions.push(lte(schema.properties.areaSqft, filters.maxArea));
    }

    if (filters.bedrooms) {
      whereConditions.push(eq(schema.properties.bedrooms, filters.bedrooms));
    }

    if (filters.bathrooms) {
      whereConditions.push(eq(schema.properties.bathrooms, filters.bathrooms));
    }

    if (filters.furnishingStatus) {
      whereConditions.push(
        eq(schema.properties.furnishingStatus, filters.furnishingStatus)
      );
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const properties = await this.db
      .select()
      .from(schema.properties)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.properties)
      .where(whereClause);

    const total = totalResult[0]?.count || 0;

    return {
      properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPropertyById(propertyId: number) {
    const property = await this.db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.id, propertyId))
      .limit(1)
      .then((props) => props[0]);

    if (!property) {
      throw new Error("Property not found");
    }

    const latestAnalysis = await this.db
      .select()
      .from(schema.propertyAnalyses)
      .where(eq(schema.propertyAnalyses.propertyId, propertyId))
      .orderBy(sql`${schema.propertyAnalyses.analyzedAt} DESC`)
      .limit(1)
      .then((analyses) => analyses[0]);

    return { ...property, latestAnalysis };
  }

  async updateProperty(propertyId: number, data: Partial<PropertyInput>) {
    const updates: any = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.price && data.areaSqft) {
      updates.pricePerSqft = data.price / data.areaSqft;
    }

    if (data.amenities) {
      updates.amenities = JSON.stringify(data.amenities);
    }

    await this.db
      .update(schema.properties)
      .set(updates)
      .where(eq(schema.properties.id, propertyId));

    return this.getPropertyById(propertyId);
  }

  async deleteProperty(propertyId: number) {
    await this.db
      .delete(schema.properties)
      .where(eq(schema.properties.id, propertyId));
    return { message: "Property deleted successfully" };
  }

  async getPropertyAnalysis(propertyId: number) {
    const analyses = await this.db
      .select()
      .from(schema.propertyAnalyses)
      .where(eq(schema.propertyAnalyses.propertyId, propertyId))
      .orderBy(sql`${schema.propertyAnalyses.analyzedAt} DESC`);

    return analyses;
  }

  async getNearbyProperties(propertyId: number, radius: number = 2) {
    const property = await this.getPropertyById(propertyId);

    if (!property.latitude || !property.longitude) {
      throw new Error("Property location coordinates not available");
    }

    const nearby = await this.db
      .select()
      .from(schema.properties)
      .where(
        and(
          eq(schema.properties.city, property.city),
          sql`${schema.properties.id} != ${propertyId}`
        )
      )
      .limit(10);

    return nearby;
  }

  async compareProperties(propertyIds: number[]) {
    const properties = await this.db
      .select()
      .from(schema.properties)
      .where(sql`${schema.properties.id} IN ${propertyIds}`);

    const analyses = await this.db
      .select()
      .from(schema.propertyAnalyses)
      .where(sql`${schema.propertyAnalyses.propertyId} IN ${propertyIds}`)
      .orderBy(sql`${schema.propertyAnalyses.analyzedAt} DESC`);

    const comparison = properties.map((property) => {
      const latestAnalysis = analyses.find((a) => a.propertyId === property.id);
      return { ...property, analysis: latestAnalysis };
    });

    return comparison;
  }

  async saveProperty(
    userId: number,
    propertyId: number,
    data: SavedPropertyInput
  ) {
    const existing = await this.db
      .select()
      .from(schema.savedProperties)
      .where(
        and(
          eq(schema.savedProperties.userId, userId),
          eq(schema.savedProperties.propertyId, propertyId)
        )
      )
      .limit(1)
      .then((saved) => saved[0]);

    if (existing) {
      throw new Error("Property already saved");
    }

    const result = await this.db
      .insert(schema.savedProperties)
      .values({
        userId,
        propertyId,
        notes: data.notes,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        savedAt: new Date().toISOString(),
      })
      .returning();

    return result[0];
  }

  async getSavedProperties(userId: number) {
    const saved = await this.db
      .select({
        id: schema.savedProperties.id,
        notes: schema.savedProperties.notes,
        tags: schema.savedProperties.tags,
        savedAt: schema.savedProperties.savedAt,
        property: schema.properties,
      })
      .from(schema.savedProperties)
      .innerJoin(
        schema.properties,
        eq(schema.savedProperties.propertyId, schema.properties.id)
      )
      .where(eq(schema.savedProperties.userId, userId));

    return saved;
  }

  async removeSavedProperty(userId: number, propertyId: number) {
    await this.db
      .delete(schema.savedProperties)
      .where(
        and(
          eq(schema.savedProperties.userId, userId),
          eq(schema.savedProperties.propertyId, propertyId)
        )
      );

    return { message: "Property removed from saved list" };
  }

  async updateSavedProperty(
    userId: number,
    propertyId: number,
    data: SavedPropertyInput
  ) {
    await this.db
      .update(schema.savedProperties)
      .set({
        notes: data.notes,
        tags: data.tags ? JSON.stringify(data.tags) : null,
      })
      .where(
        and(
          eq(schema.savedProperties.userId, userId),
          eq(schema.savedProperties.propertyId, propertyId)
        )
      );

    return { message: "Saved property updated successfully" };
  }
}
