import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useJobContext } from "@/hooks/useJobContext";

export const CandidateProfileRh = () => {
  const { jobId, candidateId } = useParams<{ jobId: string; candidateId: string }>();
  const navigate = useNavigate();
  const { getJobById } = useJobContext();

  const job = getJobById(jobId);
  const candidate = job?.candidatos.find((c) => c.id === candidateId);

  if (!job) {
    return <div className="p-6 text-red-600">Vaga não encontrada.</div>;
  }

  if (!candidate) {
    return <div className="p-6 text-red-600">Candidato não encontrado para esta vaga.</div>;
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
        <Button onClick={() => navigate(-1)}>← Voltar</Button>

        <h1 className="text-2xl font-bold mt-4">Perfil do Candidato</h1>

        <div className="mt-6 space-y-4 text-gray-800">
          <p><strong>Nome:</strong> {candidate.nome}</p>
          <p><strong>Status:</strong> {candidate.status}</p>
          <p><strong>Avaliador:</strong> {candidate.avaliado ? "Sim" : "Não"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Button onClick={() => navigate(`/rh/vaga/${jobId}/candidato/${candidateId}/avaliacao`)}>Avaliação Técnica</Button>
          <Button onClick={() => navigate(`/rh/vaga/${jobId}/candidato/${candidateId}/entrevista`)}>Agendar Entrevista</Button>
          <Button onClick={() => navigate(`/rh/vaga/${jobId}/candidato/${candidateId}/comunicacao`)}>Comunicação</Button>
          <Button onClick={() => navigate(`/rh/vaga/${jobId}/candidato/${candidateId}/notificacoes`)}>Notificações</Button>
          <Button onClick={() => navigate(`/rh/vaga/${jobId}/candidato/${candidateId}/feedback`)}>Feedback Final</Button>
        </div>
      </main>
    </div>
  );
};
