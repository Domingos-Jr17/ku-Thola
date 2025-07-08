import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils"; // substitua pela sua função de concatenação de classes (clsx, classnames, etc)

// --- Contexto para gerenciar o estado da aba ativa ---
type TabsContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// --- Componente raiz Tabs ---
// Controlado ou não controlado (defaultValue)
export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue || "");
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalActiveTab;

  const setActiveTab = (tab: string) => {
    if (isControlled && onValueChange) {
      onValueChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// --- Lista dos botões das tabs ---
// Aqui adicionamos role="tablist" para acessibilidade
export function TabsList({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn("flex space-x-2 border-b border-gray-200 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Botão que ativa uma tab ---
// Adicionamos roles e aria attributes para acessibilidade
export function TabsTrigger({
  value,
  children,
  className,
  ...props
}: {
  value: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium border-b-2 transition-all",
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-blue-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Conteúdo que aparece para cada aba ---
// Adiciona role="tabpanel" e aria-labelledby para acessibilidade
export function TabsContent({
  value,
  children,
  className,
  ...props
}: {
  value: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn("mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
