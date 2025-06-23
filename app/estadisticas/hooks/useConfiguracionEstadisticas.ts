import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { CONFIGURACION_DEFAULT, ConfiguracionEstadisticas } from '../types';

const CONFIGURACION_KEY = 'estadisticas_configuracion';

export const useConfiguracionEstadisticas = () => {
  const [configuracion, setConfiguracion] = useState<ConfiguracionEstadisticas>(CONFIGURACION_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración desde SecureStore
  const cargarConfiguracion = async () => {
    try {
      const configGuardada = await SecureStore.getItemAsync(CONFIGURACION_KEY);
      if (configGuardada) {
        const configParsed = JSON.parse(configGuardada);
        setConfiguracion(configParsed);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar configuración en SecureStore
  const guardarConfiguracion = async (nuevaConfig: ConfiguracionEstadisticas) => {
    try {
      await SecureStore.setItemAsync(CONFIGURACION_KEY, JSON.stringify(nuevaConfig));
      setConfiguracion(nuevaConfig);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  // Actualizar una configuración específica
  const actualizarConfiguracion = async (key: keyof ConfiguracionEstadisticas, value: boolean) => {
    const nuevaConfig = { ...configuracion, [key]: value };
    await guardarConfiguracion(nuevaConfig);
  };

  // Restablecer configuración por defecto
  const restablecerConfiguracion = async () => {
    await guardarConfiguracion(CONFIGURACION_DEFAULT);
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  return {
    configuracion,
    isLoading,
    actualizarConfiguracion,
    restablecerConfiguracion,
    guardarConfiguracion,
  };
}; 