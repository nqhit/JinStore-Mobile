import React, { createContext, useContext, useState } from 'react';

type TabBarVisibilityContextType = {
  visible: boolean;
  setVisible: (v: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined);

export const TabBarVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(true);
  return (
    <TabBarVisibilityContext.Provider value={{ visible, setVisible }}>{children}</TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) throw new Error('useTabBarVisibility must be used within TabBarVisibilityProvider');
  return ctx;
};
