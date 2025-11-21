import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { PropertyController } from "../controllers/property.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { propertySchema, savedPropertySchema, Bindings } from "../types";

const propertyRoutes = new Hono<{
  Bindings: Bindings;
  Variables: { userId: number };
}>();

propertyRoutes.get("/", authMiddleware, PropertyController.searchProperties);

propertyRoutes.get("/:id", authMiddleware, PropertyController.getPropertyById);

propertyRoutes.post(
  "/",
  authMiddleware,
  zValidator("json", propertySchema),
  PropertyController.createProperty
);

propertyRoutes.put("/:id", authMiddleware, PropertyController.updateProperty);

propertyRoutes.delete(
  "/:id",
  authMiddleware,
  PropertyController.deleteProperty
);

propertyRoutes.get(
  "/:id/analysis",
  authMiddleware,
  PropertyController.getPropertyAnalysis
);

propertyRoutes.get(
  "/nearby/:id",
  authMiddleware,
  PropertyController.getNearbyProperties
);

propertyRoutes.post(
  "/compare",
  authMiddleware,
  PropertyController.compareProperties
);

propertyRoutes.get(
  "/saved/all",
  authMiddleware,
  PropertyController.getSavedProperties
);

propertyRoutes.post(
  "/saved/:propertyId",
  authMiddleware,
  zValidator("json", savedPropertySchema),
  PropertyController.saveProperty
);

propertyRoutes.delete(
  "/saved/:propertyId",
  authMiddleware,
  PropertyController.removeSavedProperty
);

propertyRoutes.put(
  "/saved/:propertyId",
  authMiddleware,
  zValidator("json", savedPropertySchema),
  PropertyController.updateSavedProperty
);

// AI Analysis Routes
propertyRoutes.post(
  "/analyze-ai",
  authMiddleware,
  zValidator("json", propertySchema),
  PropertyController.analyzePropertyWithAI
);

propertyRoutes.get(
  "/quick-estimate",
  authMiddleware,
  PropertyController.quickPriceEstimate
);

export default propertyRoutes;
