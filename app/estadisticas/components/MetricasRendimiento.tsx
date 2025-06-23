import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ConfiguracionEstadisticas } from '../types';
import EstadisticasCard from './EstadisticasCard';

interface MetricasRendimientoProps {
  ticketPromedio: number;
  productosPorVenta: number;
  horariosPico: { hora: number; ventas: number }[];
  diasActivos: { dia: string; ventas: number }[];
  configuracion: ConfiguracionEstadisticas;
}

export default function MetricasRendimiento({ 
  ticketPromedio, 
  productosPorVenta, 
  horariosPico, 
  diasActivos,
  configuracion
}: MetricasRendimientoProps) {
  const horaMasActiva = horariosPico.length > 0 ? horariosPico[0] : null;
  const diaMasActivo = diasActivos.length > 0 ? diasActivos[0] : null;

  // Verificar si hay al menos un elemento configurado para mostrar
  const elementosVisibles = [
    configuracion.mostrarTicketPromedio,
    configuracion.mostrarProductosPorVenta,
    configuracion.mostrarHorariosPico && horaMasActiva,
    configuracion.mostrarDiasActivos && diaMasActivo,
  ].filter(Boolean);

  if (elementosVisibles.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Rendimiento de Ventas</Text>
      
      <View style={styles.cardsContainer}>
        {configuracion.mostrarTicketPromedio && (
          <EstadisticasCard
            icon="cash-multiple"
            value={`$${ticketPromedio.toFixed(2)}`}
            label="Ticket Promedio"
            color="#10b981"
          />
        )}
        
        {configuracion.mostrarProductosPorVenta && (
          <EstadisticasCard
            icon="package-variant"
            value={productosPorVenta.toFixed(1)}
            label="Productos por Venta"
            color="#3b82f6"
          />
        )}
        
        {configuracion.mostrarHorariosPico && horaMasActiva && (
          <EstadisticasCard
            icon="clock-outline"
            value={`${horaMasActiva.hora}:00`}
            label={`${horaMasActiva.ventas} ventas`}
            color="#f59e0b"
          />
        )}
        
        {configuracion.mostrarDiasActivos && diaMasActivo && (
          <EstadisticasCard
            icon="calendar-week"
            value={diaMasActivo.dia}
            label={`${diaMasActivo.ventas} ventas`}
            color="#8b5cf6"
          />
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