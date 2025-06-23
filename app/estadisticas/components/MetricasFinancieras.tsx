import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ConfiguracionEstadisticas } from '../types';
import EstadisticasCard from './EstadisticasCard';

interface MetricasFinancierasProps {
  margenPromedio: number;
  flujoCaja: {
    entradas: number;
    salidas: number;
    balance: number;
  };
  proyeccion: {
    proximoMes: number;
    proximoTresMeses: number;
    tendencia: string;
  };
  configuracion: ConfiguracionEstadisticas;
}

export default function MetricasFinancieras({ 
  margenPromedio, 
  flujoCaja, 
  proyeccion,
  configuracion
}: MetricasFinancierasProps) {
  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'creciente': return '#10b981';
      case 'decreciente': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'creciente': return 'trending-up';
      case 'decreciente': return 'trending-down';
      default: return 'trending-neutral';
    }
  };

  // Verificar si hay al menos un elemento configurado para mostrar
  const elementosVisibles = [
    configuracion.mostrarMargenPromedio,
    configuracion.mostrarFlujoCaja,
    configuracion.mostrarProyeccion,
  ].filter(Boolean);

  if (elementosVisibles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Métricas Financieras</Text>
      
      <View style={styles.cardsContainer}>
        {configuracion.mostrarMargenPromedio && (
          <EstadisticasCard
            icon="percent"
            value={`${margenPromedio.toFixed(1)}%`}
            label="Margen Promedio"
            color="#3b82f6"
          />
        )}
        
        {configuracion.mostrarFlujoCaja && (
          <>
            <EstadisticasCard
              icon="cash-plus"
              value={`$${flujoCaja.entradas.toFixed(2)}`}
              label="Entradas del Mes"
              color="#10b981"
            />
            
            <EstadisticasCard
              icon="cash-minus"
              value={`$${flujoCaja.salidas.toFixed(2)}`}
              label="Salidas del Mes"
              color="#ef4444"
            />
            
            <EstadisticasCard
              icon="bank"
              value={`$${flujoCaja.balance.toFixed(2)}`}
              label="Balance Neto"
              color={flujoCaja.balance >= 0 ? '#10b981' : '#ef4444'}
            />
          </>
        )}
        
        {configuracion.mostrarProyeccion && (
          <>
            <EstadisticasCard
              icon="chart-line"
              value={`$${proyeccion.proximoMes.toFixed(2)}`}
              label="Proyección Próximo Mes"
              color="#8b5cf6"
            />
            
            <EstadisticasCard
              icon={getTendenciaIcon(proyeccion.tendencia)}
              value={proyeccion.tendencia.toUpperCase()}
              label="Tendencia de Ganancias"
              color={getTendenciaColor(proyeccion.tendencia)}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
}); 