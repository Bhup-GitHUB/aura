import { eq } from "drizzle-orm";
import { Database, schema } from "../db";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken, decodeToken } from "../utils/token";
import {
  SignupInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "../types";

export class AuthService {
  constructor(private db: Database) {}

  async signup(data: SignupInput) {
    const existingUser = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, data.username))
      .limit(1)
      .then((users) => users[0]);

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const existingEmail = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email))
      .limit(1)
      .then((users) => users[0]);

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const result = await this.db
      .insert(schema.users)
      .values({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        brokerage: data.brokerage,
        subscriptionTier: "free",
        createdAt: new Date().toISOString(),
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        username: schema.users.username,
        subscriptionTier: schema.users.subscriptionTier,
      });

    const user = result[0];
    const token = await generateToken(
      user.id,
      user.email,
      user.username,
      user.subscriptionTier
    );

    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, data.username))
      .limit(1)
      .then((users) => users[0]);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await verifyPassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    await this.db
      .update(schema.users)
      .set({ lastLogin: new Date().toISOString() })
      .where(eq(schema.users.id, user.id));

    const token = await generateToken(
      user.id,
      user.email,
      user.username,
      user.subscriptionTier
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        subscriptionTier: user.subscriptionTier,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        username: schema.users.username,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        brokerage: schema.users.brokerage,
        subscriptionTier: schema.users.subscriptionTier,
        createdAt: schema.users.createdAt,
        lastLogin: schema.users.lastLogin,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .then((users) => users[0]);

    if (!user) {
      throw new Error("User not found");
    }

    const profile = await this.db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId))
      .limit(1)
      .then((profiles) => profiles[0]);

    return { ...user, profile };
  }

  async updateProfile(userId: number, data: UpdateProfileInput) {
    await this.db
      .update(schema.users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        brokerage: data.brokerage,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.users.id, userId));

    const existingProfile = await this.db
      .select()
      .from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId))
      .limit(1)
      .then((profiles) => profiles[0]);

    if (existingProfile) {
      await this.db
        .update(schema.userProfiles)
        .set({
          phone: data.phone,
          address: data.address,
          city: data.city,
        })
        .where(eq(schema.userProfiles.userId, userId));
    } else {
      await this.db.insert(schema.userProfiles).values({
        userId,
        phone: data.phone,
        address: data.address,
        city: data.city,
      });
    }

    return this.getProfile(userId);
  }

  async changePassword(userId: number, data: ChangePasswordInput) {
    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1)
      .then((users) => users[0]);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await verifyPassword(
      data.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await this.db
      .update(schema.users)
      .set({
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.users.id, userId));

    return { message: "Password changed successfully" };
  }

  async refreshToken(token: string) {
    const payload = await decodeToken(token);

    if (!payload) {
      throw new Error("Invalid token");
    }

    const user = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, payload.userId))
      .limit(1)
      .then((users) => users[0]);

    if (!user) {
      throw new Error("User not found");
    }

    const newToken = await generateToken(
      user.id,
      user.email,
      user.username,
      user.subscriptionTier
    );

    return { token: newToken };
  }
}
