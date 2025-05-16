import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../styles/theme';

interface Usuario {
  nombre: string;
  rol: string;
  ultimoAcceso: string;
}

interface ResumenVentas {
  ventasHoy: number;
  ventasSemana: number;
  ventasMes: number;
  gananciaHoy: number;
  gananciaSemana: number;
  gananciaMes: number;
}

export default function InicioView() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // Datos de ejemplo
  const usuario: Usuario = {
    nombre: 'Juan Pérez',
    rol: 'Administrador',
    ultimoAcceso: 'Hace 5 minutos',
  };

  const resumenVentas: ResumenVentas = {
    ventasHoy: 15,
    ventasSemana: 87,
    ventasMes: 342,
    gananciaHoy: 1250,
    gananciaSemana: 8750,
    gananciaMes: 34200,
  };

  useEffect(() => {
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

  return (
    <Animated.View style={[commonStyles.container, { opacity: fadeAnim }]}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Inicio</Text>
      </View>

      <ScrollView style={commonStyles.content}>
        {/* Información del usuario */}
        <View style={styles.usuarioCard}>
          <View style={styles.usuarioInfo}>
            <MaterialCommunityIcons name="account-circle" size={48} color={colors.primary} />
            <View style={styles.usuarioDetalles}>
              <Text style={styles.usuarioNombre}>{usuario.nombre}</Text>
              <Text style={styles.usuarioRol}>{usuario.rol}</Text>
              <Text style={styles.usuarioAcceso}>Último acceso: {usuario.ultimoAcceso}</Text>
            </View>
          </View>
        </View>

        {/* Resumen de ventas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Ventas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-today" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{resumenVentas.ventasHoy}</Text>
              <Text style={styles.statLabel}>Ventas Hoy</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-week" size={24} color={colors.success} />
              <Text style={styles.statValue}>{resumenVentas.ventasSemana}</Text>
              <Text style={styles.statLabel}>Ventas Semana</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-month" size={24} color={colors.info} />
              <Text style={styles.statValue}>{resumenVentas.ventasMes}</Text>
              <Text style={styles.statLabel}>Ventas Mes</Text>
            </View>
          </View>
        </View>

        {/* Resumen de ganancias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Ganancias</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cash" size={24} color={colors.primary} />
              <Text style={styles.statValue}>${resumenVentas.gananciaHoy}</Text>
              <Text style={styles.statLabel}>Ganancia Hoy</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cash-multiple" size={24} color={colors.success} />
              <Text style={styles.statValue}>${resumenVentas.gananciaSemana}</Text>
              <Text style={styles.statLabel}>Ganancia Semana</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="chart-line" size={24} color={colors.info} />
              <Text style={styles.statValue}>${resumenVentas.gananciaMes}</Text>
              <Text style={styles.statLabel}>Ganancia Mes</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  usuarioCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  usuarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  usuarioDetalles: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  usuarioRol: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  usuarioAcceso: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.gray[50],
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
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
}); 