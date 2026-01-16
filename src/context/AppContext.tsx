import { createContext, ReactNode, useState } from "react";

interface AppContextType {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AppContext.Provider
      value={{ theme, setTheme, sidebarCollapsed, setSidebarCollapsed }}
    >
      {children}
    </AppContext.Provider>
  );
};
