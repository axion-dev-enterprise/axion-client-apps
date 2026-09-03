import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { AppError } from "@/lib/errors";

const COOKIE_NAME = "estuda_junto_session";

function secret() {
  const value = process.env.APP_SESSION_SECRET;
  if (!value) {
    throw new AppError("CONFIGURATION_ERROR", "A sessão segura ainda está sendo configurada.", 503);
  }
  return value;
}

function signature(userId: string) {
  return crypto.createHmac("sha256", secret()).update(userId).digest("base64url");
}

export function createSession(userId: string) {
  return `${userId}.${signature(userId)}`;
}

export function currentUserId(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) throw new AppError("UNAUTHENTICATED", "Faça seu cadastro para continuar.", 401);
  const [userId, receivedSignature] = token.split(".");
  if (!userId || !receivedSignature || !crypto.timingSafeEqual(Buffer.from(signature(userId)), Buffer.from(receivedSignature))) {
    throw new AppError("UNAUTHENTICATED", "Sua sessão expirou. Faça o cadastro novamente.", 401);
  }
  return userId;
}

export const sessionCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }
};
