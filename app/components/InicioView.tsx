import { useClerk, useSignIn, useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { obtenerEstadisticas, setupProductosDB } from '../../services/db';
import { colors, spacing } from '../../styles/theme';
import ModalApiKeyMercadoPago from '../nueva-venta/components/ModalApiKeyMercadoPago';
import ModalCambiarPassword from './ModalCambiarPassword';
import ModalEditarNombre from './ModalEditarNombre';

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
  const { isLoaded, signIn } = useSignIn();
  const [perfilVisible, setPerfilVisible] = useState(false);
  const [editNombre, setEditNombre] = useState(user?.username || '');
  const [nombreFeedback, setNombreFeedback] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalNombreVisible, setModalNombreVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalApiKeyVisible, setModalApiKeyVisible] = useState(false);

  // Animaciones para el menú
  const menuAnim = React.useRef(new Animated.Value(0)).current;
  const iconRotateAnim = React.useRef(new Animated.Value(0)).current;
  const optionsAnim = React.useRef(new Animated.Value(0)).current;

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

  // Animación del menú
  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 1;
    setMenuVisible(!menuVisible);
    
    Animated.parallel([
      Animated.timing(menuAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(optionsAnim, {
        toValue,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Guardar nombre de usuario
  const handleGuardarNombre = async (nuevoNombre: string) => {
    setNombreFeedback('');
    try {
      await user?.update({ username: nuevoNombre });
      setNombreFeedback('Nombre de usuario actualizado');
      setModalNombreVisible(false);
    } catch (e) {
      setNombreFeedback('Error al actualizar el nombre');
    }
  };

  // Guardar contraseña
  const handleGuardarPassword = async (current: string, nueva: string, repetir: string) => {
    setPasswordFeedback('');
    if (nueva !== repetir) {
      setPasswordFeedback('Las contraseñas no coinciden');
      return;
    }
    try {
      await user?.updatePassword({ newPassword: nueva, currentPassword: current });
      setPasswordFeedback('Contraseña actualizada');
      setModalPasswordVisible(false);
    } catch (e) {
      setPasswordFeedback('Error al actualizar la contraseña');
    }
  };

  // Guardar token de MercadoPago
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
      <View style={styles.headerWrapper}>
        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.saludo}>¡Hola de nuevo!</Text>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
          </View>
          
          {/* Opciones del menú animadas */}
          <Animated.View 
            style={[
              styles.optionsContainer,
              {
                opacity: optionsAnim,
                transform: [{ scale: optionsAnim }],
              }
            ]}
          >
            {menuVisible && (
              <>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => { toggleMenu(); setModalNombreVisible(true); }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="account-edit" size={20} color="#60a5fa" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => { toggleMenu(); setModalPasswordVisible(true); }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="lock-reset" size={20} color="#60a5fa" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.optionButton}
                  onPress={() => { toggleMenu(); setModalApiKeyVisible(true); }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="credit-card-outline" size={20} color="#60a5fa" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.optionButton, { backgroundColor: 'rgba(248, 113, 113, 0.1)', borderColor: 'rgba(248, 113, 113, 0.2)' }]}
                  onPress={async () => {
                    toggleMenu();
                    await signOut();
                    router.replace('/login');
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="logout" size={20} color="#f87171" />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          {/* Botón que se transforma en X */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleMenu}
            activeOpacity={0.8}
          >
            <Animated.View 
              style={{
                transform: [{
                  rotate: iconRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg']
                  })
                }]
              }}
            >
              <MaterialCommunityIcons 
                name={menuVisible ? "close" : "account-circle-outline"} 
                size={24} 
                color="#cbd5e1" 
              />
            </Animated.View>
            {(
              (!user?.username || user.username.trim() === '') ||
              (user && typeof user.passwordEnabled !== 'undefined' && !user.passwordEnabled)
            ) && !menuVisible && (
              <View style={styles.pendingIconWrapper}>
                <MaterialCommunityIcons name="clock-outline" size={15} color="#f59e0b" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modales independientes */}
      <ModalEditarNombre
        visible={modalNombreVisible}
        onClose={() => setModalNombreVisible(false)}
        currentName={user?.username || ''}
        onSave={handleGuardarNombre}
        feedback={nombreFeedback}
      />
      <ModalCambiarPassword
        visible={modalPasswordVisible}
        onClose={() => setModalPasswordVisible(false)}
        onSave={handleGuardarPassword}
        feedback={passwordFeedback}
      />
      <ModalApiKeyMercadoPago
        visible={modalApiKeyVisible}
        onClose={() => setModalApiKeyVisible(false)}
        onSaved={handleGuardarApiKey}
        apikey={user?.unsafeMetadata?.mercadopago_apikey as string | undefined}
      />

      <Modal visible={perfilVisible} transparent animationType="slide" onRequestClose={() => setPerfilVisible(false)}>
        <Pressable style={styles.popoverOverlay} onPress={() => setPerfilVisible(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'position'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalPerfil}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPerfilVisible(false)}>
              <MaterialCommunityIcons name="close" size={26} color="#1e293b" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Perfil de Usuario</Text>

              <Text style={styles.modalLabel}>Correo:</Text>
              <Text style={styles.modalValue}>{user?.primaryEmailAddress?.emailAddress || 'Sin correo'}</Text>

              <Text style={styles.modalLabel}>Nombre de usuario:</Text>
              <TextInput
                style={styles.inputEditable}
                value={editNombre}
                onChangeText={setEditNombre}
                placeholder="Nombre de usuario"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowPasswordFields((v) => !v)}>
                <Text style={styles.modalButtonText}>Cambiar contraseña</Text>
              </TouchableOpacity>

              {showPasswordFields && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.modalLabel}>Contraseña actual:</Text>
                  <TextInput
                    style={styles.inputEditable}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Contraseña actual"
                    secureTextEntry
                  />
                  <Text style={styles.modalLabel}>Nueva contraseña:</Text>
                  <TextInput
                    style={styles.inputEditable}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nueva contraseña"
                    secureTextEntry
                  />
                  <Text style={styles.modalLabel}>Repetir nueva contraseña:</Text>
                  <TextInput
                    style={styles.inputEditable}
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                    placeholder="Repetir nueva contraseña"
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.modalButton} onPress={() => setShowPasswordFields(false)}>
                    <Text style={styles.modalButtonText}>Guardar contraseña</Text>
                  </TouchableOpacity>
                  {!!passwordFeedback && <Text style={styles.feedbackText}>{passwordFeedback}</Text>}
                </View>
              )}

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
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
  headerWrapper: {
    backgroundColor: '#1e293b',
    paddingBottom: 12,
    paddingTop: 16,
    paddingHorizontal: 16,

    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saludo: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  nombre: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 8,
  },
  optionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  actionButton: {
    padding: 8,
    position: 'relative',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  popoverOverlay: {
    flex: 1,
  },
  modalPerfil: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignSelf: 'center',
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 4,
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
  inputEditable: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  feedbackText: {
    color: '#10b981',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 2,
    textAlign: 'center',
  },
  pendingIconWrapper: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#f59e0b',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});