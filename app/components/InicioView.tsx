import { useClerk, useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Material, actualizarMaterial, obtenerEstadisticas, obtenerMateriales, setupProductosDB } from '../../services/db';
import { useNavigation } from '../context/NavigationContext';
import ModalPreciosMateriales from '../materiales/components/ModalPreciosMateriales';
import ModalApiKeyMercadoPago from '../nueva-venta/components/ModalApiKeyMercadoPago';
import MetricasHoy from './MetricasHoy';
import ModalCambiarPassword from './ModalCambiarPassword';
import ModalEditarNombre from './ModalEditarNombre';
import ModalEstadisticasDestacadas from './ModalEstadisticasDestacadas';
import ModalGestionProductos from './ModalGestionProductos';

interface Usuario {
  nombre: string;
  rol: string;
  ultimoAcceso: string;
}

export default function InicioView() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [modalNombreVisible, setModalNombreVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalApiKeyVisible, setModalApiKeyVisible] = useState(false);
  const [modalProductosVisible, setModalProductosVisible] = useState(false);
  const [modalEstadisticasVisible, setModalEstadisticasVisible] = useState(false);
  const [modalMaterialesVisible, setModalMaterialesVisible] = useState(false);
  const [materiales, setMateriales] = useState<Material[]>([]);
  
  const { navigateToTab, setShouldOpenScanner } = useNavigation();

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
        obtenerMateriales(setMateriales);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGuardarNombre = async (nuevoNombre: string) => {
    try {
      await user?.update({ username: nuevoNombre });
      setModalNombreVisible(false);
    } catch (e) {
      console.error('Error al actualizar el nombre', e);
    }
  };

  const handleGuardarPassword = async (current: string, nueva: string) => {
    try {
      await user?.updatePassword({ newPassword: nueva, currentPassword: current });
      setModalPasswordVisible(false);
    } catch (e) {
        console.error('Error al actualizar contraseña', e);
    }
  };

  const handleGuardarApiKey = async (apikey: string) => {
    if (!user) return;
    try {
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, mercadopago_apikey: apikey } });
      await user.reload();
      setModalApiKeyVisible(false);
    } catch (e) {
      throw new Error('No se pudo guardar el Access Token. Intenta de nuevo.');
    }
  };

  const handleGuardarPrecios = async (materialesActualizados: Material[]): Promise<{ success: boolean; message: string }> => {
    try {
      for (const material of materialesActualizados) {
        await actualizarMaterial(material);
      }
      obtenerMateriales(setMateriales);
      return { success: true, message: 'Precios actualizados con éxito' };
    } catch (e) {
      console.error("Error al guardar precios:", e);
      return { success: false, message: 'Hubo un error al guardar los precios' };
    }
  };

  const handleNuevaVenta = () => {
    navigateToTab('ventas');
    setShouldOpenScanner(true);
  };

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
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View>
          <Text style={styles.saludo}>¡Hola de nuevo!</Text>
          <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalNombreVisible(true)}>
            <MaterialCommunityIcons name="account-edit" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalPasswordVisible(true)}>
            <MaterialCommunityIcons name="lock-reset" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalApiKeyVisible(true)}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonDestacado]} 
            onPress={async () => {
              await signOut();
              router.replace('/login');
            }}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {estadisticas && (
          <MetricasHoy 
            gananciaHoy={estadisticas.gananciaHoy || 0} 
            ventasHoy={estadisticas.ventasHoy || 0} 
          />
        )}

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.accionesGrid}>
            <TouchableOpacity style={styles.accionCard} onPress={handleNuevaVenta}>
              <MaterialCommunityIcons name="plus-circle-outline" size={28} color="#3b82f6" />
              <Text style={styles.accionLabel}>Nueva Venta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accionCard} onPress={() => setModalEstadisticasVisible(true)}>
              <MaterialCommunityIcons name="chart-bar" size={28} color="#8b5cf6" />
              <Text style={styles.accionLabel}>Estadísticas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accionCard} onPress={() => setModalProductosVisible(true)}>
              <MaterialCommunityIcons name="package-variant-closed" size={28} color="#10b981" />
              <Text style={styles.accionLabel}>Productos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accionCard} onPress={() => setModalMaterialesVisible(true)}>
              <MaterialCommunityIcons name="basket-outline" size={28} color="#f59e0b" />
              <Text style={styles.accionLabel}>Materiales</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Últimos Movimientos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
          <View style={styles.emptyMovimientos}>
            <Text style={styles.emptyMovimientosText}>Aún no hay movimientos recientes.</Text>
          </View>
        </View>
      </ScrollView>

      <ModalEditarNombre
        visible={modalNombreVisible}
        onClose={() => setModalNombreVisible(false)}
        onSave={handleGuardarNombre}
        initialName={user?.username || ''}
      />
      <ModalCambiarPassword
        visible={modalPasswordVisible}
        onClose={() => setModalPasswordVisible(false)}
        onSave={handleGuardarPassword}
      />
       <ModalApiKeyMercadoPago
        visible={modalApiKeyVisible}
        onClose={() => setModalApiKeyVisible(false)}
        onSaved={handleGuardarApiKey}
        currentApiKey={user?.unsafeMetadata?.mercadopago_apikey as string || ''}
      />
      <ModalEstadisticasDestacadas
        visible={modalEstadisticasVisible}
        onClose={() => setModalEstadisticasVisible(false)}
      />
      <ModalGestionProductos
        visible={modalProductosVisible}
        onClose={() => setModalProductosVisible(false)}
      />
      <ModalPreciosMateriales
        visible={modalMaterialesVisible}
        onClose={() => setModalMaterialesVisible(false)}
        materiales={materiales}
        onGuardar={handleGuardarPrecios}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  saludo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  nombreUsuario: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 99,
    padding: 4,
  },
  actionButton: {
    padding: 8,
    borderRadius: 99,
  },
  actionButtonDestacado: {
    backgroundColor: '#ef4444',
  },
  mainContent: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  accionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  accionLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  movimientosContainer: {},
  emptyMovimientos: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyMovimientosText: {
    fontSize: 14,
    color: '#64748b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
});