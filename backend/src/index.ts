import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: { userId: number } }>();

app.use("/*", cors());

app.get("/", (c) => {
  return c.json({
    message: "Aura MarketVision API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/api/auth", authRoutes);
app.route("/api/properties", propertyRoutes);

app.notFound((c) => {
  return c.json({ success: false, message: "Route not found" }, 404);
});

app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: err.message || "Internal server error",
      },
    },
    500
  );
});

export default app;
