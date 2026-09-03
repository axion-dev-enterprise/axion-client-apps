import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    const isValid = await db.authenticateAdmin(email, password);

    if (!isValid) {
      return NextResponse.json({ error: "Credenciais inválidas. Tente admin@axion.com / admin123" }, { status: 401 });
    }

    const token = `token_axion_${Date.now()}_${Buffer.from(email).toString("base64")}`;
    return NextResponse.json({
      success: true,
      token,
      admin: { email, role: "superadmin" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro na autenticação" }, { status: 500 });
  }
}
