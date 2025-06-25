import { useEffect, useState } from 'react';
import { Material, obtenerMateriales } from '../../../services/db';

export const useMateriales = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);

  const cargarMateriales = async () => {
    try {
      console.log('🔍 useMateriales - Iniciando carga de materiales');
      obtenerMateriales((materiales) => {
        console.log('🔍 useMateriales - Materiales cargados:', materiales);
        console.log('🔍 useMateriales - Cantidad:', materiales.length);
        console.log('🔍 useMateriales - Tipos de datos:', materiales.map(m => ({
          id: typeof m.id,
          nombre: typeof m.nombre,
          precioCosto: typeof m.precioCosto,
          unidad: typeof m.unidad,
          stock: typeof m.stock
        })));
        setMateriales(materiales);
      });
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    }
  };

  // Debug: monitorear cambios en materiales
  useEffect(() => {
    console.log('🔍 useMateriales - Estado materiales actualizado:', materiales.length);
  }, [materiales]);

  return {
    materiales,
    cargarMateriales,
  };
}; 