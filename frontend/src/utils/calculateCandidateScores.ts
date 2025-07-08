export type Candidate = {
  id: string;
  name: string;
  skills: string[];
  experienceYears: number;
  // outras propriedades...
};

export type Job = {
  requiredSkills: string[];
  minimumExperience: number;
  // outras propriedades...
};

export type CandidateScore = Candidate & {
  score: number;          // 0 a 100 (por exemplo)
  status: "Aceito" | "Rejeitado" | "Em análise";
};

export function calculateCandidateScores(
  candidates: Candidate[],
  job: Job
): CandidateScore[] {
  return candidates.map(candidate => {
    let score = 0;

    // Exemplo de cálculo simples:
    // Pontuação por skills
    const matchingSkills = candidate.skills.filter(skill =>
      job.requiredSkills.includes(skill)
    );
    const skillScore = (matchingSkills.length / job.requiredSkills.length) * 70;

    // Pontuação por experiência
    const experienceScore = Math.min(
      (candidate.experienceYears / job.minimumExperience) * 30,
      30
    );

    score = skillScore + experienceScore;

    // Determinar status baseado na pontuação
    let status: CandidateScore["status"] = "Em análise";
    if (score >= 80) status = "Aceito";
    else if (score < 50) status = "Rejeitado";

    return {
      ...candidate,
      score,
      status,
    };
  });
}
