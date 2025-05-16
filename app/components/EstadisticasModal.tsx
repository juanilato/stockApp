import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { obtenerEstadisticas } from '../../services/db';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../styles/theme';

interface EstadisticasModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Estadisticas {
  ventasTotales: number;
  productosVendidos: number;
  gananciaTotal: number;
  productosMasVendidos: Array<{
    nombre: string;
    cantidad: number;
  }>;
}

export default function EstadisticasModal({ visible, onClose }: EstadisticasModalProps) {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    ventasTotales: 0,
    productosVendidos: 0,
    gananciaTotal: 0,
    productosMasVendidos: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      cargarEstadisticas();
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
    }
  }, [visible]);

  const cargarEstadisticas = async () => {
    try {
      obtenerEstadisticas((stats) => {
        setEstadisticas({
          ventasTotales: stats.ventasTotales,
          productosVendidos: stats.productosVendidos,
          gananciaTotal: stats.gananciaNeta,
          productosMasVendidos: [],
        });
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.emptyStateText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          commonStyles.modalContainer,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0]
              })
            }]
          }
        ]}
      >
        <View style={[commonStyles.modalContent, { marginTop: 100 }]}>
          <View style={[commonStyles.modalHeader, { marginBottom: spacing.xl }]}>
            <Text style={[commonStyles.modalTitle, { fontSize: typography.sizes['2xl'] }]}>Estadísticas</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={{ padding: spacing.sm }}
            >
              <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <View style={[styles.statsContainer, { marginBottom: spacing['2xl'] }]}>
            <View style={[styles.statCard, { padding: spacing.xl }]}>
              <MaterialCommunityIcons name="cash-multiple" size={32} color={colors.primary} />
              <Text style={[styles.statValue, { marginTop: spacing.md }]}>${estadisticas.ventasTotales}</Text>
              <Text style={[styles.statLabel, { marginTop: spacing.sm }]}>Ventas Totales</Text>
            </View>

            <View style={[styles.statCard, { padding: spacing.xl }]}>
              <MaterialCommunityIcons name="package-variant" size={32} color={colors.success} />
              <Text style={[styles.statValue, { marginTop: spacing.md }]}>{estadisticas.productosVendidos}</Text>
              <Text style={[styles.statLabel, { marginTop: spacing.sm }]}>Productos Vendidos</Text>
            </View>

            <View style={[styles.statCard, { padding: spacing.xl }]}>
              <MaterialCommunityIcons name="chart-line" size={32} color={colors.info} />
              <Text style={[styles.statValue, { marginTop: spacing.md }]}>${estadisticas.gananciaTotal}</Text>
              <Text style={[styles.statLabel, { marginTop: spacing.sm }]}>Ganancia Total</Text>
            </View>
          </View>

          <View style={[styles.section, { padding: spacing.xl }]}>
            <Text style={[styles.sectionTitle, { marginBottom: spacing.xl }]}>Productos Más Vendidos</Text>
            {estadisticas.productosMasVendidos.map((producto, index) => (
              <View key={index} style={[styles.productoItem, { paddingVertical: spacing.md }]}>
                <View style={styles.productoInfo}>
                  <Text style={[styles.productoNombre, { fontSize: typography.sizes.lg }]}>{producto.nombre}</Text>
                  <Text style={[styles.productoCantidad, { marginTop: spacing.xs }]}>{producto.cantidad} unidades</Text>
                </View>
                <View style={[styles.rankBadge, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  productoCantidad: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  rankBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  rankText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
}); 