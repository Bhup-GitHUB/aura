CREATE TABLE `api_usage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`endpoint` text NOT NULL,
	`request_count` integer DEFAULT 1 NOT NULL,
	`gemini_tokens_used` integer DEFAULT 0 NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `investment_picks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locality` text NOT NULL,
	`city` text NOT NULL,
	`description` text NOT NULL,
	`current_price_per_sqft` real NOT NULL,
	`projected_roi_percent` real NOT NULL,
	`tags` text,
	`reasoning` text,
	`confidence_score` real,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `market_trends` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city` text NOT NULL,
	`locality` text,
	`year` integer NOT NULL,
	`quarter` integer,
	`avg_price_per_sqft` real NOT NULL,
	`transaction_volume` integer,
	`supply_months` real,
	`demand_index` real,
	`growth_yoy_percent` real,
	`data_source` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`title` text NOT NULL,
	`description` text,
	`property_type` text NOT NULL,
	`location` text NOT NULL,
	`city` text NOT NULL,
	`locality` text NOT NULL,
	`address` text,
	`latitude` real,
	`longitude` real,
	`price` real NOT NULL,
	`price_per_sqft` real,
	`area_sqft` real NOT NULL,
	`bedrooms` integer,
	`bathrooms` integer,
	`furnishing_status` text,
	`floor_number` integer,
	`total_floors` integer,
	`age_years` integer,
	`amenities` text,
	`created_at` text NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_external_id_unique` ON `properties` (`external_id`);--> statement-breakpoint
CREATE TABLE `property_analyses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
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
CREATE TABLE `saved_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`property_id` integer NOT NULL,
	`notes` text,
	`tags` text,
	`saved_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `search_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`search_query` text NOT NULL,
	`filters` text,
	`results_count` integer,
	`searched_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`phone` text,
	`address` text,
	`city` text,
	`preferences` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `users` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `first_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `brokerage` text;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_tier` text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_login` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);