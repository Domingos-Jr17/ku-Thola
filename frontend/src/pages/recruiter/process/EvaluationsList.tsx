import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEvaluationContext } from "@/hooks/useEvaluationContext";
import { useJobContext } from "@/hooks/useJobContext";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const EvaluationsList = () => {
  const navigate = useNavigate();
  const { filterEvaluations } = useEvaluationContext();
  const { jobs } = useJobContext();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Avaliações filtradas conforme busca
  const filtered = useMemo(() => filterEvaluations(search), [filterEvaluations, search]);

  // Paginação dos resultados filtrados
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [page, filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  // Busca o título da vaga pelo jobId
  const getJobTitle = (jobId: string) => {
    const job = jobs.find((j) => j._id === jobId);
    return job?.title ?? "Vaga desconhecida";
  };

  // Navegação via teclado (Enter) para acessibilidade
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, candidateId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/rh/candidato/${candidateId}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Avaliações</h1>

      <input
        type="search"
        placeholder="Buscar candidato, email ou avaliação..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        aria-label="Buscar avaliações"
      />

      <table className="min-w-full table-auto bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Candidato</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Vaga</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Técnica</th>
            <th className="px-4 py-2">Comportamental</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-600">
                Nenhuma avaliação encontrada.
              </td>
            </tr>
          ) : (
            paginated.map(({ id, candidateId, candidateName, email, jobId, status, technical, behavioral }) => (
              <tr
                key={id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                tabIndex={0}
                role="button"
                onClick={() => navigate(`/rh/candidato/${candidateId}`)}
                onKeyDown={(e) => handleKeyDown(e, candidateId)}
                aria-label={`Ver detalhes da avaliação do candidato ${candidateName}`}
              >
                <td className="px-4 py-2 font-medium text-gray-800">{candidateName}</td>
                <td className="px-4 py-2 text-blue-600 underline">{email}</td>
                <td className="px-4 py-2">{getJobTitle(jobId)}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={status === "Aprovado" ? "approved" : "rejected"} />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{technical}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{behavioral}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="mt-4 flex justify-center gap-2" role="navigation" aria-label="Paginação de avaliações">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          aria-label="Página anterior"
          type="button"
        >
          ‹
        </button>

        <span className="px-3 py-1 border rounded bg-gray-100" aria-live="polite" aria-atomic="true">
          Página {page} de {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          aria-label="Próxima página"
          type="button"
        >
          ›
        </button>
      </div>
    </div>
  );
};
