import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth.routes";
import { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/api/auth", authRoutes);

export default app;
