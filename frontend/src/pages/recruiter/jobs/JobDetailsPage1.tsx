import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ScheduleInterviewModal } from "@/components/cards/forms/ScheduleInterviewModal";
import { useJobDetails } from "@/hooks/useJobDetails";
import { CandidateCard } from "@/components/cards/Candidatecard";
import { InterviewItem } from "@/components/InterviewItem";

export const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    job,
    modalOpen,
    selectedCandidate,
    setModalOpen,
    openScheduleModal,
    handleScheduleSubmit,
    handleAvaliar,
    handleFecharCandidaturas,
  } = useJobDetails(id);

  if (!job) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Vaga não encontrada</h1>
        <Button onClick={() => navigate("/rh/vagas")}>Voltar</Button>
      </div>
    );
  }

  const candidatosAvaliados = job.candidatos.filter((c) => c.avaliado);
  const candidatosNaoAvaliados = job.candidatos.filter((c) => !c.avaliado);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vaga: {job.title}</h1>

      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <p>
          <strong>Status:</strong> {job.status}
        </p>
        <p>
          <strong>Local:</strong> {job.local}
        </p>
        <p>
          <strong>Data de criação:</strong> {job.dataCriacao}
        </p>
        <p className="mt-2 text-gray-700 whitespace-pre-line">{job.descricao}</p>
        {job.status === "aberta" && (
          <Button className="mt-4" variant="destructive" onClick={handleFecharCandidaturas}>
            Fechar candidaturas
          </Button>
        )}
      </div>

      <Tabs defaultValue="candidatos">
        <TabsList>
          <TabsTrigger value="candidatos">Candidatos</TabsTrigger>
          <TabsTrigger value="entrevistas">Entrevistas</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
        </TabsList>

        {/* Candidatos não avaliados */}
        <TabsContent value="candidatos">
          {candidatosNaoAvaliados.length === 0 ? (
            <p className="text-gray-600">Nenhum candidato pendente de avaliação.</p>
          ) : (
            <ul className="space-y-4">
              {candidatosNaoAvaliados.map((cand) => (
                <CandidateCard
                  key={cand.id}
                  candidate={cand}
                  jobRequirements={job.requirements}
                  onAvaliar={() => handleAvaliar(cand.id)}
                  onAgendar={() => openScheduleModal(cand.id, cand.nome)}
                />
              ))}
            </ul>
          )}
        </TabsContent>

        {/* Entrevistas */}
        <TabsContent value="entrevistas">
          {job.entrevistas.length === 0 ? (
            <p className="text-gray-600">Nenhuma entrevista agendada.</p>
          ) : (
            <ul className="space-y-3">
              {job.entrevistas.map((int) => (
                <InterviewItem key={int.id} interview={int} />
              ))}
            </ul>
          )}
        </TabsContent>

        {/* Candidatos Avaliados */}
        <TabsContent value="avaliacoes">
          {candidatosAvaliados.length === 0 ? (
            <p className="text-gray-600">Nenhum candidato avaliado ainda.</p>
          ) : (
            <ul className="space-y-4">
              {candidatosAvaliados.map((cand) => (
                <CandidateCard
                  key={cand.id}
                  candidate={cand}
                  jobRequirements={job.requirements}
                  onAgendar={() => openScheduleModal(cand.id, cand.nome)}
                  onAvaliar={() => handleAvaliar(cand.id)}
                />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <ScheduleInterviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleScheduleSubmit}
        candidateName={selectedCandidate?.nome || ""}
        initialDate={""}
        initialTime={""}
        initialMethod={"Presencial"}
      />
    </div>
  );
};
