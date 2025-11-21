import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  brokerage: text("brokerage"),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
  lastLogin: text("last_login"),
});

export const userProfiles = sqliteTable("user_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  preferences: text("preferences"),
});

export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  externalId: text("external_id").unique(),
  title: text("title").notNull(),
  description: text("description"),
  propertyType: text("property_type").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  locality: text("locality").notNull(),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  price: real("price").notNull(),
  pricePerSqft: real("price_per_sqft"),
  areaSqft: real("area_sqft").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  furnishingStatus: text("furnishing_status"),
  floorNumber: integer("floor_number"),
  totalFloors: integer("total_floors"),
  ageYears: integer("age_years"),
  amenities: text("amenities"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const propertyAnalyses = sqliteTable("property_analyses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fairMarketValueMin: real("fair_market_value_min").notNull(),
  fairMarketValueMax: real("fair_market_value_max").notNull(),
  confidenceScore: real("confidence_score").notNull(),
  valuationStatus: text("valuation_status").notNull(),
  priceAdvantagePercent: real("price_advantage_percent"),
  aiSummary: text("ai_summary"),
  riskFactors: text("risk_factors"),
  growthFactors: text("growth_factors"),
  rentalYieldPercent: real("rental_yield_percent"),
  projected5yGrowthPercent: real("projected_5y_growth_percent"),
  livabilityScore: real("livability_score"),
  infrastructureScore: real("infrastructure_score"),
  connectivityScore: real("connectivity_score"),
  microMarketAvgPrice: real("micro_market_avg_price"),
  macroMarketAvgPrice: real("macro_market_avg_price"),
  analyzedAt: text("analyzed_at").notNull(),
});

export const savedProperties = sqliteTable("saved_properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  propertyId: integer("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  notes: text("notes"),
  tags: text("tags"),
  savedAt: text("saved_at").notNull(),
});

export const marketTrends = sqliteTable("market_trends", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  city: text("city").notNull(),
  locality: text("locality"),
  year: integer("year").notNull(),
  quarter: integer("quarter"),
  avgPricePerSqft: real("avg_price_per_sqft").notNull(),
  transactionVolume: integer("transaction_volume"),
  supplyMonths: real("supply_months"),
  demandIndex: real("demand_index"),
  growthYoyPercent: real("growth_yoy_percent"),
  dataSource: text("data_source"),
  createdAt: text("created_at").notNull(),
});

export const investmentPicks = sqliteTable("investment_picks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locality: text("locality").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  currentPricePerSqft: real("current_price_per_sqft").notNull(),
  projectedRoiPercent: real("projected_roi_percent").notNull(),
  tags: text("tags"),
  reasoning: text("reasoning"),
  confidenceScore: real("confidence_score"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
});

export const searchHistory = sqliteTable("search_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  searchQuery: text("search_query").notNull(),
  filters: text("filters"),
  resultsCount: integer("results_count"),
  searchedAt: text("searched_at").notNull(),
});

export const apiUsage = sqliteTable("api_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  requestCount: integer("request_count").notNull().default(1),
  geminiTokensUsed: integer("gemini_tokens_used").notNull().default(0),
  date: text("date").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyAnalysis = typeof propertyAnalyses.$inferSelect;
export type NewPropertyAnalysis = typeof propertyAnalyses.$inferInsert;
export type SavedProperty = typeof savedProperties.$inferSelect;
export type NewSavedProperty = typeof savedProperties.$inferInsert;
