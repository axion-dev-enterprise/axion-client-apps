export type MatchInput = {
  subject: string;
  topic: string;
  availability: string[];
  format: "silent" | "questions" | "discussion" | "review";
  camera: "on" | "optional" | "off";
};

export type Candidate = MatchInput & { id: string };

export function compatibilityScore(request: MatchInput, candidate: Candidate) {
  if (request.subject.trim().toLowerCase() !== candidate.subject.trim().toLowerCase()) return 0;

  let score = 55;
  const sharedSlots = request.availability.filter((slot) => candidate.availability.includes(slot)).length;
  score += Math.min(sharedSlots * 15, 30);
  if (request.format === candidate.format) score += 10;
  if (request.camera === candidate.camera || request.camera === "optional" || candidate.camera === "optional") score += 5;
  if (request.topic.trim().toLowerCase() === candidate.topic.trim().toLowerCase()) score += 5;
  return Math.min(score, 100);
}

export function pickCandidate(request: MatchInput, candidates: Candidate[]) {
  return candidates
    .map((candidate) => ({ candidate, score: compatibilityScore(request, candidate) }))
    .filter((item) => item.score >= 70)
    .sort((a, b) => b.score - a.score)[0] ?? null;
}
