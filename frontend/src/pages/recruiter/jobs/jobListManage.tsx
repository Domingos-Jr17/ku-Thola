import React from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

type JobStatus = "aberta" | "fechada" | "rascunho";

interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
}

interface JobListItemProps {
  job: Job;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView: () => void;
  onDuplicate: () => void;
  hideCandidateAccess?: boolean;
}

export const JobListManage: React.FC<JobListItemProps> = ({
  job,
  onDelete,
  onEdit,
  onView,
  onDuplicate,
  hideCandidateAccess = false,
}) => {
  return (
    <li className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-gray-600">{job.description}</p>
        <div className="mt-2">
          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {!hideCandidateAccess && (
          <Button
            variant="outline"
            onClick={() => alert("Acesso a candidatos não implementado aqui")}
            aria-label={`Ver candidatos da vaga ${job.title}`}
          >
            Ver Candidatos
          </Button>
        )}

        <Button variant="default" onClick={onView} aria-label={`Visualizar vaga ${job.title}`}>
          Visualizar
        </Button>

        <Button variant="secondary" onClick={onDuplicate} aria-label={`Duplicar vaga ${job.title}`}>
          Duplicar
        </Button>

        {onEdit && (
          <Button variant="secondary" onClick={() => onEdit(job.id)} aria-label={`Editar vaga ${job.title}`}>
            Editar
          </Button>
        )}

        {onDelete && (
          <Button variant="destructive" onClick={() => onDelete(job.id)} aria-label={`Excluir vaga ${job.title}`}>
            Excluir
          </Button>
        )}
      </div>
    </li>
  );
};
