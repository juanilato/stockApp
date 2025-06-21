import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EstadisticasCard from './EstadisticasCard';

interface AnalisisInventarioProps {
  valorTotal: {
    costo: number;
    venta: number;
    diferencia: number;
  };
  rotacion: {
    promedio: number;
    productos: { nombre: string; diasRotacion: number }[];
  };
}

export default function AnalisisInventario({ 
  valorTotal, 
  rotacion 
}: AnalisisInventarioProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Análisis de Inventario</Text>
      
      <View style={styles.cardsContainer}>
        <EstadisticasCard
          icon="warehouse"
          value={`$${valorTotal.costo.toFixed(2)}`}
          label="Valor en Costo"
          color="#ef4444"
        />
        
        <EstadisticasCard
          icon="tag"
          value={`$${valorTotal.venta.toFixed(2)}`}
          label="Valor en Venta"
          color="#10b981"
        />
        
        <EstadisticasCard
          icon="cash-multiple"
          value={`$${valorTotal.diferencia.toFixed(2)}`}
          label="Potencial Ganancia"
          color="#3b82f6"
        />
        
        <EstadisticasCard
          icon="refresh"
          value={`${rotacion.promedio.toFixed(1)} días`}
          label="Rotación Promedio"
          color="#f59e0b"
        />
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