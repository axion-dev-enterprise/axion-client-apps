import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, IS_SUPABASE_CONNECTED } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "thumbnails";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Se o Supabase estiver conectado com Service Role Key, envia pro Supabase Storage
    if (IS_SUPABASE_CONNECTED && supabaseAdmin) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error("Erro no Supabase Storage:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        storage: "supabase",
        fileName,
      });
    }

    // Fallback: Retorna URL de demonstração ou URL simulada se o Supabase não estiver configurado
    const sampleUrls: Record<string, string> = {
      thumbnails: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      "course-media": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    };

    return NextResponse.json({
      url: sampleUrls[bucket] || sampleUrls.thumbnails,
      storage: "local-demo",
      fileName,
      note: "Modo de teste: envie credenciais Supabase no .env para gravar em storage real",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no processamento do upload" }, { status: 500 });
  }
}
