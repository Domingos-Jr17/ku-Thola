import { Link, useLocation } from "react-router-dom";

const labelMap: Record<string, string> = {
  dashboard: "Painel",
  vagas: "Vagas",
  candidatos: "Candidatos",
  avaliacoes: "Avaliações",
  candidato: "Candidato",
  avaliacao: "Avaliação",
  feedback: "Feedback",
  perfil: "Perfil",
};

const format = (slug: string) => {
  if (labelMap[slug]) return labelMap[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const RecruiterBreadcrumb = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-600 space-x-2">
      <Link to="/rh/dashboard" className="hover:text-blue-600">
        Início /
      </Link>
      {parts.map((part, index) => {
        const route = "/" + parts.slice(0, index + 1).join("/");
        return (
          <span key={index}>
            {index > 0 && " / "}
            <Link to={route} className="hover:text-blue-600">
              {format(part)}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};
