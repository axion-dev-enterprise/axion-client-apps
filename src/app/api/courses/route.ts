import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const courses = await db.getCoursesWithLessons();
    return NextResponse.json(courses);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao buscar cursos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Título do curso é obrigatório" }, { status: 400 });
    }
    const created = await db.createCourse({
      title: body.title,
      description: body.description || "",
      category: body.category || "Geral",
      level: body.level || "Intermediário",
      thumbnail: body.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      instructor: body.instructor || "Isabela - The English Empire",
      price: Number(body.price) || 0,
      featured: !!body.featured,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao criar curso" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    await db.deleteCourse(id);
    return NextResponse.json({ ok: true, message: "Curso removido com sucesso" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao excluir curso" }, { status: 500 });
  }
}
