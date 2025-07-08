/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";

// 🧩 Tipos
export type Feedback = {
  date: string;
  comment: string;
  skills: string[];
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  resumeLink: string;
  notes: string;
  compatibilityScore: number;
  skills: string[];
  feedbacks?: Feedback[];
};

export type CandidateContextType = {
  candidates: Candidate[];
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, data: Partial<Candidate>) => void;
  removeCandidate: (id: string) => void;
};

// 🔌 Criação do Contexto
export const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

// 📦 Dados Mock
const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Albertina Dlambe",
    email: "dlambealbertina@gmail.com",
    phone: "871522004 / 850221504",
    jobTitle: "Desenvolvedor Frontend",
    resumeLink: "https://example.com/cv-albertina.pdf",
    notes: "Candidata com boa comunicação e portfólio completo.",
    compatibilityScore: 85,
    skills: ["React", "TypeScript", "CSS"],
    feedbacks: [],
  },
  {
    id: "2",
    name: "Graça Boaventura Bila",
    email: "gracabilla002@gmail.com",
    phone: "858768416",
    jobTitle: "Desenvolvedor Frontend",
    resumeLink: "https://example.com/cv-graca.pdf",
    notes: "Boa participação em projetos colaborativos.",
    compatibilityScore: 75,
    skills: ["HTML", "CSS", "JavaScript"],
    feedbacks: [],
  },
  {
    id: "3",
    name: "Domingos A. Timane Jr",
    email: "domingosalfredotimane@gmail.com",
    phone: "820885159 / 855735760",
    jobTitle: "Desenvolvedor Frontend",
    resumeLink: "https://example.com/cv-domingos.pdf",
    notes: "Boa aptidão técnica e espírito de liderança.",
    compatibilityScore: 90,
    skills: ["React", "TypeScript", "HTML", "CSS", "Figma"],
    feedbacks: [],
  },
  {
    id: "4",
    name: "Almório Adolfo Chaguala",
    email: "almorioadolfo01@gmail.com",
    phone: "844138349 / 871038349",
    jobTitle: "Analista de Marketing",
    resumeLink: "https://example.com/cv-almorio.pdf",
    notes: "Bom conhecimento de marketing digital.",
    compatibilityScore: 40,
    skills: ["SEO", "Google Ads", "Copywriting"],
    feedbacks: [],
  },
  {
    id: "5",
    name: "Jorge Bernardo Langa",
    email: "jorgebernardolanga@gmail.com",
    phone: "873559810",
    jobTitle: "Analista de Marketing",
    resumeLink: "https://example.com/cv-jorge.pdf",
    notes: "Excelente visão estratégica e comunicação.",
    compatibilityScore: 30,
    skills: ["Marketing Digital", "Excel", "Social Media"],
    feedbacks: [],
  },
  {
    id: "6",
    name: "Neyla Feliza Américo Chavane",
    email: "neylachavane0@gmail.com",
    phone: "847943500",
    jobTitle: "Desenvolvedor Frontend",
    resumeLink: "https://example.com/cv-neylachavane.pdf",
    notes: "Organizada e proativa, com experiência em Tailwind.",
    compatibilityScore: 65,
    skills: ["TypeScript", "Tailwind", "Git"],
    feedbacks: [],
  },
  {
    id: "7",
    name: "Gersina Guambe",
    email: "gersinaguambe@gmail.com",
    phone: "842212345",
    jobTitle: "UI/UX Designer",
    resumeLink: "https://example.com/cv-gersina.pdf",
    notes: "Design centrado no usuário e prototipagem rápida.",
    compatibilityScore: 55,
    skills: ["Figma", "Adobe XD", "CSS"],
    feedbacks: [],
  },
  {
    id: "8",
    name: "Gerson Titos",
    email: "gersontitos@outlook.com",
    phone: "848899123",
    jobTitle: "DevOps Engineer",
    resumeLink: "https://example.com/cv-gerson.pdf",
    notes: "Experiente com integração contínua e pipelines.",
    compatibilityScore: 50,
    skills: ["Docker", "Kubernetes", "Linux", "Git"],
    feedbacks: [],
  },
  {
    id: "9",
    name: "Inocência Albino",
    email: "inocencialbino@empresa.com",
    phone: "870022134",
    jobTitle: "QA Tester",
    resumeLink: "https://example.com/cv-inocencia.pdf",
    notes: "Forte atenção aos detalhes e metodologias ágeis.",
    compatibilityScore: 45,
    skills: ["Jest", "Cypress", "Postman"],
    feedbacks: [],
  },
  {
    id: "10",
    name: "Samuel Munguambe",
    email: "samuel.munguambe@gmail.com",
    phone: "845671234",
    jobTitle: "Desenvolvedor Fullstack",
    resumeLink: "https://example.com/cv-samuel.pdf",
    notes: "Experiência sólida com MERN stack.",
    compatibilityScore: 80,
    skills: ["MongoDB", "Express", "React", "Node.js"],
    feedbacks: [],
  },
  {
    id: "11",
    name: "Carla Ernesto",
    email: "carlaernesto@yahoo.com",
    phone: "846612231",
    jobTitle: "Frontend Developer",
    resumeLink: "https://example.com/cv-carla.pdf",
    notes: "Conhecimento atualizado em CSS moderno.",
    compatibilityScore: 70,
    skills: ["HTML", "CSS", "JavaScript", "React"],
    feedbacks: [],
  },
  {
    id: "12",
    name: "Osvaldo Mucavel",
    email: "osvaldomucavel@gmail.com",
    phone: "849901235",
    jobTitle: "Backend Developer",
    resumeLink: "https://example.com/cv-osvaldo.pdf",
    notes: "Especialista em APIs REST e Node.",
    compatibilityScore: 60,
    skills: ["Node.js", "Express", "PostgreSQL", "TypeScript"],
    feedbacks: [],
  },
];

// ✅ Provider
export const CandidateProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  const addCandidate = (candidate: Candidate) => {
    setCandidates(prev => [...prev, candidate]);
  };

  const updateCandidate = (id: string, data: Partial<Candidate>) => {
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === id ? { ...candidate, ...data } : candidate
      )
    );
  };

  const removeCandidate = (id: string) => {
    setCandidates(prev => prev.filter(candidate => candidate.id !== id));
  };

  return (
    <CandidateContext.Provider
      value={{ candidates, addCandidate, updateCandidate, removeCandidate }}
    >
      {children}
    </CandidateContext.Provider>
  );
};
