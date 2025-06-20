import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/types';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  currentRole: 'ADMIN',
  setCurrentRole: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentRole,
        setCurrentRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};