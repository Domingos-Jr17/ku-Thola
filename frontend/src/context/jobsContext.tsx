/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, type ReactNode } from "react";

export interface Candidate {
  id: string;
  nome: string;
  status: string;
  avaliado: boolean;
  email?: string;
  skills?: string[];
  evaluation?: {
    technical: number;
    communication: number;
    culture: number;
    comments: string;
  };
  scoreCompatibilidade?: number; // Novo campo adicionado
}

export interface Interview {
  id: string;
  name: string;
  date: string;
  link?: string;
  candidateId: string;
  method?: "Presencial" | "Virtual" | string;
  text?: string;
  time?: string;
  status?: "Confirmada" | "Pendente";
}

export interface Job {
  id: string;
  _id: string;
  title: string;
  department: string;
  type: "Presencial" | "Virtual";
  location: string;
  expirationDate: string;
  description: string;
  benefits: string;
  requirements: string[];
  status: "aberta" | "fechada" | "rascunho";
  candidatos: Candidate[];
  entrevistas: Interview[];
  local: ReactNode;
  descricao: ReactNode;
  dataCriacao: ReactNode;
  candidateCount: number;
}

interface JobStats {
  vagasAbertas: number;
  vagasFechadas: number;
  vagasRascunho: number;
  totalCandidatos: number;
  candidatosNovos: number;
  candidatosAvaliados: number;
  totalEntrevistas: number;
  entrevistasHoje: number;
}

