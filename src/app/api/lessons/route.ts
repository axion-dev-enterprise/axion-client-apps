import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const courses = await db.getCoursesWithLessons();
    const lessons = courses.flatMap((c) => c.lessons || []);
    return NextResponse.json(lessons);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao buscar aulas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.course_id || !body.title || !body.video_url) {
      return NextResponse.json({ error: "Curso, título e URL do vídeo são obrigatórios" }, { status: 400 });
    }

    const created = await db.createLesson({
      course_id: body.course_id,
      title: body.title,
      video_url: body.video_url,
      duration: body.duration || "15 min",
      order_index: Number(body.order_index) || 1,
      description: body.description || "",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao adicionar aula" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID da aula é obrigatório" }, { status: 400 });
    await db.deleteLesson(id);
    return NextResponse.json({ ok: true, message: "Aula removida com sucesso" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao excluir aula" }, { status: 500 });
  }
}
