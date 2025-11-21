import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AuthController } from "../controllers/auth.controllers";
import { signupSchema, loginSchema, Bindings } from "../types";

const authRoutes = new Hono<{ Bindings: Bindings }>();

authRoutes.post(
  "/signup",
  zValidator("json", signupSchema),
  AuthController.signup
);

authRoutes.post(
  "/login",
  zValidator("json", loginSchema),
  AuthController.login
);

export default authRoutes;