interface JobContextType {
  jobs: Job[];
  stats: JobStats;
  addJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  updateJob: (job: Job) => void;
  getJobById: (id: string | undefined) => Job | undefined;
  avaliarCandidato: (jobId: string, candidateId: string) => void;
  avaliarCandidatoDetalhado: (
    jobId: string,
    candidateId: string,
    evaluation: Candidate["evaluation"]
  ) => void;
  atualizarScoreCompatibilidade: (
    jobId: string,
    candidateId: string,
    score: number
  ) => void;
  agendarEntrevista: (jobId: string, interview: Interview) => void;
  fecharCandidaturas: (jobId: string) => void;
  deleteInterview: (jobId: string, interviewId: string) => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

const initialJobs: Job[] = [
  {
    id: "1",
    _id: "1",
    title: "Desenvolvedor Frontend",
    department: "Tecnologia",
    type: "Presencial",
    location: "Maputo",
    expirationDate: "2025-07-07",
    description: "Estamos à procura de um dev frontend com React e Tailwind.",
    requirements: ["React", "Tailwind", "HTML", "CSS"],
    status: "aberta",
    candidatos: [
      {
        id: "1",
        nome: "Domingos Timane",
        status: "Novo",
        avaliado: false,
        email: "domingos@email.com"
      },
      {
        id: "2",
        nome: "Albertina Dlambe",
        status: "Novo",
        avaliado: false,
        email: "albertina@email.com"
      }
    ],
    entrevistas: [],
    local: undefined,
    descricao: undefined,
    dataCriacao: undefined,
    candidateCount: 7,
    benefits: ""
  },
  {
    id: "2",
    _id: "2",
    title: "Desenvolvedor Backend",
    department: "Tecnologia",
    type: "Presencial",
    location: "Maputo",
    expirationDate: "2025-07-01",
    description: "Precisamos de dev backend com Node.js e MongoDB.",
    requirements: ["Node.js", "MongoDB", "Express"],
    status: "aberta",
    candidatos: [],
    entrevistas: [],
    local: undefined,
    descricao: undefined,
    dataCriacao: undefined,
    candidateCount: 7,
    benefits: ""
  }
];

const getJobStats = (jobs: Job[]): JobStats => {
  const today = new Date().toISOString().split("T")[0];

  let vagasAbertas = 0;
  let vagasFechadas = 0;
  let vagasRascunho = 0;
  let totalCandidatos = 0;
  let candidatosNovos = 0;
  let candidatosAvaliados = 0;
  let totalEntrevistas = 0;
  let entrevistasHoje = 0;

  for (const job of jobs) {
    if (job.status === "aberta") vagasAbertas++;
    if (job.status === "fechada") vagasFechadas++;
    if (job.status === "rascunho") vagasRascunho++;

    totalCandidatos += job.candidatos.length;
    candidatosNovos += job.candidatos.filter((c) => !c.avaliado).length;
    candidatosAvaliados += job.candidatos.filter((c) => c.avaliado).length;

    totalEntrevistas += job.entrevistas.length;
    entrevistasHoje += job.entrevistas.filter((e) => e.date.startsWith(today)).length;
  }

  return {
    vagasAbertas,
    vagasFechadas,
    vagasRascunho,
    totalCandidatos,
    candidatosNovos,
    candidatosAvaliados,
    totalEntrevistas,
    entrevistasHoje
  };
};

// Actions
// ----------------------------------------
type JobAction =
  | { type: "ADD_JOB"; payload: Job }
  | { type: "DELETE_JOB"; payload: string }
  | { type: "UPDATE_JOB"; payload: Job }
  | { type: "AVALIAR_CANDIDATO"; payload: { jobId: string; candidateId: string } }
  | {
      type: "AVALIAR_CANDIDATO_DETALHADO";
      payload: { jobId: string; candidateId: string; evaluation: Candidate["evaluation"] };
    }
  | {
      type: "ATUALIZAR_SCORE_COMPATIBILIDADE";
      payload: { jobId: string; candidateId: string; score: number };
    }
  | { type: "AGENDAR_ENTREVISTA"; payload: { jobId: string; interview: Interview } }
  | { type: "FECHAR_CANDIDATURAS"; payload: string }
  | { type: "DELETAR_ENTREVISTA"; payload: { jobId: string; interviewId: string } };

const jobsReducer = (state: Job[], action: JobAction): Job[] => {
  switch (action.type) {
    case "ADD_JOB":
      return [...state, action.payload];
    case "DELETE_JOB":
      return state.filter((job) => job.id !== action.payload);
    case "UPDATE_JOB":
      return state.map((job) =>
        job.id === action.payload.id ? { ...job, ...action.payload } : job
      );
    case "AVALIAR_CANDIDATO":
      return state.map((job) =>
        job.id === action.payload.jobId
          ? {
              ...job,
              candidatos: job.candidatos.map((c) =>
                c.id === action.payload.candidateId
                  ? { ...c, avaliado: true, status: "Avaliado" }
                  : c
              )
            }
          : job
      );
    case "AVALIAR_CANDIDATO_DETALHADO":
      return state.map((job) =>
        job.id === action.payload.jobId
          ? {
              ...job,
              candidatos: job.candidatos.map((c) =>
                c.id === action.payload.candidateId
                  ? {
                      ...c,
                      avaliado: true,
                      status: "Avaliado",
                      evaluation: action.payload.evaluation
                    }
                  : c
              )
            }
          : job
      );
    case "ATUALIZAR_SCORE_COMPATIBILIDADE":
      return state.map((job) =>
        job.id === action.payload.jobId
          ? {
              ...job,
              candidatos: job.candidatos.map((c) =>
                c.id === action.payload.candidateId
                  ? { ...c, scoreCompatibilidade: action.payload.score }
                  : c
              )
            }
          : job
      );
    case "AGENDAR_ENTREVISTA":
      return state.map((job) =>
        job.id === action.payload.jobId
          ? { ...job, entrevistas: [...job.entrevistas, action.payload.interview] }
          : job
      );
    case "DELETAR_ENTREVISTA":
      return state.map((job) =>
        job.id === action.payload.jobId
          ? {
              ...job,
              entrevistas: job.entrevistas.filter(
                (int) => int.id !== action.payload.interviewId
              )
            }
          : job
      );
    case "FECHAR_CANDIDATURAS":
      return state.map((job) =>
        job.id === action.payload ? { ...job, status: "fechada" } : job
      );
    default:
      return state;
  }
};

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, dispatch] = useReducer(jobsReducer, initialJobs);

  const stats = getJobStats(jobs);

  const addJob = (job: Job) => {
    const jobWithId: Job = {
      ...job,
      id: Date.now().toString(),
      _id: Date.now().toString(),
      status: "aberta",
      candidatos: [],
      entrevistas: []
    };
    dispatch({ type: "ADD_JOB", payload: jobWithId });
  };

  const updateJob = (job: Job) => dispatch({ type: "UPDATE_JOB", payload: job });

  const deleteJob = (id: string) => dispatch({ type: "DELETE_JOB", payload: id });

  const getJobById = (id?: string) => jobs.find((job) => job.id === id);

  const avaliarCandidato = (jobId: string, candidateId: string) =>
    dispatch({ type: "AVALIAR_CANDIDATO", payload: { jobId, candidateId } });

  const avaliarCandidatoDetalhado = (
    jobId: string,
    candidateId: string,
    evaluation: Candidate["evaluation"]
  ) =>
    dispatch({
      type: "AVALIAR_CANDIDATO_DETALHADO",
      payload: { jobId, candidateId, evaluation }
    });

  const atualizarScoreCompatibilidade = (
    jobId: string,
    candidateId: string,
    score: number
  ) =>
    dispatch({
      type: "ATUALIZAR_SCORE_COMPATIBILIDADE",
      payload: { jobId, candidateId, score }
    });

  const agendarEntrevista = (jobId: string, interview: Interview) =>
    dispatch({ type: "AGENDAR_ENTREVISTA", payload: { jobId, interview } });

  const fecharCandidaturas = (jobId: string) =>
    dispatch({ type: "FECHAR_CANDIDATURAS", payload: jobId });

  const deleteInterview = (jobId: string, interviewId: string) =>
    dispatch({ type: "DELETAR_ENTREVISTA", payload: { jobId, interviewId } });

  return (
    <JobContext.Provider
      value={{
        jobs,
        stats,
        addJob,
        deleteJob,
        updateJob,
        getJobById,
        avaliarCandidato,
        avaliarCandidatoDetalhado,
        atualizarScoreCompatibilidade,
        agendarEntrevista,
        fecharCandidaturas,
        deleteInterview
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
