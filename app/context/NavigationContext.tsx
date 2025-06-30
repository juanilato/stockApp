import React, { createContext, useContext, useState } from 'react';

export interface NavigationContextType {
  // Para manejar la navegación entre tabs
  navigateToTab: (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => void;
  forceNavigateToTab: (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => void;
  currentTab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales';
  setCurrentTab: (tab: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => void;
  
  // Para activar el scanner automáticamente
  scannerTrigger: string | null;
  triggerScanner: () => void;
  resetScannerTrigger: () => void;
  
  // Para abrir modales específicos
  openModal: (modalId: string) => void;
  closeModal: () => void;
  activeModal: string | null;
  
  // Nuevo para shouldOpenScanner y setShouldOpenScanner
  shouldOpenScanner: boolean;
  setShouldOpenScanner: (shouldOpen: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

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
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [shouldOpenScanner, setShouldOpenScanner] = useState(false);

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

  const openModal = (modalId: string) => setActiveModal(modalId);
  const closeModal = () => setActiveModal(null);

  const contextValue: NavigationContextType = {
    navigateToTab,
    forceNavigateToTab,
    currentTab,
    setCurrentTab,
    scannerTrigger,
    triggerScanner,
    resetScannerTrigger,
    openModal,
    closeModal,
    activeModal,
    shouldOpenScanner,
    setShouldOpenScanner,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}; 