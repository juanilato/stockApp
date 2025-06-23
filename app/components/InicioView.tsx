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

export default function InicioView() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [perfilVisible, setPerfilVisible] = useState(false);
  const router = useRouter();

  const usuario: Usuario = {
    nombre: user?.username || 'Usuario',
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.saludo}>¡Hola de nuevo!</Text>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
            <Text style={styles.subtitulo}>Bienvenido a tu panel de control</Text>
          </View>
          <Pressable style={styles.avatarContainer} onPress={() => setPerfilVisible(true)}>
            <MaterialCommunityIcons name="account-circle" size={24} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <Modal visible={perfilVisible} transparent animationType="slide" onRequestClose={() => setPerfilVisible(false)}>
        <Pressable style={styles.popoverOverlay} onPress={() => setPerfilVisible(false)} />
        <View style={styles.modalPerfil}>
          <Text style={styles.modalTitle}>Perfil de Usuario</Text>

          <Text style={styles.modalLabel}>Correo:</Text>
          <Text style={styles.modalValue}>{user?.primaryEmailAddress?.emailAddress || 'Sin correo'}</Text>

          <Text style={styles.modalLabel}>Nombre de usuario:</Text>
          <Text style={styles.modalValue}>{usuario.nombre}</Text>

          <Text style={styles.modalLabel}>Rol:</Text>
          <Text style={styles.modalValue}>{usuario.rol}</Text>

          <Text style={styles.modalLabel}>Último acceso:</Text>
          <Text style={styles.modalValue}>{usuario.ultimoAcceso}</Text>

          <TouchableOpacity style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cambiar contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: '#e5e7eb' }]}
            onPress={async () => {
              await signOut();
              setPerfilVisible(false);
              router.replace('/login');
            }}
          >
            <Text style={[styles.modalButtonText, { color: '#1e293b' }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: spacing['2xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen General */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Resumen General</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{estadisticas?.ventasTotales || 0}</Text>
              <Text style={styles.statLabel}>Ventas Totales</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${(estadisticas?.gananciaTotal || 0).toLocaleString()}</Text>
              <Text style={styles.statLabel}>Ganancia Total</Text>
            </View>
          </View>
        </View>

        {/* Ventas Recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Ventas Recientes</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-today" size={18} color={colors.primary} />
              <Text style={styles.statValue}>{estadisticas?.ganancias?.dia || 0}</Text>
              <Text style={styles.statLabel}>Hoy</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-week" size={18} color={colors.success} />
              <Text style={styles.statValue}>{estadisticas?.ganancias?.mes || 0}</Text>
              <Text style={styles.statLabel}>Mes</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-month" size={18} color={colors.info} />
              <Text style={styles.statValue}>{estadisticas?.ganancias?.anio || 0}</Text>
              <Text style={styles.statLabel}>Año</Text>
            </View>
          </View>
        </View>

        {/* Inventario */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="package-variant" size={20} color={colors.success} />
            <Text style={styles.sectionTitle}>Inventario</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="package" size={18} color={colors.primary} />
              <Text style={styles.statValue}>{estadisticas?.stockTotal || 0}</Text>
              <Text style={styles.statLabel}>Stock Total</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="alert" size={18} color={colors.warning} />
              <Text style={styles.statValue}>{estadisticas?.productosStockCritico || 0}</Text>
              <Text style={styles.statLabel}>Stock Crítico</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cube" size={18} color={colors.info} />
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
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="plus-circle" size={28} color={colors.primary} />
              <Text style={styles.statLabel}>Nueva Venta</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="package-variant" size={28} color={colors.success} />
              <Text style={styles.statLabel}>Productos</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="chart-bar" size={28} color={colors.info} />
              <Text style={styles.statLabel}>Estadísticas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  popoverOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalPerfil: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1e293b',
  },
  modalLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 8,
  },
  modalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
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
});