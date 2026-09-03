"use client";

type CertificateModalProps = {
  studentName: string;
  courseTitle: string;
  onClose: () => void;
};

export function CertificateModal({ studentName, courseTitle, onClose }: CertificateModalProps) {
  const dateStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 860,
          padding: 0,
          background: "linear-gradient(135deg, #0d0f17 0%, #151824 100%)",
          border: "2px solid var(--gold)",
          boxShadow: "0 0 50px rgba(245, 192, 66, 0.25)",
        }}
      >
        {/* Actions Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="badge-gold">👑 Certificado Oficial de Fluência Imperial</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-gold" onClick={handlePrint} style={{ padding: "6px 16px", fontSize: 13 }}>
              🖨️ Imprimir / Salvar PDF
            </button>
            <button className="btn-outline" onClick={onClose} style={{ padding: "6px 14px", fontSize: 13 }}>
              ✕ Fechar
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div
          id="certificate-print-area"
          style={{
            padding: "50px 40px",
            textAlign: "center",
            background: "radial-gradient(circle at center, rgba(245,192,66,0.05) 0%, rgba(0,0,0,0) 70%)",
            position: "relative",
          }}
        >
          {/* Decorative Corner Borders */}
          <div style={{ position: "absolute", top: 20, left: 20, width: 40, height: 40, borderTop: "2px solid var(--gold)", borderLeft: "2px solid var(--gold)" }} />
          <div style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderTop: "2px solid var(--gold)", borderRight: "2px solid var(--gold)" }} />
          <div style={{ position: "absolute", bottom: 20, left: 20, width: 40, height: 40, borderBottom: "2px solid var(--gold)", borderLeft: "2px solid var(--gold)" }} />
          <div style={{ position: "absolute", bottom: 20, right: 20, width: 40, height: 40, borderBottom: "2px solid var(--gold)", borderRight: "2px solid var(--gold)" }} />

          {/* Logo & Header */}
          <div style={{ width: 50, height: 50, borderRadius: 12, background: "linear-gradient(135deg, #f5c042, #c4911d)", color: "#000", fontSize: 26, fontWeight: 800, margin: "0 auto 16px", display: "grid", placeItems: "center" }}>
            E
          </div>
          <div className="serif" style={{ fontSize: 14, letterSpacing: 3, color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>
            The English Empire · Mentoria VIP
          </div>

          <h1 className="serif gold-text" style={{ fontSize: 34, margin: "0 0 16px" }}>
            CERTIFICADO DE EXCELÊNCIA
          </h1>

          <p style={{ color: "var(--text-muted)", fontSize: 15, margin: "0 0 24px" }}>
            Certificamos com distinção que o(a) executivo(a)
          </p>

          <h2 className="serif" style={{ fontSize: 32, color: "#fff", margin: "0 0 20px", textDecoration: "underline rgba(245,192,66,0.5)" }}>
            {studentName || "Executivo(a) VIP"}
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
            concluiu com êxito todos os módulos e avaliações práticas do programa de mentoria avançada:
            <strong style={{ color: "var(--gold)", display: "block", fontSize: 18, marginTop: 8 }}>
              {courseTitle}
            </strong>
          </p>

          {/* Signatures & Seal */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Playfair Display", fontStyle: "italic", fontSize: 20, color: "var(--gold)" }}>
                Isabela — The English Empire
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, borderTop: "1px solid var(--border)", paddingTop: 4, width: 200 }}>
                Instrutora & Mentor Lead
              </div>
            </div>

            <div style={{ width: 70, height: 70, borderRadius: "50%", border: "2px double var(--gold)", display: "grid", placeItems: "center", color: "var(--gold)", fontSize: 10, fontWeight: 700, textAlign: "center" }}>
              SELO<br />IMPERIAL<br />VIP
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{dateStr}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, borderTop: "1px solid var(--border)", paddingTop: 4, width: 200 }}>
                Data de Emissão
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
