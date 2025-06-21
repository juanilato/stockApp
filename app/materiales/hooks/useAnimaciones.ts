import { useState } from 'react';

interface ToastType {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const useAnimaciones = () => {
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showEditAnimation, setShowEditAnimation] = useState(false);
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);
  const [toast, setToast] = useState<ToastType | null>(null);

  const mostrarToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return {
    showSaveAnimation,
    setShowSaveAnimation,
    showEditAnimation,
    setShowEditAnimation,
    showDeleteAnimation,
    setShowDeleteAnimation,
    toast,
    setToast,
    mostrarToast,
  };
}; 