import { Context } from "hono";
import { AuthService } from "../services/auth.service";
import {
  Bindings,
  ApiResponse,
  SignupInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types";
import { createDb } from "../db";

export class AuthController {
  static async signup(c: Context<{ Bindings: Bindings }>) {
    try {
      const data = (await c.req.json()) as SignupInput;
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const result = await authService.signup(data);

      const response: ApiResponse = {
        success: true,
        message: "User created successfully",
        data: result,
      };

      return c.json(response, 201);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "SIGNUP_ERROR",
          message: error instanceof Error ? error.message : "Signup failed",
        },
      };

      return c.json(response, 400);
    }
  }

  static async login(c: Context<{ Bindings: Bindings }>) {
    try {
      const data = (await c.req.json()) as LoginInput;
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const result = await authService.login(data);

      const response: ApiResponse = {
        success: true,
        message: "Login successful",
        data: result,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "LOGIN_ERROR",
          message: error instanceof Error ? error.message : "Login failed",
        },
      };

      return c.json(response, 401);
    }
  }

  static async getProfile(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const profile = await authService.getProfile(userId);

      const response: ApiResponse = {
        success: true,
        data: profile,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "PROFILE_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to get profile",
        },
      };

      return c.json(response, 400);
    }
  }

  static async updateProfile(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const data = (await c.req.json()) as UpdateProfileInput;
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const profile = await authService.updateProfile(userId, data);

      const response: ApiResponse = {
        success: true,
        message: "Profile updated successfully",
        data: profile,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "UPDATE_PROFILE_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to update profile",
        },
      };

      return c.json(response, 400);
    }
  }

  static async changePassword(
    c: Context<{ Bindings: Bindings; Variables: { userId: number } }>
  ) {
    try {
      const userId = c.get("userId");
      const data = (await c.req.json()) as ChangePasswordInput;
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const result = await authService.changePassword(userId, data);

      const response: ApiResponse = {
        success: true,
        message: result.message,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "CHANGE_PASSWORD_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to change password",
        },
      };

      return c.json(response, 400);
    }
  }

  static async refreshToken(c: Context<{ Bindings: Bindings }>) {
    try {
      const authHeader = c.req.header("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Token not provided");
      }

      const token = authHeader.substring(7);
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const result = await authService.refreshToken(token);

      const response: ApiResponse = {
        success: true,
        message: "Token refreshed successfully",
        data: result,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "TOKEN_REFRESH_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to refresh token",
        },
      };

      return c.json(response, 401);
    }
  }

  static async logout(c: Context<{ Bindings: Bindings }>) {
    const response: ApiResponse = {
      success: true,
      message: "Logout successful",
    };

    return c.json(response, 200);
  }
}
