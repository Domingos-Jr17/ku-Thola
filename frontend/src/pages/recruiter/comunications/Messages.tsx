/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { useJobContext } from "@/hooks/useJobContext";
import { Pagination } from "@/components/pagination";

interface CandidateMessage {
  id: string;
  name: string;
  email: string;
  lastMessage: string;
  date: string;
}

const ITEMS_PER_PAGE = 5;

const MessageRow: React.FC<{ msg: CandidateMessage }> = ({ msg }) => {
  const navigate = useNavigate();

  const handleViewConversation = () => {
    navigate(`/rh/candidato/${msg.id}/comunicacao`);
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition" tabIndex={0}>
      <td className="px-4 py-2">{msg.name}</td>
      <td className="px-4 py-2">{msg.email}</td>
      <td className="px-4 py-2 truncate max-w-xs" title={msg.lastMessage}>
        {msg.lastMessage}
      </td>
      <td className="px-4 py-2">
        {format(parseISO(msg.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
      </td>
      <td className="px-4 py-2">
        <button
          type="button"
          aria-label={`Ver conversa com ${msg.name}`}
          className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onClick={handleViewConversation}
        >
          Ver Conversa
        </button>
      </td>
    </tr>
  );
};

export const Messages: React.FC = () => {
  const { jobs } = useJobContext();

  // Extraí candidatos e mensagens do contexto
  // Considerando que 'jobs' tem estrutura { candidatos: Candidate[], mensagens: Message[] }
  // Se a estrutura for diferente, adapte aqui
  const candidatos = useMemo(() => {
    // Juntando candidatos de todos os jobs em uma lista única
    return jobs.flatMap((job) => job.candidatos);
  }, [jobs]);

  // Supondo que mensagens estejam em um contexto separado,
  // Se não houver, adapte para buscar do lugar correto
  // Aqui está como exemplo, mensagens dentro do contexto JobContext podem estar organizadas separadamente
  // Vou supor que exista um 'mensagens' array para exemplificar:
  const mensagens = useMemo(() => {
    // Exemplo de onde poderiam estar as mensagens (ajuste conforme seu contexto real)
    // Pode ser necessário buscar mensagens de outro lugar se não estiverem em jobs
    return jobs.flatMap((job) => job.entrevistas); // ajuste para mensagens reais
  }, [jobs]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lista combinada de candidatos com última mensagem
  const messagesList: CandidateMessage[] = useMemo(() => {
    return candidatos.map((candidate) => {
      const candidateMessages = mensagens
        .filter((msg: any) => msg.candidateId === candidate.id)
        .sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      const lastMsg = candidateMessages[0];

      return {
        id: candidate.id,
        name: candidate.nome,
        email: candidate.email ?? "",
        lastMessage: lastMsg?.text ?? "Nenhuma mensagem",
        date: lastMsg?.date ?? new Date().toISOString(),
      };
    });
  }, [candidatos, mensagens]);

  // Filtrar candidatos pela busca
  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messagesList;
    return messagesList.filter((msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, messagesList]);

  // Paginação dos resultados filtrados
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / ITEMS_PER_PAGE));
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredMessages]);

  // Resetar página ao alterar filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mensagens</h1>

      <input
        type="text"
        placeholder="Buscar candidato..."
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar candidato por nome"
      />

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full table-auto min-w-[600px]">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Candidato</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Última Mensagem</th>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Nenhum candidato encontrado.
                </td>
              </tr>
            ) : (
              paginatedMessages.map((msg) => (
                <MessageRow key={msg.id} msg={msg} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page >= 1 && page <= totalPages) setCurrentPage(page);
        }}
      />
    </div>
  );
};
