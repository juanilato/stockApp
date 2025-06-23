import { useClerk, useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { obtenerEstadisticas, setupProductosDB } from '../../services/db';
import { colors, spacing } from '../../styles/theme';

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
  const [isLoading, setIsLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const router = useRouter();

  const usuario: Usuario = {
    nombre: user?.firstName || 'Usuario',
    rol: 'Administrador',
    ultimoAcceso: 'Hace 5 minutos',
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await setupProductosDB();
        const stats = await obtenerEstadisticas();
        setEstadisticas(stats);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="chart-line" size={48} color="#94a3b8" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header moderno con gradiente */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.saludo}>¡Hola de nuevo!</Text>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
            <Text style={styles.subtitulo}>Bienvenido a tu panel de control</Text>
          </View>
          <Pressable style={styles.avatarContainer} onPress={() => setPopoverVisible(true)}>
            <MaterialCommunityIcons
              name="account-circle"
              size={24}
              color="#ffffff"
            />
          </Pressable>
        </View>
        {/* Popover al lado del avatar */}
        <Modal
          visible={popoverVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPopoverVisible(false)}
        >
          <Pressable style={styles.popoverOverlay} onPress={() => setPopoverVisible(false)} />
          <View style={styles.popoverMenu}>
            <Text style={styles.popoverTitle}>{usuario.nombre}</Text>
            <Pressable style={styles.popoverItem} onPress={async () => { setPopoverVisible(false); await signOut(); router.replace('/login'); }}>
              <MaterialCommunityIcons name="logout" size={18} color="#ef4444" style={{ marginRight: 8 }} />
              <Text style={styles.popoverItemText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </Modal>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen general */}
        <View style={styles.resumenCard}>
          <View style={styles.resumenHeader}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
            <Text style={styles.resumenTitle}>Resumen General</Text>
          </View>
          <View style={styles.resumenStats}>
            <View style={styles.resumenStat}>
              <Text style={styles.resumenValue}>{estadisticas?.ventasTotales || 0}</Text>
              <Text style={styles.resumenLabel}>Ventas Totales</Text>
            </View>
            <View style={styles.resumenStat}>
              <Text style={styles.resumenValue}>${(estadisticas?.gananciaTotal || 0).toLocaleString()}</Text>
              <Text style={styles.resumenLabel}>Ganancia Total</Text>
            </View>
          </View>
        </View>

        {/* Sección de Ventas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Ventas Recientes</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="calendar-today" size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{estadisticas?.ganancias?.dia || 0}</Text>
              <Text style={styles.statLabel}>Hoy</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.success }]}>
                <MaterialCommunityIcons name="calendar-week" size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{estadisticas?.ganancias?.mes || 0}</Text>
              <Text style={styles.statLabel}>Mes</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.info }]}>
                <MaterialCommunityIcons name="calendar-month" size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{estadisticas?.ganancias?.anio || 0}</Text>
              <Text style={styles.statLabel}>Año</Text>
            </View>
          </View>
        </View>

        {/* Sección de Productos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="package-variant" size={20} color={colors.success} />
            <Text style={styles.sectionTitle}>Inventario</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <MaterialCommunityIcons name="package" size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{estadisticas?.stockTotal || 0}</Text>
              <Text style={styles.statLabel}>Stock Total</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.warning }]}>
                <MaterialCommunityIcons name="alert" size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{estadisticas?.productosStockCritico || 0}</Text>
              <Text style={styles.statLabel}>Stock Crítico</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: colors.info }]}>
                <MaterialCommunityIcons name="cube" size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{estadisticas?.productosVendidos || 0}</Text>
              <Text style={styles.statLabel}>Productos Vendidos</Text>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.warning} />
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          </View>
          <View style={styles.quickActions}>
            <View style={styles.quickActionCard}>
              <MaterialCommunityIcons name="plus-circle" size={28} color={colors.primary} />
              <Text style={styles.quickActionText}>Nueva Venta</Text>
            </View>
            <View style={styles.quickActionCard}>
              <MaterialCommunityIcons name="package-variant" size={28} color={colors.success} />
              <Text style={styles.quickActionText}>Productos</Text>
            </View>
            <View style={styles.quickActionCard}>
              <MaterialCommunityIcons name="chart-bar" size={28} color={colors.info} />
              <Text style={styles.quickActionText}>Estadísticas</Text>
            </View>
            <TouchableOpacity style={styles.quickActionCard} onPress={async () => { await signOut(); router.replace('/login'); }}>
              <MaterialCommunityIcons name="logout" size={28} color={colors.danger} />
              <Text style={styles.quickActionText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  saludo: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  nombre: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  avatarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resumenCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resumenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resumenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  resumenStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumenStat: {
    flex: 1,
    alignItems: 'center',
  },
  resumenValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  resumenLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
  popoverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popoverMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  popoverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  popoverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  popoverItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 8,
  },
});
