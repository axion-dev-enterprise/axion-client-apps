import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente Supabase Público (Navegador)
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Cliente Supabase Admin (Servidor) — Bypassa RLS quando configurado
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
    ? createClient(supabaseUrl, (supabaseServiceKey || supabaseAnonKey) as string, {
        auth: { persistSession: false },
      })
    : null;

export const IS_SUPABASE_CONNECTED = !!(supabaseUrl && supabaseAnonKey);

export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  if (!supabase) {
    return {
      connected: false,
      message: "Credenciais do Supabase ausentes em .env (Operando em Modo Local)",
    };
  }

  try {
    const { error } = await supabase.from("courses").select("id").limit(1);
    if (error) {
      return {
        connected: false,
        message: `Erro na consulta Supabase: ${error.message}`,
      };
    }
    return {
      connected: true,
      message: "Supabase Conectado & Operacional!",
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Falha na conexão Supabase: ${err?.message || "Erro desconhecido"}`,
    };
  }
}
