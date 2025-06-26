import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  // Para manejar la navegación entre tabs
  navigateToTab: (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => void;
  forceNavigateToTab: (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => void;
  currentTab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales';
  
  // Para activar el scanner automáticamente
  scannerTrigger: string | null;
  triggerScanner: () => void;
  resetScannerTrigger: () => void;
  
  // Para abrir modales específicos
  openModal: (modal: 'estadisticas' | 'productos') => void;
  closeModal: () => void;
  activeModal: 'estadisticas' | 'productos' | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales'>('dashboard');
  const [scannerTrigger, setScannerTrigger] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'estadisticas' | 'productos' | null>(null);

  const navigateToTab = (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => {
    setCurrentTab(tab);
  };

  const forceNavigateToTab = (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => {
    if (currentTab === tab) {
      setCurrentTab('dashboard');
      setTimeout(() => setCurrentTab(tab), 10); // Pequeño delay para forzar el cambio
    } else {
      setCurrentTab(tab);
    }
  };

  const triggerScanner = () => {
    setScannerTrigger(Date.now().toString());
  };

  const resetScannerTrigger = () => {
    setScannerTrigger(null);
  };

  const openModal = (modal: 'estadisticas' | 'productos') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const value: NavigationContextType = {
    navigateToTab,
    forceNavigateToTab,
    currentTab,
    scannerTrigger,
    triggerScanner,
    resetScannerTrigger,
    openModal,
    closeModal,
    activeModal,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}; 