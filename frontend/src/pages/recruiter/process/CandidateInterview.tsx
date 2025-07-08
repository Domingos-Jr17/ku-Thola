import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InterviewModal } from "@/components/ui/InterviewModal";
import { useInterview } from "@/hooks/useInterview";
import { useJobContext } from "@/hooks/useJobContext";


export const CandidateInterview = () => {
  const { jobId, candidateId } = useParams<{ jobId: string; candidateId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const { addInterview } = useInterview();
  const { getJobById } = useJobContext();

  const job = getJobById(jobId);
  const candidate = job?.candidatos.find((c: { id: string | undefined; }) => c.id === candidateId);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate(`/rh/vaga/${jobId}/candidato/${candidateId}`);
  };

  const handleConfirm = (data: { date: string; link: string; notes: string }) => {
    if (!candidate || !job) return;

    const newInterview = {
      id: `int-${Date.now()}`,
      candidateId: candidate.id,
      name: candidate.nome,
      email: candidate.email ?? "",
      jobTitle: job.title,
      method: job.type,
      ...data,
    };

    addInterview(newInterview);
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/rh/vaga/${jobId}/candidato/${candidateId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <InterviewModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />

      {submitted && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
          Entrevista agendada com sucesso!
        </div>
      )}
    </div>
  );
};

