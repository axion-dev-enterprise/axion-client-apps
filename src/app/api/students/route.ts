import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const students = await db.getStudents();
    return NextResponse.json(students);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao buscar alunos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Nome e E-mail são obrigatórios" }, { status: 400 });
    }

    const created = await db.createStudent({
      name: body.name,
      email: body.email,
      plan: body.plan || "Plano Ouro",
      status: "Ativo",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao cadastrar aluno" }, { status: 500 });
  }
}
