"use client";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const traceId = crypto.randomUUID();
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Trace-ID": traceId,
      ...(options?.headers ?? {})
    }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message ?? "Não foi possível concluir esta ação.");
  return payload as T;
}
