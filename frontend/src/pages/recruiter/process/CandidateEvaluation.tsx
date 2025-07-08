import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobContext } from "@/context/jobsContext";
import { FeedbackModal } from "@/components/ui/FeedbackModal";
import { EvaluationForm } from "@/components/cards/forms/EvaluationForm";

interface EvaluationData {
  technical: number;
  communication: number;
  culture: number;
  comments: string;
}

export const CandidateEvaluation = () => {
  const navigate = useNavigate();
  const { jobId, candidateId } = useParams<{ jobId: string; candidateId: string }>();
  const jobContext = useContext(JobContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!jobContext) {
    return <p className="p-6 text-red-600">Contexto de vagas não disponível.</p>;
  }

  const { avaliarCandidatoDetalhado, getJobById } = jobContext;

  const job = getJobById(jobId);
  const candidate = job?.candidatos.find(c => c.id === candidateId);

  const handleSubmit = async (data: EvaluationData) => {
    if (!jobId || !candidateId) {
      setError("Dados insuficientes para realizar avaliação.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      avaliarCandidatoDetalhado(jobId, candidateId, data);
      setModalOpen(true);
    } catch {
      setError("Falha ao salvar avaliação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const confirmAndNavigate = () => {
    setModalOpen(false);
    navigate(`/rh/candidato/${candidateId}/feedback`);
  };

  if (!candidate) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-bold">Candidato não encontrado.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
          <button
            type="button"
            onClick={() => navigate(`/rh/candidato/${candidateId}`)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Voltar para perfil do candidato
          </button>

          <h1 className="text-2xl font-semibold mb-6">Avaliação do Candidato: {candidate.nome}</h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <EvaluationForm onSubmit={handleSubmit} />

          {loading && <p className="mt-4 text-gray-600">Enviando avaliação...</p>}
        </div>
      </main>

      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitFeedback={confirmAndNavigate}
      />
    </div>
  );
};
