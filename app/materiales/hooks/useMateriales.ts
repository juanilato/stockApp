import { useState } from 'react';
import { Material, obtenerMateriales } from '../../../services/db';

export const useMateriales = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);

  const cargarMateriales = async () => {
    try {
      obtenerMateriales((materiales) => {
        setMateriales(materiales);
      });
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    }
  };

  return {
    materiales,
    cargarMateriales,
  };
}; 