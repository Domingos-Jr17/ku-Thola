import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { JobMatchingScore } from "@/components/cards/JobMatchingScore";
import { useJobContext } from "@/hooks/useJobContext";

interface Candidate {
  id: string;
  nome: string;
  status: string;
  avaliado: boolean;
  email?: string;
  skills?: string[];
  scoreCompatibilidade?: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  jobRequirements: string[];
  onAvaliar?: () => void;
  onAgendar?: () => void;
  onVerPerfil?: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  jobRequirements,
  onAvaliar,
  onAgendar,
  onVerPerfil,
}) => {
  const navigate = useNavigate();
  const { id: jobId } = useParams<{ id: string }>();
  const { atualizarScoreCompatibilidade } = useJobContext();

  // Calcula a compatibilidade
  const compatibilityScore = useMemo(() => {
    if (!candidate.skills || jobRequirements.length === 0) return 0;

    const normalizedSkills = candidate.skills.map((s) => s.toLowerCase());
    const matched = jobRequirements.filter((req) =>
      normalizedSkills.includes(req.toLowerCase())
    );
    return Math.round((matched.length / jobRequirements.length) * 100);
  }, [candidate.skills, jobRequirements]);

  // Salva no contexto ao montar ou quando o score mudar
  useEffect(() => {
    if (jobId) {
      atualizarScoreCompatibilidade(jobId, candidate.id, compatibilityScore);
    }
  }, [jobId, candidate.id, compatibilityScore, atualizarScoreCompatibilidade]);

  const handleVerPerfil = () => {
    if (onVerPerfil) return onVerPerfil();
    if (jobId) navigate(`/rh/vaga/${jobId}/candidato/${candidate.id}`);
    else navigate(`/rh/candidato/${candidate.id}`);
  };

  return (
    <li className="bg-gray-50 p-4 rounded shadow flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 flex-1 min-w-0">
        <div>
          <h3 className="font-semibold text-lg truncate">{candidate.nome}</h3>
          <p className="text-sm">Status: {candidate.status}</p>
          <p className="text-sm">Avaliado: {candidate.avaliado ? "Sim" : "Não"}</p>
        </div>

        <div className="min-w-[120px]">
          <JobMatchingScore
            jobRequirements={jobRequirements}
            candidateSkills={candidate.skills || []}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" onClick={handleVerPerfil}>
          Ver Perfil
        </Button>

        {candidate.avaliado ? (
          <Button variant="secondary" disabled>
            Avaliado ✓
          </Button>
        ) : (
          <Button variant="outline" onClick={onAvaliar}>
            Avaliar
          </Button>
        )}

        <Button onClick={onAgendar}>Agendar Entrevista</Button>
      </div>
    </li>
  );
};
