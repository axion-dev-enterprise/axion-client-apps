import { describe, expect, it } from "vitest";
import { compatibilityScore, pickCandidate } from "@/lib/matching";
import { directInviteSchema, feedbackSchema, messageSchema, onboardingSchema, requestSchema } from "@/lib/validators";

const request = {
  subject: "Matemática",
  topic: "Funções",
  availability: ["seg-19", "qua-19"],
  format: "questions" as const,
  camera: "optional" as const
};

describe("matching algorithm", () => {
  it("prioriza disponibilidade e formato compatíveis com score 100", () => {
    const score = compatibilityScore(request, { ...request, id: "candidate-1" });
    expect(score).toBe(100);
  });

  it("retorna score intermediário para compatibilidade parcial", () => {
    const partialCandidate = {
      id: "candidate-2",
      subject: "Matemática",
      topic: "Geometria",
      availability: ["seg-19"],
      format: "silent" as const,
      camera: "optional" as const
    };
    const score = compatibilityScore(request, partialCandidate);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThan(100);
  });

  it("não cruza matérias diferentes", () => {
    expect(pickCandidate(request, [{ ...request, id: "candidate-3", subject: "Física" }])).toBeNull();
  });

  it("seleciona o candidato com maior pontuação acima do limiar de 70%", () => {
    const candidateA = {
      id: "cand-a",
      subject: "Matemática",
      topic: "Geometria",
      availability: ["seg-19"],
      format: "silent" as const,
      camera: "off" as const
    };
    const candidateB = {
      id: "cand-b",
      subject: "Matemática",
      topic: "Funções",
      availability: ["seg-19", "qua-19"],
      format: "questions" as const,
      camera: "optional" as const
    };
    const best = pickCandidate(request, [candidateA, candidateB]);
    expect(best?.candidate.id).toBe("cand-b");
    expect(best?.score).toBe(100);
  });
});

describe("segurança e moderação do chat (anti-evasão)", () => {
  it("permite mensagens de foco legítimas", () => {
    const valid = messageSchema.safeParse({ body: "Vamos começar pelas questões da página 42?" });
    expect(valid.success).toBe(true);
  });

  it("bloqueia URLs e links externos", () => {
    const invalidUrl = messageSchema.safeParse({ body: "Me adiciona lá: https://discord.gg/exemplo" });
    expect(invalidUrl.success).toBe(false);
  });

  it("bloqueia números de telefone / WhatsApp", () => {
    const invalidPhone = messageSchema.safeParse({ body: "Meu zap é 11 99999-8888 me chama" });
    expect(invalidPhone.success).toBe(false);
  });

  it("bloqueia menções a redes sociais de contato externo", () => {
    const invalidSocial = messageSchema.safeParse({ body: "Segue meu instagram @estudos_enem" });
    expect(invalidSocial.success).toBe(false);
  });
});

describe("validação de formulários e schemas", () => {
  it("valida cadastro de onboarding com maioridade obrigatória", () => {
    const valid = onboardingSchema.safeParse({
      displayName: "Camila Silva",
      email: "camila@email.com",
      studyGoal: "ENEM 2027 Medicina",
      adultConfirmed: true,
      conductAccepted: true
    });
    expect(valid.success).toBe(true);
  });

  it("rejeita onboarding sem confirmação de maioridade 18+", () => {
    const invalid = onboardingSchema.safeParse({
      displayName: "Pedro",
      email: "pedro@email.com",
      studyGoal: "ENEM",
      adultConfirmed: false,
      conductAccepted: true
    });
    expect(invalid.success).toBe(false);
  });

  it("valida feedback pós-sessão estruturado", () => {
    const validFeedback = feedbackSchema.safeParse({
      rating: 5,
      productivityScore: 4,
      comfortScore: 5,
      repeatIntent: true,
      notes: "Sessão muito focada, resolvemos 15 exercícios."
    });
    expect(validFeedback.success).toBe(true);
  });

  it("valida convite direto para buddy existente", () => {
    const validInvite = directInviteSchema.safeParse({
      buddyId: "550e8400-e29b-41d4-a716-446655440000",
      subject: "Biologia",
      topic: "Citologia",
      format: "discussion",
      camera: "on",
      slot: "ter-19"
    });
    expect(validInvite.success).toBe(true);
  });
});
