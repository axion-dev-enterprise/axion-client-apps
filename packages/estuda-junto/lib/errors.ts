import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400
  ) {
    super(message);
  }
}

export function problem(error: unknown) {
  const appError = error instanceof AppError
    ? error
    : new AppError("INTERNAL_SERVER_ERROR", "Não foi possível concluir esta ação agora.", 500);

  const traceId = crypto.randomUUID();
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "error",
    service: "estuda-junto",
    traceId,
    code: appError.code,
    message: appError.message
  }));

  return NextResponse.json(
    {
      error: {
        code: appError.code,
        message: appError.message,
        traceId,
        timestamp: new Date().toISOString()
      }
    },
    { status: appError.status, headers: { "X-Trace-ID": traceId } }
  );
}
