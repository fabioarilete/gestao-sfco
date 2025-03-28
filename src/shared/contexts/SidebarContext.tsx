import React, { createContext, useCallback, useContext, useState } from 'react';

interface ISidebarContextData {
  isSidebarOpen: boolean;
  toggleSidebarOpen: () => void;
  sidebarOptions: ISidebarOption[];
  setSidebarOptions: (newSidebarOptions: ISidebarOption[]) => void;
}

interface ISidebarProviderProps {
  children: React.ReactNode;
}

interface ISidebarOption {
  icon: string;
  path: string;
  label: string;
}

const SidebarContex = createContext({} as ISidebarContextData);

export const useSidebarContext = () => {
  return useContext(SidebarContex);
};

export const SidebarProvider: React.FC<ISidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarOptions, setSidebarOptions] = useState<ISidebarOption[]>([]);

  const toggleSidebarOpen = useCallback(() => {
    setIsSidebarOpen(oldSidebarOpen => !oldSidebarOpen);
  }, []);

  const handleSetSidebarOptions = useCallback((newSidebarOptions: ISidebarOption[]) => {
    setSidebarOptions(newSidebarOptions);
  }, []);

  return (
    <SidebarContex.Provider
      value={{
        sidebarOptions,
        setSidebarOptions: handleSetSidebarOptions,
        isSidebarOpen,
        toggleSidebarOpen,
      }}
    >
      {children}
    </SidebarContex.Provider>
  );
};
