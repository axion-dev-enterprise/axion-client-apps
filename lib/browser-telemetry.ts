"use client";

type TelemetryPayload = { eventName: string; metadata?: Record<string, unknown> };

function redact(value: unknown) {
  return String(value ?? "").replace(/(bearer\s+)[^\s]+/gi, "$1[redigido]").slice(0, 300);
}

export function track(payload: TelemetryPayload) {
  const body = JSON.stringify({ ...payload, traceId: crypto.randomUUID() });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/telemetry", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/telemetry", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
}

export function initBrowserTelemetry() {
  window.addEventListener("error", (event) => track({ eventName: "client_error", metadata: { message: redact(event.message) } }));
  window.addEventListener("unhandledrejection", (event) => track({ eventName: "unhandled_rejection", metadata: { message: redact(event.reason) } }));
  track({ eventName: "page_view", metadata: { path: window.location.pathname } });
}
