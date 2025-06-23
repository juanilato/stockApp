import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setupProductosDB } from '../../services/db';
import AnalisisInventario from './components/AnalisisInventario';
import EstadisticasCard from './components/EstadisticasCard';
import GraficoVentas from './components/GraficoVentas';
import MetricasFinancieras from './components/MetricasFinancieras';
import MetricasRendimiento from './components/MetricasRendimiento';
import ModalConfiguracion from './components/ModalConfiguracion';
import ModalStockCritico from './components/ModalStockCritico';
import SelectorGanancias from './components/SelectorGanancias';
import { useConfiguracionEstadisticas } from './hooks/useConfiguracionEstadisticas';
import { useEstadisticas } from './hooks/useEstadisticas';
import { useGanancias } from './hooks/useGanancias';
import { useMetricasAvanzadas } from './hooks/useMetricasAvanzadas';
import { useProductosCriticos } from './hooks/useProductosCriticos';
import { useVentasMensuales } from './hooks/useVentasMensuales';

export default function EstadisticasView() {
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { estadisticas, cargarEstadisticas } = useEstadisticas();
  const { ganancias, tipoGanancia, setTipoGanancia, actualizarGanancias } = useGanancias();
  const { ventasMensuales, cargarVentasMensuales } = useVentasMensuales();
  const { productosCriticos, mostrarStockCritico, setMostrarStockCritico, cargarProductosCriticos } = useProductosCriticos();
  const { metricasAvanzadas, cargarMetricasAvanzadas } = useMetricasAvanzadas();
  const { configuracion, actualizarConfiguracion, restablecerConfiguracion } = useConfiguracionEstadisticas();

  useEffect(() => {
    const inicializar = async () => {
      try {
        await setupProductosDB();
        const gananciasData = await cargarEstadisticas();
        actualizarGanancias(gananciasData);
        await Promise.all([
          cargarVentasMensuales(),
          cargarMetricasAvanzadas()
        ]);
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error("❌ Error en inicialización:", error);
      } finally {
        setIsLoading(false);
      }
    };
    inicializar();
  }, []);

  if (isLoading || !estadisticas) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="chart-line" size={48} color="#94a3b8" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header moderno */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerSectionLabel}>Análisis</Text>
            <Text style={styles.headerTitle}>Estadísticas</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.configButton}
              onPress={() => setMostrarConfiguracion(true)}
            >
              <MaterialCommunityIcons name="chart-line" size={20} color="#ffffff" />
            </TouchableOpacity>
            
 
          </View>
        </View>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cards de estadísticas básicas */}
        <View style={styles.statsContainer}>
          {configuracion.mostrarStockTotal && (
            <EstadisticasCard
              icon="warehouse"
              value={estadisticas.stockTotal.toString()}
              label="Stock Total"
              color="#3b82f6"
            />
          )}
          
          {configuracion.mostrarStockCritico && (
            <EstadisticasCard
              icon="alert-circle-outline"
              value={estadisticas.productosStockCritico.toString()}
              label="Stock Crítico"
              color="#ef4444"
              onPress={() => {
                cargarProductosCriticos();
                setMostrarStockCritico(true);
              }}
            />
          )}
          
          {configuracion.mostrarGanancias && (
            <EstadisticasCard
              icon="chart-areaspline"
              value={`$${ganancias[tipoGanancia].toFixed(2)}`}
              label={`Ganancia (${tipoGanancia.toUpperCase()})`}
              color="#10b981"
            >
              <SelectorGanancias
                tipoGanancia={tipoGanancia}
                onTipoChange={setTipoGanancia}
              />
            </EstadisticasCard>
          )}
          
          {configuracion.mostrarProductoMasRentable && estadisticas.productoMasRentable && (
            <EstadisticasCard
              icon="trophy"
              value={estadisticas.productoMasRentable.nombre}
              label={`Rentabilidad: $${estadisticas.productoMasRentable.rentabilidad.toFixed(2)}`}
              color="#f59e0b"
            />
          )}
        </View>

        {/* Métricas de rendimiento */}
        {configuracion.mostrarMetricasRendimiento && metricasAvanzadas && (
          <MetricasRendimiento
            ticketPromedio={metricasAvanzadas.rendimientoVentas.ticketPromedio}
            productosPorVenta={metricasAvanzadas.rendimientoVentas.productosPorVenta}
            horariosPico={metricasAvanzadas.rendimientoVentas.horariosPico}
            diasActivos={metricasAvanzadas.rendimientoVentas.diasActivos}
            configuracion={configuracion}
          />
        )}

        {/* Métricas financieras */}
        {configuracion.mostrarMetricasFinancieras && metricasAvanzadas && (
          <MetricasFinancieras
            margenPromedio={metricasAvanzadas.metricasFinancieras.margenPromedio}
            flujoCaja={metricasAvanzadas.metricasFinancieras.flujoCaja}
            proyeccion={metricasAvanzadas.metricasFinancieras.proyeccion}
            configuracion={configuracion}
          />
        )}

        {/* Análisis de inventario */}
        {configuracion.mostrarAnalisisInventario && metricasAvanzadas && (
          <AnalisisInventario
            valorTotal={metricasAvanzadas.analisisInventario.valorTotal}
            rotacion={metricasAvanzadas.analisisInventario.rotacion}
            configuracion={configuracion}
          />
        )}

        {/* Gráfico de ventas */}
        {configuracion.mostrarGraficoVentas && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Ventas Mensuales</Text>
            <GraficoVentas data={ventasMensuales} />
          </View>
        )}
      </ScrollView>

      {/* Modal de stock crítico */}
      <ModalStockCritico
        visible={mostrarStockCritico}
        productos={productosCriticos}
        onClose={() => setMostrarStockCritico(false)}
      />

      {/* Modal de configuración */}
      <ModalConfiguracion
        visible={mostrarConfiguracion}
        configuracion={configuracion}
        onClose={() => setMostrarConfiguracion(false)}
        onConfiguracionChange={actualizarConfiguracion}
        onRestablecer={restablecerConfiguracion}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerSectionLabel: {
    fontSize: 14,
    color: '#94a3b8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  configButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  chartSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
}); 