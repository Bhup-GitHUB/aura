import { eq } from "drizzle-orm";
import { Database, schema } from "../db";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken } from "../utils/token";
import { SignupInput, LoginInput } from "../types";

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

    const hashedPassword = await hashPassword(data.password);

    const result = await this.db
      .insert(schema.users)
      .values({
        username: data.username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      })
      .returning({ id: schema.users.id, username: schema.users.username });

    return result[0];
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

    const token = await generateToken(user.id, user.username);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
