import { z } from "zod";

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(2).max(40),
  email: z.string().trim().email().max(160),
  studyGoal: z.string().trim().min(3).max(120),
  adultConfirmed: z.literal(true),
  conductAccepted: z.literal(true)
});

export const requestSchema = z.object({
  subject: z.string().trim().min(2).max(60),
  topic: z.string().trim().min(2).max(100),
  format: z.enum(["silent", "questions", "discussion", "review"]),
  camera: z.enum(["on", "optional", "off"]),
  availability: z.array(z.string().regex(/^(seg|ter|qua|qui|sex|sab|dom)-(07|12|16|19|21)$/)).min(1).max(8)
});

export const responseSchema = z.object({ response: z.enum(["accept", "decline"]) });
export const sessionSchema = z.object({ action: z.enum(["start", "complete"]) });
export const buddySchema = z.object({ matchId: z.string().uuid() });
export const directInviteSchema = z.object({
  buddyId: z.string().uuid(),
  subject: z.string().trim().min(2).max(60),
  topic: z.string().trim().min(2).max(100),
  format: z.enum(["silent", "questions", "discussion", "review"]),
  camera: z.enum(["on", "optional", "off"]),
  slot: z.string().regex(/^(seg|ter|qua|qui|sex|sab|dom)-(07|12|16|19|21)$/)
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  productivityScore: z.number().int().min(1).max(5),
  comfortScore: z.number().int().min(1).max(5),
  repeatIntent: z.boolean(),
  notes: z.string().max(500).optional().default("")
});

export const safetySchema = z.object({
  matchId: z.string().uuid(),
  reason: z.enum(["inappropriate", "harassment", "unsafe", "other"]),
  block: z.boolean()
});

export const messageSchema = z.object({
  body: z.string().trim().min(1).max(400)
}).superRefine(({ body }, context) => {
  if (/https?:\/\/|www\.|\+?\d[\d\s().-]{7,}\d|whatsapp|instagram|telegram|tiktok/i.test(body)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Para sua segurança, não envie links, telefones ou redes sociais pelo chat." });
  }
});
