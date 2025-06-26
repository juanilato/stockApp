import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { obtenerEstadisticas } from '../../services/db';
import { colors } from '../../styles/theme';

interface ModalEstadisticasDestacadasProps {
  visible: boolean;
  onClose: () => void;
}

export default function ModalEstadisticasDestacadas({ visible, onClose }: ModalEstadisticasDestacadasProps) {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      cargarEstadisticas();
    }
  }, [visible]);

  const cargarEstadisticas = async () => {
    try {
      setIsLoading(true);
      const stats = await obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const metricList = [
    {
      title: 'Ventas Totales',
      value: estadisticas?.ventasTotales || 0,
      icon: 'cart-outline',
      color: colors.primary,
    },
    {
      title: 'Ganancia Total',
      value: `$${(estadisticas?.gananciaTotal || 0).toLocaleString()}`,
      icon: 'cash-multiple',
      color: colors.success,
    },
    {
      title: 'Hoy',
      value: `$${(estadisticas?.ganancias?.dia || 0).toLocaleString()}`,
      icon: 'calendar-today',
      color: colors.primary,
    },
    {
      title: 'Este Mes',
      value: `$${(estadisticas?.ganancias?.mes || 0).toLocaleString()}`,
      icon: 'calendar-week',
      color: colors.success,
    },
    {
      title: 'Este Año',
      value: `$${(estadisticas?.ganancias?.anio || 0).toLocaleString()}`,
      icon: 'calendar-month',
      color: colors.info,
    },
    {
      title: 'Stock Total',
      value: estadisticas?.stockTotal || 0,
      icon: 'package-variant',
      color: colors.primary,
    },
    {
      title: 'Stock Crítico',
      value: estadisticas?.productosStockCritico || 0,
      icon: 'alert-circle',
      color: colors.warning,
      subtitle: 'Productos',
    },
    {
      title: 'Productos Vendidos',
      value: estadisticas?.productosVendidos || 0,
      icon: 'cube-outline',
      color: colors.info,
    },
    {
      title: 'Promedio por Venta',
      value: `$${estadisticas?.promedioPorVenta ? estadisticas.promedioPorVenta.toFixed(2) : '0'}`,
      icon: 'chart-line',
      color: colors.success,
    },
    {
      title: 'Productos Únicos',
      value: estadisticas?.productosUnicos || 0,
      icon: 'package-variant-closed',
      color: colors.info,
    },
  ];

  const MetricListItem = ({ title, value, icon, color, subtitle }: any) => (
    <View style={styles.metricListItem}>
      <View style={[styles.metricIconBox, { backgroundColor: `${color}15` }] }>
        <MaterialCommunityIcons name={icon} size={26} color={color} />
      </View>
      <View style={styles.metricTextBox}>
        <Text style={styles.metricTitle}>{title}</Text>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Estadísticas</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContent} contentContainerStyle={styles.listContent}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <MaterialCommunityIcons name="chart-line" size={48} color="#94a3b8" />
                <Text style={styles.loadingText}>Cargando estadísticas...</Text>
              </View>
            ) : (
              metricList.map((item, idx) => (
                <MetricListItem key={item.title + idx} {...item} />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  modalContainer: {
    backgroundColor: '#f4f6fa',
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 400,
    minWidth: 320,
    width: '95%',
    height: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    marginVertical: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 64,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 2,
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  listContent: {
    padding: 18,
    gap: 10,
  },
  metricListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#f1f5f9',
  },
  metricTextBox: {
    flex: 1,
    flexDirection: 'column',
  },
  metricTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
  },
}); 