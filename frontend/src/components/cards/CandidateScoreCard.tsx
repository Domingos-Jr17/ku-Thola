import { JobMatchingScore } from "./JobMatchingScore";

interface CandidateScoreCardProps {
  id: string;
  name: string;
  status: "Aceito" | "Rejeitado" | "Em análise";
  experienceYears?: number;
  skills?: string[];
  jobRequirements: string[];
}

export const CandidateScoreCard = ({
  id,
  name,
  status,
  experienceYears,
  skills = [],
  jobRequirements,
}: CandidateScoreCardProps) => {
  // Classes para estilizar o status do candidato
  const statusClasses = {
    Aceito: "text-green-600",
    Rejeitado: "text-red-600",
    "Em análise": "text-yellow-600",
  };

  return (
    <article
      key={id}
      className="border rounded-lg p-4 shadow-md space-y-3"
      aria-label={`Candidato ${name}, status ${status}`}
    >
      <h2 className="text-xl font-bold">{name}</h2>

      {/* Componente que calcula e exibe o score de compatibilidade */}
      <JobMatchingScore
        jobRequirements={jobRequirements}
        candidateSkills={skills}
      />

      <p className={`font-semibold ${statusClasses[status]}`}>
        Status: {status}
      </p>

      {experienceYears !== undefined && (
        <p>
          <strong>Experiência:</strong> {experienceYears} anos
        </p>
      )}

      {skills.length > 0 && (
        <p>
          <strong>Skills:</strong> {skills.join(", ")}
        </p>
      )}
    </article>
  );
};
