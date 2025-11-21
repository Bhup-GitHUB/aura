export const generateToken = async (
  userId: number,
  username: string
): Promise<string> => {
  const payload = {
    userId,
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    return token.length === 64;
  } catch {
    return false;
  }
};
