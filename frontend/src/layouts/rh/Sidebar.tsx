import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  Menu,
  LogOut,
  ChevronLeft,
  MessageCircle,
  User,
  BarChart2,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  List,
  Settings,
} from "lucide-react";

import { useJobContext } from "@/hooks/useJobContext";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: NavItem[];
  badgeKey?: keyof ReturnType<typeof useJobContext>["stats"];
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { stats } = useJobContext();

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar_collapsed");
    if (savedCollapsed) setCollapsed(JSON.parse(savedCollapsed));
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/rh/dashboard" },
    {
      label: "Vagas",
      icon: <Briefcase size={20} />,
      submenu: [
        { label: "Ver todas", icon: <List size={18} />, path: "/rh/vagas" },
        { label: "Criar nova", icon: <PlusCircle size={18} />, path: "/rh/vagas?tab=criar" },
      ],
    },
    {
      label: "Candidatos",
      icon: <Users size={20} />,
      submenu: [
        {
          label: "Todos os candidatos",
          icon: <Users size={18} />,
          path: "/rh/candidatos",
          badgeKey: "candidatosNovos",
        },
        {
          label: "Por vaga",
          icon: <List size={18} />,
          path: "/rh/candidatos/por-vaga",
        },
      ],
    },
    {
      label: "Entrevistas",
      icon: <CalendarClock size={20} />,
      submenu: [
        {
          label: "Agenda",
          icon: <CalendarClock size={18} />,
          path: "/rh/entrevistas",
          badgeKey: "entrevistasHoje",
        },
       
      ],
    },
    {
      label: "Avaliações",
      icon: <FileText size={20} />,
      submenu: [
        {
          label: "Resultados por candidato",
          icon: <FileText size={18} />,
          path: "/rh/avaliacoes",
        },
      ],
    },
    {
      label: "Mensagens",
      icon: <MessageCircle size={20} />,
      submenu: [
        {
          label: "Conversas",
          icon: <MessageCircle size={18} />,
          path: "/rh/comunicacao",
        },
      ],
    },
    {
      label: "Meu Perfil",
      icon: <User size={20} />,
      path: "/rh/perfil",
    },
    {
      label: "Configurações",
      icon: <Settings size={20} />,
      path: "/rh/configuracoes",
    },
    {
      label: "Relatórios",
      icon: <BarChart2 size={20} />,
      path: "/rh/relatorios",
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const hasSubmenu = !!item.submenu?.length;

    // Se submenu tem exatamente 1 item, renderiza como link direto (sem botão expandir)
    if (hasSubmenu && item.submenu!.length === 1) {
      const sub = item.submenu![0];
      return (
        <li key={item.label}>
          <NavLink
            to={sub.path!}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            {!collapsed && item.label}
            {sub.badgeKey && stats[sub.badgeKey] > 0 && (
              <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {stats[sub.badgeKey]}
              </span>
            )}
          </NavLink>
        </li>
      );
    }

    const isOpen = openMenus.includes(item.label);

    if (hasSubmenu) {
      const activeSub = item.submenu!.some((sub) =>
        location.pathname.startsWith(sub.path || "")
      );

      return (
        <li key={item.label} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.label)}
            aria-expanded={isOpen}
            aria-controls={`submenu-${item.label}`}
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors duration-200
              ${
                activeSub
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-700 hover:text-white"
              }
            `}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              {!collapsed && item.label}
            </span>
            {!collapsed && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>

          {isOpen && !collapsed && (
            <ul
              id={`submenu-${item.label}`}
              role="menu"
              className="pl-12 mt-2 space-y-1"
            >
              {item.submenu!.map((sub) => (
                <li key={sub.label}>
                  <NavLink
                    to={sub.path!}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-gray-300 hover:bg-blue-600 hover:text-white"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      {sub.icon}
                      <span>{sub.label}</span>
                    </span>

                    {sub.badgeKey && stats[sub.badgeKey] > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                        {stats[sub.badgeKey]}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    // Caso sem submenu, renderiza link normal
    return (
      <li key={item.label}>
        <NavLink
          to={item.path!}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-blue-700 hover:text-white"
            }`
          }
        >
          {item.icon}
          {!collapsed && item.label}
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1E3A8A] text-white">
        <h2 className="text-xl font-bold">Ku Thola</h2>
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-16" : "w-64"
        } hidden md:flex flex-col min-h-screen bg-[#1E3A8A] text-white transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-2xl font-bold">Ku Thola</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
            aria-label="Toggle collapse sidebar"
          >
            <ChevronLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <ul className="space-y-2 mt-6 px-2">
          {navItems.map(renderNavItem)}
        </ul>

        {/* Logout */}
        <div className="mt-auto p-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setMobileOpen(false)}
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </NavLink>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-64 bg-[#1E3A8A] text-white h-screen p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Ku Thola</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <ChevronLeft />
              </button>
            </div>
            <ul className="space-y-2 mt-6">{navItems.map(renderNavItem)}</ul>
            <div className="mt-auto p-4">
              <NavLink
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setMobileOpen(false)}
              >
                <LogOut size={20} />
                <span>Sair</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
