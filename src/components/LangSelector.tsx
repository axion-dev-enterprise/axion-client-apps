"use client";
import { useLang } from "./LangContext";

export function LangSelector() {
  const { lang, setLang } = useLang();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--border)",
        color: "var(--text-main)",
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        outline: "none",
      }}
    >
      <option value="pt" style={{ background: "#111" }}>🇧🇷 PT</option>
      <option value="en" style={{ background: "#111" }}>🇺🇸 EN</option>
      <option value="es" style={{ background: "#111" }}>🇪🇸 ES</option>
    </select>
  );
}
