// hooks/useNuevaVenta/useSonidos.ts
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

export const useSonidos = () => {
  const sonidoCheck = useRef<Audio.Sound | null>(null);
  const sonidoError = useRef<Audio.Sound | null>(null);
  const sonidoCompra = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const cargarSonidos = async () => {
      const [check, error, compra] = await Promise.all([
        Audio.Sound.createAsync(require('../../../assets/sounds/succcess.mp3')),
        Audio.Sound.createAsync(require('../../../assets/sounds/error.mp3')),
        Audio.Sound.createAsync(require('../../../assets/sounds/purchase.mp3')),
      ]);

      sonidoCheck.current = check.sound;
      sonidoError.current = error.sound;
      sonidoCompra.current = compra.sound;
    };

    cargarSonidos();

    return () => {
      sonidoCheck.current?.unloadAsync();
      sonidoError.current?.unloadAsync();
      sonidoCompra.current?.unloadAsync();
    };
  }, []);

  return {
    reproducirCheck: async () => await sonidoCheck.current?.replayAsync(),
    reproducirError: async () => await sonidoError.current?.replayAsync(),
    reproducirCompra: async () => await sonidoCompra.current?.replayAsync(),
  };
};
