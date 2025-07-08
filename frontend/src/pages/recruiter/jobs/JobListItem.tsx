import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { useJobContext } from "@/hooks/useJobContext";

export const JobListItem: React.FC = () => {
  const { jobs } = useJobContext();
  const navigate = useNavigate();

  const vagasVisiveis = jobs.filter((job) => job.status === "aberta");

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Candidaturas por Vaga</h2>

      {vagasVisiveis.length === 0 ? (
        <p className="text-gray-600">Nenhuma vaga disponível para candidaturas.</p>
      ) : (
        <ul className="space-y-4">
          {vagasVisiveis.map((job) => {
            const diasRestantes = formatDistanceToNow(new Date(job.expirationDate), {
              addSuffix: true,
              locale: pt,
            });

            return (
              <li
                key={job.id}
                className="bg-white rounded-lg shadow-md p-5 flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.department} · {job.type} · {job.location}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Expira {diasRestantes} — <span className="font-medium">{job.candidateCount} candidatos</span>
                  </p>
                </div>

                <Button
                  onClick={() => navigate(`/rh/vagas/${job.id}/candidaturas`)}
                  className="w-full md:w-auto"
                >
                  Ver Candidatos
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
