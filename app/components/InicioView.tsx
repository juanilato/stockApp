import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing } from '../styles/theme';

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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header elegante */}
<View style={styles.headerContainer}>
  <View style={styles.headerMinimal}>
    <View>
      <Text style={styles.saludoSuave}>Hola de nuevo,</Text>
      <Text style={styles.nombreDiscreto}>Juan Pérez</Text>
    </View>
    <MaterialCommunityIcons
      name="account-circle-outline"
      size={40}
      color="#64748b"
    />
  </View>
</View>



      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: spacing['2xl'] }}>
        {/* Usuario */}
        <View style={styles.cardUsuario}>
          <MaterialCommunityIcons name="account-circle" size={48} color={colors.primary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.usuarioNombre}>{usuario.nombre}</Text>
            <Text style={styles.usuarioRol}>{usuario.rol}</Text>
            <Text style={styles.usuarioAcceso}>Último acceso: {usuario.ultimoAcceso}</Text>
          </View>
        </View>

        {/* Sección de Ventas */}
        <Text style={styles.sectionTitle}>Resumen de Ventas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-today" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{resumenVentas.ventasHoy}</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-week" size={24} color={colors.success} />
            <Text style={styles.statValue}>{resumenVentas.ventasSemana}</Text>
            <Text style={styles.statLabel}>Semana</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-month" size={24} color={colors.info} />
            <Text style={styles.statValue}>{resumenVentas.ventasMes}</Text>
            <Text style={styles.statLabel}>Mes</Text>
          </View>
        </View>

        {/* Sección de Ganancias */}
        <Text style={styles.sectionTitle}>Resumen de Ganancias</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cash" size={24} color={colors.primary} />
            <Text style={styles.statValue}>${resumenVentas.gananciaHoy}</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color={colors.success} />
            <Text style={styles.statValue}>${resumenVentas.gananciaSemana}</Text>
            <Text style={styles.statLabel}>Semana</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.info} />
            <Text style={styles.statValue}>${resumenVentas.gananciaMes}</Text>
            <Text style={styles.statLabel}>Mes</Text>
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
headerContainer: {
  paddingHorizontal: spacing.lg,
  paddingTop: 50,
  paddingBottom: 20,
  backgroundColor: '#f8fafc',
},

headerMinimal: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

saludoSuave: {
  fontSize: 14,
  color: '#94a3b8',
},

nombreDiscreto: {
  fontSize: 20,
  fontWeight: '600',
  color: '#1e293b',
  marginTop: 2,
},

  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  saludo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },

  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  cardUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.lg,
  },

  usuarioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },

  usuarioRol: {
    fontSize: 14,
    color: '#64748b',
  },

  usuarioAcceso: {
    fontSize: 12,
    color: '#94a3b8',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: spacing.lg,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: borderRadius.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    color: '#1e293b',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },



headerGradient: {
  paddingTop: 60,
  paddingBottom: 24,
  paddingHorizontal: spacing.lg,
},

headerContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

nombreGrande: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#ffffff',
},

saludoPunch: {
  fontSize: 14,
  color: '#c7d2fe',
  marginTop: 4,
},

avatarIcon: {
  elevation: 10,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
},

});
