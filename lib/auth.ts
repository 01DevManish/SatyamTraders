import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type AuthUser = {
  id: string;
  email: string;
  role: "admin";
};

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  return JWT_SECRET;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(user: AuthUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAdminToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "object" && decoded && "email" in decoded && "id" in decoded) {
      return {
        id: String(decoded.id),
        email: String(decoded.email),
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}
