PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_property_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer,
	`user_id` integer NOT NULL,
	`fair_market_value_min` real NOT NULL,
	`fair_market_value_max` real NOT NULL,
	`confidence_score` real NOT NULL,
	`valuation_status` text NOT NULL,
	`price_advantage_percent` real,
	`ai_summary` text,
	`risk_factors` text,
	`growth_factors` text,
	`rental_yield_percent` real,
	`projected_5y_growth_percent` real,
	`livability_score` real,
	`infrastructure_score` real,
	`connectivity_score` real,
	`micro_market_avg_price` real,
	`macro_market_avg_price` real,
	`analyzed_at` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_property_analyses`("id", "property_id", "user_id", "fair_market_value_min", "fair_market_value_max", "confidence_score", "valuation_status", "price_advantage_percent", "ai_summary", "risk_factors", "growth_factors", "rental_yield_percent", "projected_5y_growth_percent", "livability_score", "infrastructure_score", "connectivity_score", "micro_market_avg_price", "macro_market_avg_price", "analyzed_at") SELECT "id", "property_id", "user_id", "fair_market_value_min", "fair_market_value_max", "confidence_score", "valuation_status", "price_advantage_percent", "ai_summary", "risk_factors", "growth_factors", "rental_yield_percent", "projected_5y_growth_percent", "livability_score", "infrastructure_score", "connectivity_score", "micro_market_avg_price", "macro_market_avg_price", "analyzed_at" FROM `property_analyses`;--> statement-breakpoint
DROP TABLE `property_analyses`;--> statement-breakpoint
ALTER TABLE `__new_property_analyses` RENAME TO `property_analyses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;