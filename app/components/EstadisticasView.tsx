import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { obtenerEstadisticas } from '../../services/db';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../styles/theme';

interface Estadisticas {
  ventasTotales: number;
  productosVendidos: number;
  gananciaTotal: number;
  productosMasVendidos: Array<{
    nombre: string;
    cantidad: number;
  }>;
}

export default function EstadisticasView() {
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
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const stats = await obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
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
    <Animated.View style={[commonStyles.container, { opacity: fadeAnim }]}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Estadísticas</Text>
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color={colors.primary} />
            <Text style={styles.statValue}>${estadisticas.ventasTotales}</Text>
            <Text style={styles.statLabel}>Ventas Totales</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="package-variant" size={24} color={colors.success} />
            <Text style={styles.statValue}>{estadisticas.productosVendidos}</Text>
            <Text style={styles.statLabel}>Productos Vendidos</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.info} />
            <Text style={styles.statValue}>${estadisticas.gananciaTotal}</Text>
            <Text style={styles.statLabel}>Ganancia Total</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos Más Vendidos</Text>
          {estadisticas.productosMasVendidos.map((producto, index) => (
            <View key={index} style={styles.productoItem}>
              <View style={styles.productoInfo}>
                <Text style={styles.productoNombre}>{producto.nombre}</Text>
                <Text style={styles.productoCantidad}>{producto.cantidad} unidades</Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
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
    marginBottom: spacing.md,
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