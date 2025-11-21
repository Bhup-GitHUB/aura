import { Context, Next } from "hono";
import { verifyToken } from "../utils/token";
import { Bindings } from "../types";

export const authMiddleware = async (
  c: Context<{ Bindings: Bindings }>,
  next: Next
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authHeader.substring(7);
  const isValid = await verifyToken(token);

  if (!isValid) {
    return c.json({ success: false, message: "Invalid token" }, 401);
  }

  await next();
};
