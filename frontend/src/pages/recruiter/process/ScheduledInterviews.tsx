import { useState, useMemo, useContext } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { JobContext, type Interview } from "@/context/jobsContext";
import { ScheduleInterviewModal } from "@/components/cards/forms/ScheduleInterviewModal";

const validMethods = ["Presencial", "Zoom", "Google Meet"] as const;
type InterviewMethod = typeof validMethods[number];

function normalizeMethod(method: string | undefined): InterviewMethod {
  if (method && validMethods.includes(method as InterviewMethod)) {
    return method as InterviewMethod;
  }
  return "Presencial"; // valor padrão
}

type InterviewWithJob = Interview & {
  jobId: string;
  jobTitle: string;
  status?: "Confirmada" | "Pendente";
  time?: string;
  method?: InterviewMethod;
};

const STATUS_OPTIONS = ["Todos", "Confirmada", "Pendente"] as const;
type StatusFilter = typeof STATUS_OPTIONS[number];

export const ScheduledInterviews = () => {
  const jobContext = useContext(JobContext);

  if (!jobContext) {
    throw new Error("ScheduledInterviews deve estar dentro do JobProvider");
  }

  const { jobs, agendarEntrevista, deleteInterview } = jobContext;

  // Extrai e normaliza o método das entrevistas
  const allInterviews: InterviewWithJob[] = useMemo(() => {
    return jobs.flatMap((job) =>
      job.entrevistas.map((interview) => ({
        ...interview,
        jobId: job.id,
        jobTitle: job.title,
        method: normalizeMethod(interview.method),
      }))
    );
  }, [jobs]);

  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredInterviews = useMemo(() => {
    return allInterviews.filter(({ name, status }) => {
      const nameMatch = name.toLowerCase().includes(searchName.toLowerCase());
      const statusMatch = statusFilter === "Todos" || status === statusFilter;
      return nameMatch && statusMatch;
    });
  }, [allInterviews, searchName, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / ITEMS_PER_PAGE));

  const paginated = filteredInterviews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<InterviewWithJob | null>(null);

  const handleCancel = (interviewId: string, jobId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar esta entrevista?")) {
      if (deleteInterview) {
        deleteInterview(jobId, interviewId);
      }
    }
  };

  const handleOpenReschedule = (interview: InterviewWithJob) => {
    setSelectedInterview(interview);
    setModalOpen(true);
  };

  const handleRescheduleConfirm = (
    date: string,
    time: string,
    method: InterviewMethod
  ) => {
    if (!selectedInterview) return;

    const updatedInterview: Interview = {
      ...selectedInterview,
      date,
      time,
      method,
    };

    agendarEntrevista(selectedInterview.jobId, updatedInterview);
    setModalOpen(false);
    setSelectedInterview(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Entrevistas Agendadas</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="search"
          placeholder="Buscar por candidato"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 flex-grow min-w-[200px]"
          aria-label="Buscar entrevistas por nome do candidato"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as StatusFilter);
            setPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2"
          aria-label="Filtrar entrevistas por status"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {paginated.length === 0 ? (
        <p className="text-gray-600">Nenhuma entrevista encontrada.</p>
      ) : (
        <div className="space-y-4" role="list">
          {paginated.map((int) => (
            <article
              key={int.id}
              className="bg-white shadow p-4 rounded border-l-4 border-blue-600"
              role="listitem"
              aria-label={`Entrevista com ${int.name} para a vaga ${int.jobTitle}, status ${int.status ?? "Indefinido"}`}
            >
              <h2 className="text-lg font-semibold text-gray-800">{int.name}</h2>
              <p className="text-sm text-gray-600">{int.jobTitle}</p>
              <p className="text-sm mt-1">
                <strong>Data:</strong>{" "}
                {format(new Date(int.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
              </p>
              {int.time && (
                <p className="text-sm">
                  <strong>Hora:</strong> {int.time}
                </p>
              )}
              {int.method && (
                <p className="text-sm">
                  <strong>Via:</strong> {int.method}
                </p>
              )}
              {int.status && (
                <p
                  className={`text-sm font-medium mt-1 ${
                    int.status === "Confirmada" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {int.status}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Button onClick={() => handleOpenReschedule(int)}>Reagendar</Button>
                <Button
                  onClick={() => handleCancel(int.id, int.jobId)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancelar
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-4 flex justify-center gap-2" aria-label="Paginação das entrevistas">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <span className="px-4 py-2 bg-gray-200 rounded" aria-live="polite" aria-atomic="true">
            {page} / {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </nav>
      )}

      <ScheduleInterviewModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedInterview(null);
        }}
        onSubmit={handleRescheduleConfirm}
        initialDate={selectedInterview?.date ?? ""}
        initialTime={selectedInterview?.time ?? ""}
        initialMethod={selectedInterview?.method ?? "Presencial"}
        candidateName={selectedInterview?.name ?? ""}
        isRescheduling
      />
    </div>
  );
};
