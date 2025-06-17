// hooks/useNuevaVenta/useMensajeFlotante.ts
import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useSonidos } from './useSonidos';

export const useMensajeFlotante = () => {
  const [mensaje, setMensaje] = useState('');
  const [visible, setVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const { reproducirCheck, reproducirError } = useSonidos();

  const mostrarMensaje = async (texto: string) => {
    setMensaje(texto);
    setVisible(true);
    anim.setValue(0);

    const lower = texto.toLowerCase();
    if (lower.includes('agregado')) {
      await reproducirCheck();
    } else if (lower.includes('ya escaneado') || lower.includes('no encontrado')) {
      await reproducirError();
    }

    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false);
          setMensaje('');
        });
      }, 1200);
    });
  };

  return {
    mensaje,
    visible,
    anim,
    mostrarMensaje,
  };
};
