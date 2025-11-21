import { Context, Next } from "hono";
import { verifyToken, decodeToken } from "../utils/token";
import { Bindings } from "../types";

export const authMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: { userId: number } }>,
  next: Next
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authHeader.substring(7);
  const isValid = await verifyToken(token);

  if (!isValid) {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }

  const payload = await decodeToken(token);

  if (!payload) {
    return c.json({ success: false, message: "Invalid token payload" }, 401);
  }

  c.set("userId", payload.userId);

  await next();
};
