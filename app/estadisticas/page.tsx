import { Stack } from 'expo-router';
import React from 'react';
import EstadisticasView from './main';

export default function Estadisticas() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Estadísticas',
          headerShown: false 
        }} 
      />
      <EstadisticasView />
    </>
  );
}
