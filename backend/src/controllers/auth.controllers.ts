import { Context } from "hono";
import { AuthService } from "../services/auth.service";
import { Bindings, AuthResponse, SignupInput, LoginInput } from "../types";
import { createDb } from "../db";

export class AuthController {
  static async signup(c: Context<{ Bindings: Bindings }>) {
    try {
      // zValidator middleware has already validated the request
      const data = (await c.req.json()) as SignupInput;
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const user = await authService.signup(data);

      const response: AuthResponse = {
        success: true,
        message: "User created successfully",
        data: { user },
      };

      return c.json(response, 201);
    } catch (error) {
      const response: AuthResponse = {
        success: false,
        message: error instanceof Error ? error.message : "Signup failed",
      };

      return c.json(response, 400);
    }
  }

  static async login(c: Context<{ Bindings: Bindings }>) {
    try {
      // zValidator middleware has already validated the request
      const data = (await c.req.json()) as LoginInput;
      const db = createDb(c.env.DB);
      const authService = new AuthService(db);

      const result = await authService.login(data);

      const response: AuthResponse = {
        success: true,
        message: "Login successful",
        data: result,
      };

      return c.json(response, 200);
    } catch (error) {
      const response: AuthResponse = {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };

      return c.json(response, 401);
    }
  }
}
