import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ConfiguracionEstadisticas } from '../types';

interface ModalConfiguracionProps {
  visible: boolean;
  configuracion: ConfiguracionEstadisticas;
  onClose: () => void;
  onConfiguracionChange: (key: keyof ConfiguracionEstadisticas, value: boolean) => void;
  onRestablecer: () => void;
}

interface SelectorItemProps {
  title: string;
  description: string;
  icon: string;
  value: boolean;
  onToggle: () => void;
}

const SelectorItem: React.FC<SelectorItemProps> = ({ title, description, icon, value, onToggle }) => {
  return (
    <View style={styles.selectorItem}>
      <View style={styles.selectorContent}>
        <View style={styles.selectorIcon}>
          <MaterialCommunityIcons name={icon as any} size={20} color={value ? '#3b82f6' : '#94a3b8'} />
        </View>
        <View style={styles.selectorText}>
          <Text style={[styles.selectorTitle, value && styles.selectorTitleActive]}>{title}</Text>
          <Text style={styles.selectorDescription}>{description}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.toggleButton, value && styles.toggleButtonActive]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.toggleThumb,
            value && styles.toggleThumbActive,
            {
              transform: [
                {
                  translateX: value ? 20 : 2,
                },
              ],
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function ModalConfiguracion({
  visible,
  configuracion,
  onClose,
  onConfiguracionChange,
  onRestablecer,
}: ModalConfiguracionProps) {
  const configuraciones = [
    {
      key: 'mostrarStockTotal' as keyof ConfiguracionEstadisticas,
      title: 'Stock Total',
      description: 'Mostrar cantidad total de productos en inventario',
      icon: 'warehouse',
    },
    {
      key: 'mostrarStockCritico' as keyof ConfiguracionEstadisticas,
      title: 'Stock Crítico',
      description: 'Mostrar productos con stock bajo',
      icon: 'alert-circle-outline',
    },
    {
      key: 'mostrarGanancias' as keyof ConfiguracionEstadisticas,
      title: 'Ganancias',
      description: 'Mostrar ganancias por período',
      icon: 'chart-areaspline',
    },
    {
      key: 'mostrarProductoMasRentable' as keyof ConfiguracionEstadisticas,
      title: 'Producto Más Rentable',
      description: 'Mostrar producto con mayor rentabilidad',
      icon: 'trophy',
    },
    {
      key: 'mostrarMetricasRendimiento' as keyof ConfiguracionEstadisticas,
      title: 'Métricas de Rendimiento',
      description: 'Mostrar ticket promedio y productos por venta',
      icon: 'speedometer',
    },
    {
      key: 'mostrarMetricasFinancieras' as keyof ConfiguracionEstadisticas,
      title: 'Métricas Financieras',
      description: 'Mostrar margen promedio y flujo de caja',
      icon: 'finance',
    },
    {
      key: 'mostrarAnalisisInventario' as keyof ConfiguracionEstadisticas,
      title: 'Análisis de Inventario',
      description: 'Mostrar valor total y rotación',
      icon: 'package-variant',
    },
    {
      key: 'mostrarGraficoVentas' as keyof ConfiguracionEstadisticas,
      title: 'Gráfico de Ventas',
      description: 'Mostrar gráfico de ventas mensuales',
      icon: 'chart-line',
    },
    {
      key: 'mostrarTicketPromedio' as keyof ConfiguracionEstadisticas,
      title: 'Ticket Promedio',
      description: 'Mostrar valor promedio por venta',
      icon: 'receipt',
    },
    {
      key: 'mostrarProductosPorVenta' as keyof ConfiguracionEstadisticas,
      title: 'Productos por Venta',
      description: 'Mostrar cantidad promedio de productos',
      icon: 'package-variant-closed',
    },
    {
      key: 'mostrarHorariosPico' as keyof ConfiguracionEstadisticas,
      title: 'Horarios Pico',
      description: 'Mostrar horarios de mayor actividad',
      icon: 'clock-outline',
    },
    {
      key: 'mostrarDiasActivos' as keyof ConfiguracionEstadisticas,
      title: 'Días Activos',
      description: 'Mostrar días con mayor ventas',
      icon: 'calendar',
    },
    {
      key: 'mostrarMargenPromedio' as keyof ConfiguracionEstadisticas,
      title: 'Margen Promedio',
      description: 'Mostrar margen de ganancia promedio',
      icon: 'percent',
    },
    {
      key: 'mostrarFlujoCaja' as keyof ConfiguracionEstadisticas,
      title: 'Flujo de Caja',
      description: 'Mostrar entradas y salidas',
      icon: 'cash-multiple',
    },
    {
      key: 'mostrarProyeccion' as keyof ConfiguracionEstadisticas,
      title: 'Proyección',
      description: 'Mostrar proyecciones futuras',
      icon: 'trending-up',
    },
    {
      key: 'mostrarValorTotal' as keyof ConfiguracionEstadisticas,
      title: 'Valor Total',
      description: 'Mostrar valor total del inventario',
      icon: 'currency-usd',
    },
    {
      key: 'mostrarRotacion' as keyof ConfiguracionEstadisticas,
      title: 'Rotación',
      description: 'Mostrar rotación de inventario',
      icon: 'rotate-3d-variant',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerSectionLabel}>Configuración</Text>
              <Text style={styles.headerTitle}>Estadísticas</Text>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecciona qué datos mostrar</Text>
            <Text style={styles.sectionDescription}>
              Personaliza las estadísticas que quieres ver en tu dashboard
            </Text>
          </View>

          <View style={styles.selectorsContainer}>
            {configuraciones.map((config) => (
              <SelectorItem
                key={config.key}
                title={config.title}
                description={config.description}
                icon={config.icon}
                value={configuracion[config.key]}
                onToggle={() => onConfiguracionChange(config.key, !configuracion[config.key])}
              />
            ))}
          </View>

          {/* Botón de restablecer */}
          <View style={styles.resetSection}>
            <TouchableOpacity style={styles.resetButton} onPress={onRestablecer}>
              <MaterialCommunityIcons name="refresh" size={20} color="#64748b" />
              <Text style={styles.resetButtonText}>Restablecer configuración</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
  },
  selectorsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectorText: {
    flex: 1,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  selectorTitleActive: {
    color: '#3b82f6',
  },
  selectorDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
  },
  toggleButton: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#3b82f6',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbActive: {
    backgroundColor: '#ffffff',
  },
  resetSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
}); 