/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { InputGroup } from "@/components/ui/InputGroup";
import { JobListManage } from "./jobListManage";
import { useJobList } from "@/hooks/useJobList";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/pagination";
import { JobEditForm } from "@/components/jobs/JobEditForm";
import { JobCreateForm } from "@/components/jobs/JobCreateForm";
import { JobDuplicateForm } from "@/components/jobs/JobDuplicateForm";
import { Modal } from "@/components/ui/Modal";
import { SlideOver } from "@/components/ui/SlideOver";
import { PlusCircle, XCircle, Edit, Copy, Trash2 } from "lucide-react";

import { useSearchParams, useNavigate } from "react-router-dom";

import type { Job } from "@/context/jobsContext";

const items_per_page = 5;
type ConfirmActionType = "delete" | "edit" | "duplicate" | null;

export const ManageJobs = () => {
  const { jobs, removeJob, updateJob } = useJobList();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estado da aba, inicializado a partir do parâmetro 'tab' na URL, padrão 'listagem'
  const [tab, setTab] = useState(() => searchParams.get("tab") || "listagem");

  // Sincroniza o estado 'tab' sempre que o parâmetro na URL muda
  useEffect(() => {
    const currentTab = searchParams.get("tab") || "listagem";
    setTab(currentTab);
  }, [searchParams]);

  // Atualiza a URL e o estado da aba quando usuário troca de aba
  const handleTabChange = (newTab: string) => {
    setTab(newTab);

    const params = new URLSearchParams(window.location.search);

    // Remove o parâmetro 'tab' da URL se for a aba padrão, para manter URL limpa
    if (newTab === "listagem") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }

    // Navega para URL atualizada com novo parâmetro
    navigate({ pathname: "/rh/vagas", search: params.toString() }, { replace: true });
  };

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todas" | "aberta" | "fechada" | "rascunho">("todas");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingJob, setEditingJob] = useState<null | Job>(null);
  const [viewingJob, setViewingJob] = useState<null | Job>(null);
  const [duplicatingJob, setDuplicatingJob] = useState<null | Job>(null);

  const [confirmAction, setConfirmAction] = useState<ConfirmActionType>(null);
  const [jobTarget, setJobTarget] = useState<null | Job>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => (filter === "todas" ? true : job.status === filter))
      .filter((job) => job.title.toLowerCase().includes(search.toLowerCase()));
  }, [jobs, search, filter]);

  const totalPages = Math.ceil(filteredJobs.length / items_per_page);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * items_per_page,
    currentPage * items_per_page
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleUpdate = (updatedJob: Job) => {
    const originalJob = jobs.find((j) => j.id === updatedJob.id);
    if (!originalJob) return;

    const statusLowerCase = (updatedJob.status || "").toLowerCase() as Job["status"];

    const updatedFullJob: Job = {
      ...originalJob,
      ...updatedJob,
      status: statusLowerCase,
    };

    updateJob(updatedFullJob);
    toast.success(`Vaga "${updatedFullJob.title}" atualizada com sucesso!`);
    setEditingJob(null);
  };

  const handleDelete = () => {
    if (!jobTarget) return;
    removeJob(jobTarget.id || jobTarget._id);
    toast.success(`Vaga "${jobTarget.title}" removida com sucesso!`);
    setConfirmAction(null);
    setJobTarget(null);
  };

  const handleDuplicateSuccess = () => {
    toast.success("Vaga duplicada com sucesso!");
    setDuplicatingJob(null);
    setTab("listagem");
    // Atualiza a URL para aba listagem também
    handleTabChange("listagem");
  };

  const requestDelete = (job: Job) => {
    setConfirmAction("delete");
    setJobTarget(job);
  };

  const requestEdit = (job: Job) => {
    setConfirmAction("edit");
    setJobTarget(job);
  };

  const requestDuplicate = (job: Job) => {
    setConfirmAction("duplicate");
    setJobTarget(job);
  };

  const confirmHandler = () => {
    if (!jobTarget) return;

    if (confirmAction === "delete") {
      handleDelete();
    } else if (confirmAction === "edit") {
      setEditingJob(jobTarget);
      setConfirmAction(null);
      setJobTarget(null);
    } else if (confirmAction === "duplicate") {
      setDuplicatingJob(jobTarget);
      setConfirmAction(null);
      setJobTarget(null);
    }
  };

  const cancelHandler = () => {
    setConfirmAction(null);
    setJobTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Gerir Vagas</h1>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="listagem" className="flex items-center gap-2">
            📋 Todas ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="criar" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Nova Vaga
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listagem">
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center max-w-md w-full">
                <InputGroup
                  id="searchJob"
                  placeholder="Pesquisar vaga..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                  className="flex-grow"
                  aria-label="Pesquisar vaga"
                />
                {search && (
                  <Button
                    onClick={() => setSearch("")}
                    variant="ghost"
                    className="ml-2 flex items-center gap-1"
                    aria-label="Limpar pesquisa"
                  >
                    <XCircle className="w-4 h-4" /> Limpar
                  </Button>
                )}
              </div>

              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border rounded px-3 py-2 bg-white shadow"
                aria-label="Filtro de vagas"
              >
                <option value="todas">Todas</option>
                <option value="aberta">Abertas</option>
                <option value="fechada">Fechadas</option>
                <option value="rascunho">Rascunhos</option>
              </select>
            </div>

            {paginatedJobs.length === 0 ? (
              <p className="text-gray-600">Nenhuma vaga encontrada.</p>
            ) : (
              <ul className="space-y-4">
                {paginatedJobs.map((job) => (
                  <JobListManage
                    key={job.id || job._id}
                    job={job}
                    onDelete={() => requestDelete(job)}
                    onEdit={() => requestEdit(job)}
                    onDuplicate={() => requestDuplicate(job)}
                    onView={() => setViewingJob(job)}
                    hideCandidateAccess
                  />
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="criar">
          <JobCreateForm onCreated={() => handleTabChange("listagem")} />
        </TabsContent>
      </Tabs>

      <SlideOver
        isOpen={!!viewingJob}
        onClose={() => setViewingJob(null)}
        title="Detalhes da Vaga"
      >
        {viewingJob && (
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <div>
              <strong className="text-gray-900">Título:</strong> {viewingJob.title}
            </div>
            <div>
              <strong className="text-gray-900">Departamento:</strong>{" "}
              {viewingJob.department}
            </div>
            <div>
              <strong className="text-gray-900">Tipo:</strong> {viewingJob.type}
            </div>
            <div>
              <strong className="text-gray-900">Data de Encerramento:</strong>{" "}
              {viewingJob.expirationDate}
            </div>
            <div>
              <strong className="text-gray-900">Localização:</strong>{" "}
              {viewingJob.location}
            </div>
            <div>
              <strong className="text-gray-900">Requisitos:</strong>
              <ul className="list-disc ml-5 mt-1">
                {(viewingJob.requirements || []).map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-gray-900">Descrição:</strong>{" "}
              {viewingJob.description}
            </div>
            <div>
              <strong className="text-gray-900">Benefícios:</strong>{" "}
              {viewingJob.benefits || "Nenhum"}
            </div>
            <div>
              <strong className="text-gray-900">Status:</strong> {viewingJob.status}
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        title="Editar Vaga"
      >
        {editingJob && (
          <JobEditForm
            job={editingJob}
            onSave={handleUpdate}
            onClose={() => setEditingJob(null)}
          />
        )}
      </SlideOver>

      <SlideOver
        isOpen={!!duplicatingJob}
        onClose={() => setDuplicatingJob(null)}
        title="Duplicar Vaga"
      >
        {duplicatingJob && (
          <JobDuplicateForm
            originalJob={duplicatingJob}
            onDuplicated={handleDuplicateSuccess}
            onClose={() => setDuplicatingJob(null)}
          />
        )}
      </SlideOver>

      <Modal
        isOpen={confirmAction !== null}
        onClose={cancelHandler}
        title={
          confirmAction === "delete"
            ? "🗑️ Confirmar Remoção"
            : confirmAction === "edit"
            ? "✏️ Confirmar Edição"
            : "📄 Confirmar Duplicação"
        }
      >
        <p className="mb-4 text-gray-700">
          {confirmAction === "delete"
            ? "Tem certeza que deseja remover esta vaga?"
            : confirmAction === "edit"
            ? "Tem certeza que deseja editar esta vaga?"
            : "Tem certeza que deseja duplicar esta vaga?"}
        </p>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={cancelHandler}>
            Cancelar
          </Button>
          <Button
            variant={confirmAction === "delete" ? "destructive" : "default"}
            onClick={confirmHandler}
            className="flex items-center gap-2"
          >
            {confirmAction === "delete" && (
              <>
                <Trash2 className="w-4 h-4" /> Remover
              </>
            )}
            {confirmAction === "edit" && (
              <>
                <Edit className="w-4 h-4" /> Editar
              </>
            )}
            {confirmAction === "duplicate" && (
              <>
                <Copy className="w-4 h-4" /> Duplicar
              </>
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
