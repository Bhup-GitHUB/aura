import { JWTPayload } from "../types";

export const generateToken = async (
  userId: number,
  email: string,
  username: string,
  subscriptionTier: string
): Promise<string> => {
  const payload: JWTPayload = {
    userId,
    email,
    username,
    subscriptionTier,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const token = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const encodedPayload = btoa(JSON.stringify(payload));

  return `${encodedPayload}.${token}`;
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const payload = JSON.parse(atob(parts[0])) as JWTPayload;

    if (payload.exp < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const decodeToken = async (
  token: string
): Promise<JWTPayload | null> => {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const payload = JSON.parse(atob(parts[0])) as JWTPayload;

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
