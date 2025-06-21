import { useState } from 'react';

export const useGanancias = () => {
  const [tipoGanancia, setTipoGanancia] = useState<'dia' | 'mes' | 'anio'>('mes');
  const [ganancias, setGanancias] = useState({
    dia: 0,
    mes: 0,
    anio: 0,
  });

  const actualizarGanancias = (nuevasGanancias: { dia: number; mes: number; anio: number }) => {
    setGanancias(nuevasGanancias);
  };

  return {
    ganancias,
    tipoGanancia,
    setTipoGanancia,
    actualizarGanancias,
  };
}; 