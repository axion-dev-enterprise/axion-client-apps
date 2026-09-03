"use client";
import { useEffect, useRef, useState } from "react";

interface Plan {
  name: string;
  price: string;
  hours: string;
  dur: string;
}

interface Props {
  plan: Plan;
  onClose: () => void;
  onSuccess: () => void;
}

type PayMethod = "stripe" | "mercadopago";
type MpMethod = "pix" | "boleto" | "card";
type Step = "plan" | "payment" | "success";

const PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX01364e384cd1-a8b1-4b3c-9e6b-8c33f0b8d20a5204000053039865802BR5924ISABELA ENGLISH EMPIRE6009SAO PAULO62290525IMPERIA" +
  "LACADEMY2026630487F2";

function CardFlip({ flipped, name, number, expiry, cvv }: {
  flipped: boolean; name: string; number: string; expiry: string; cvv: string;
}) {
  return (
    <div className="card-flip-container">
      <div className={`card-flip-inner ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <div className="card-face card-face-front">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
              <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
                <circle cx="16" cy="8" r="8" fill="rgba(255,200,0,0.8)" />
                <circle cx="32" cy="8" r="8" fill="rgba(255,100,0,0.8)" />
              </svg>
            </div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>VISA</div>
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: 20, letterSpacing: 4,
            color: "rgba(255,255,255,0.9)", margin: "20px 0 8px",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)"
          }}>
            {number || "•••• •••• •••• ••••"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1, marginBottom: 2 }}>TITULAR</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>
                {name || "SEU NOME"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1, marginBottom: 2 }}>VALIDADE</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{expiry || "MM/AA"}</div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="card-face card-face-back">
          <div style={{ background: "rgba(0,0,0,0.6)", height: 36, margin: "0 -24px", borderRadius: 0 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 20, gap: 12 }}>
            <div style={{ flex: 1, height: 36, background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
            <div style={{
              background: "#fff", color: "#000", padding: "6px 14px",
              borderRadius: 4, fontFamily: "monospace", fontWeight: 700, fontSize: 16, letterSpacing: 2,
            }}>
              {cvv || "•••"}
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "right" }}>CVV</div>
        </div>
      </div>
    </div>
  );
}

function StripeForm({ onPay }: { onPay: () => void }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onPay(); }, 2200);
  };

  return (
    <div>
      <CardFlip flipped={flipped} name={name} number={number} expiry={expiry} cvv={cvv} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
            Nome no cartão
          </label>
          <input className="inp" placeholder="RODRIGO MENDONÇA" value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
            Número do cartão
          </label>
          <input className="inp" placeholder="0000 0000 0000 0000" value={number}
            onChange={(e) => setNumber(formatNumber(e.target.value))} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
              Validade
            </label>
            <input className="inp" placeholder="MM/AA" value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
              CVV
            </label>
            <input className="inp" placeholder="•••" maxLength={4} value={cvv}
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} />
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8, fontSize: 12,
          color: "var(--text-dim)", padding: "10px 14px",
          background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)",
          borderRadius: "var(--radius-md)",
        }}>
          🔒 Pagamento 100% seguro via Stripe · Criptografia SSL 256-bit
        </div>

        <button className="btn-gold btn-pulse-gold" style={{ width: "100%", padding: "15px" }}
          onClick={handlePay} disabled={loading}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#060710", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
              Processando...
            </span>
          ) : "💳 Confirmar Pagamento"}
        </button>
      </div>
    </div>
  );
}

function PixForm({ onPay }: { onPay: () => void }) {
  const [copied, setCopied] = useState(false);
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = (seconds / 300) * 100;
  const r = 40;
  const circumference = 2 * Math.PI * r;

  const copy = () => {
    navigator.clipboard.writeText(PIX_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    if (seconds === 0) return;
  }, [seconds]);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Countdown ring */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
            <circle
              cx={50} cy={50} r={r} fill="none"
              stroke={seconds > 60 ? "var(--green)" : seconds > 20 ? "var(--gold)" : "#f87171"}
              strokeWidth={6} strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: seconds > 60 ? "var(--green)" : "var(--gold)", fontFamily: "monospace" }}>
                {mm}:{ss}
              </div>
              <div style={{ fontSize: 9, color: "var(--text-dim)" }}>restantes</div>
            </div>
          </div>
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>
        Escaneie o QR code com seu banco ou copie o código PIX abaixo
      </p>

      {/* QR code visual (SVG mock) */}
      <div className="pix-qr-box" style={{ marginBottom: 20 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {/* QR code visual mock */}
          {[0,1,2,3,4,5,6].flatMap((r) =>
            [0,1,2,3,4,5,6].map((c) => {
              const isCorner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
              const fill = isCorner ? "#000" : Math.random() > 0.45 ? "#000" : "transparent";
              return (
                <rect key={`${r}-${c}`} x={10 + c * 15} y={10 + r * 15}
                  width={12} height={12} rx={2} fill={fill} />
              );
            })
          )}
          <rect x="10" y="10" width="30" height="30" rx="4" fill="none" stroke="#000" strokeWidth="3" />
          <rect x="80" y="10" width="30" height="30" rx="4" fill="none" stroke="#000" strokeWidth="3" />
          <rect x="10" y="80" width="30" height="30" rx="4" fill="none" stroke="#000" strokeWidth="3" />
          <rect x="16" y="16" width="18" height="18" rx="2" fill="#000" />
          <rect x="86" y="16" width="18" height="18" rx="2" fill="#000" />
          <rect x="16" y="86" width="18" height="18" rx="2" fill="#000" />
        </svg>
      </div>

      {/* PIX code copy */}
      <div style={{
        background: "rgba(8,9,16,0.9)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)", padding: "10px 14px",
        fontFamily: "monospace", fontSize: 10, color: "var(--text-muted)",
        wordBreak: "break-all", textAlign: "left", marginBottom: 14,
      }}>
        {PIX_CODE.slice(0, 80)}...
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-outline" style={{ flex: 1 }} onClick={copy}>
          {copied ? "✅ Copiado!" : "📋 Copiar Código PIX"}
        </button>
        <button className="btn-gold" style={{ flex: 1 }} onClick={onPay}>
          ✅ Já paguei
        </button>
      </div>

      <p style={{ marginTop: 14, fontSize: 11, color: "var(--text-dim)" }}>
        🔒 Chave PIX gerada via MercadoPago · Dados encriptados
      </p>
    </div>
  );
}

export function CheckoutModal({ plan, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("plan");
  const [payMethod, setPayMethod] = useState<PayMethod>("stripe");
  const [mpMethod, setMpMethod] = useState<MpMethod>("pix");

  const handleSuccess = () => { setStep("success"); };

  const stepIndex = step === "plan" ? 0 : step === "payment" ? 1 : 2;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 580, padding: 0, overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, rgba(245,200,66,0.06), rgba(159,122,234,0.04))",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div className="badge-gold" style={{ marginBottom: 6 }}>💳 CHECKOUT SEGURO</div>
              <h2 className="serif" style={{ fontSize: 20, margin: 0 }}>{plan.name}</h2>
            </div>
            <button className="btn-ghost" onClick={onClose} style={{ fontSize: 20, color: "var(--text-dim)" }}>✕</button>
          </div>

          {/* Step indicator */}
          <div className="checkout-step-indicator">
            {["Plano", "Pagamento", "Confirmação"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: i < 2 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className={`step-dot ${i < stepIndex ? "done" : i === stepIndex ? "active" : "pending"}`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: i === stepIndex ? "var(--gold)" : "var(--text-dim)", fontWeight: i === stepIndex ? 700 : 400 }}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className={`step-line ${i < stepIndex ? "done" : ""}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>

          {/* STEP 1 — Plan Summary */}
          {step === "plan" && (
            <div>
              <div style={{
                background: "rgba(245,200,66,0.05)", border: "1px solid var(--border-gold)",
                borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 className="serif" style={{ fontSize: 20, margin: "0 0 4px" }}>{plan.name}</h3>
                    <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      ⏱️ {plan.hours} · Duração: {plan.dur}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="gold-text" style={{ fontFamily: "var(--font-ui)", fontSize: 28, fontWeight: 900 }}>{plan.price}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>por mês</div>
                  </div>
                </div>
              </div>

              {[
                "Acesso imediato à plataforma VIP",
                "Aulas individuais 1-on-1 com Isabela",
                "Certificado Internacional de Fluência",
                "Garantia imperial de 7 dias",
                "Suporte WhatsApp dedicado",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13.5, marginBottom: 10 }}>
                  <span style={{ color: "var(--green)", fontSize: 16 }}>✓</span>
                  <span style={{ color: "var(--text-main)" }}>{item}</span>
                </div>
              ))}

              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginTop: 20,
                padding: "12px 16px", background: "rgba(74,222,128,0.05)",
                border: "1px solid rgba(74,222,128,0.15)", borderRadius: "var(--radius-md)",
                fontSize: 13, color: "var(--text-muted)",
              }}>
                🛡️ <strong style={{ color: "var(--green)" }}>Garantia Imperial 7 Dias</strong> — reembolso 100% sem burocracia
              </div>

              <button className="btn-gold btn-pulse-gold" style={{ width: "100%", marginTop: 20, padding: "15px" }}
                onClick={() => setStep("payment")}>
                🚀 Continuar para Pagamento
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === "payment" && (
            <div>
              {/* Payment Method Tabs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {(["stripe", "mercadopago"] as PayMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPayMethod(m)}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: payMethod === m ? "2px solid var(--gold)" : "1px solid var(--border-mid)",
                      background: payMethod === m ? "rgba(245,200,66,0.07)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{m === "stripe" ? "💳" : "🇧🇷"}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: payMethod === m ? "var(--gold)" : "var(--text-main)" }}>
                      {m === "stripe" ? "Stripe" : "MercadoPago"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                      {m === "stripe" ? "Cartão Internacional" : "PIX · Boleto · Cartão BR"}
                    </span>
                  </button>
                ))}
              </div>

              {payMethod === "mercadopago" && (
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {(["pix", "boleto", "card"] as MpMethod[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMpMethod(m)}
                      style={{
                        flex: 1, padding: "8px",
                        borderRadius: "var(--radius-md)",
                        border: mpMethod === m ? "1px solid var(--purple)" : "1px solid var(--border)",
                        background: mpMethod === m ? "rgba(159,122,234,0.1)" : "transparent",
                        cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                        color: mpMethod === m ? "var(--purple-bright)" : "var(--text-muted)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {m === "pix" ? "⚡ PIX" : m === "boleto" ? "📄 Boleto" : "💳 Cartão"}
                    </button>
                  ))}
                </div>
              )}

              {payMethod === "stripe" && <StripeForm onPay={handleSuccess} />}
              {payMethod === "mercadopago" && mpMethod === "pix" && <PixForm onPay={handleSuccess} />}
              {payMethod === "mercadopago" && mpMethod === "boleto" && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
                  <h3 style={{ margin: "0 0 8px" }}>Boleto Bancário</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
                    Vencimento em 3 dias úteis. Compensação em até 2 dias após pagamento.
                  </p>
                  <button className="btn-gold" style={{ width: "100%" }} onClick={handleSuccess}>
                    📥 Gerar e Baixar Boleto
                  </button>
                </div>
              )}
              {payMethod === "mercadopago" && mpMethod === "card" && <StripeForm onPay={handleSuccess} />}
            </div>
          )}

          {/* STEP 3 — Success */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, #4ade80, #16a34a)",
                display: "grid", placeItems: "center",
                margin: "0 auto 20px",
                fontSize: 36,
                boxShadow: "0 0 40px rgba(74,222,128,0.4)",
                animation: "popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}>
                ✅
              </div>

              <h2 className="serif" style={{ fontSize: 26, margin: "0 0 10px", color: "var(--green)" }}>
                Pagamento Confirmado!
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                Bem-vindo ao <strong style={{ color: "var(--gold)" }}>{plan.name}</strong>!
                Você acaba de dar o primeiro passo rumo à fluência imperial.
              </p>

              <div style={{
                background: "rgba(245,200,66,0.06)", border: "1px solid var(--border-gold)",
                borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 24,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  {[
                    { icon: "📧", label: "Confirmação enviada", sub: "para seu e-mail" },
                    { icon: "🔐", label: "Acesso liberado", sub: "imediatamente" },
                    { icon: "👩‍🏫", label: "Isabela entrará", sub: "em contato em 24h" },
                  ].map((item, i) => (
                    <div key={i} style={{ textAlign: "center", flex: 1, minWidth: 100 }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>
                  Fechar
                </button>
                <button className="btn-gold" style={{ flex: 2 }} onClick={() => { onSuccess(); onClose(); }}>
                  🚀 Acessar Plataforma VIP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Spin keyframe inline */
const styleTag = typeof document !== "undefined" && (() => {
  if (document.getElementById("checkout-spin-style")) return;
  const s = document.createElement("style");
  s.id = "checkout-spin-style";
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
})();
