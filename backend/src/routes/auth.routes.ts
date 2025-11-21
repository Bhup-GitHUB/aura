import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  Bindings,
} from "../types";
import { AuthController } from "../controllers/auth.controllers";

const authRoutes = new Hono<{
  Bindings: Bindings;
  Variables: { userId: number };
}>();

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

authRoutes.post("/logout", authMiddleware, AuthController.logout);

authRoutes.get("/me", authMiddleware, AuthController.getProfile);

authRoutes.put(
  "/me",
  authMiddleware,
  zValidator("json", updateProfileSchema),
  AuthController.updateProfile
);

authRoutes.put(
  "/change-password",
  authMiddleware,
  zValidator("json", changePasswordSchema),
  AuthController.changePassword
);

authRoutes.post("/refresh", AuthController.refreshToken);

export default authRoutes;
