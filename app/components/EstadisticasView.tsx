import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Button, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db, obtenerEstadisticas, obtenerVentasPorMes, setupProductosDB } from '../../services/db';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../styles/theme';

interface Estadisticas {
  ventasTotales: number;
  productosVendidos: number;
  gananciaTotal: number;
  productosMasVendidos: {
    nombre: string;
    cantidad: number;
  }[];
  stockTotal: number;
  productosStockCritico: number;
  gananciaMesActual: number;
  productoMasRentable: {
    nombre: string;
    rentabilidad: number;
  } | null;
  ganancias: {
    dia: number;
    mes: number;
    anio: number;
  };
}


export default function EstadisticasView() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const labelGanancia: { [key in 'dia' | 'mes' | 'anio']: string } = {
  dia: 'DÍA',
  mes: 'MES',
  anio: 'AÑO',
};

  const [tipoGanancia, setTipoGanancia] = useState<'dia' | 'mes' | 'anio'>('mes');
  const [ganancias, setGanancias] = useState({
    dia: 0,
    mes: 0,
    anio: 0,
  });
  const [mostrarStockCritico, setMostrarStockCritico] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const [ventasMensuales, setVentasMensuales] = useState<{ mes: string; total: number }[]>([]);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth, ventasMensuales.length * 60);
  const [productosCriticos, setProductosCriticos] = useState<{ id: number; nombre: string; stock: number }[]>([]);
const cargarProductosCriticos = async () => {
  try {
    const criticos = await db.getAllAsync(`SELECT id, nombre, stock FROM productos WHERE stock <= 5`);
    setProductosCriticos(criticos as { id: number; nombre: string; stock: number }[]);
  } catch (error) {
    console.error("❌ Error al obtener productos críticos:", error);
  }
};

useEffect(() => {
  const inicializar = async () => {
    try {
      await setupProductosDB(); // esperar la conexión
      await cargarEstadisticas(); // cargar después de conectar
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
    } catch (error) {
      console.error("❌ Error en inicialización:", error);
    }
  };
  inicializar();
}, []);


const cargarEstadisticas = async () => {

  try {
    const stats = await obtenerEstadisticas();
    setEstadisticas(stats);
    setGanancias(stats.ganancias);
    const ventas = await obtenerVentasPorMes();
    setVentasMensuales(ventas);
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    setIsLoading(false);
  }
};


if (isLoading || !estadisticas) {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.emptyStateText}>Cargando estadísticas...</Text>
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
  <MaterialCommunityIcons name="warehouse" size={24} color={colors.gray[600]} />
  <Text style={styles.statValue}>{estadisticas.stockTotal}</Text>
  <Text style={styles.statLabel}>Stock Total</Text>
</View>
  <View style={styles.statCard}>
    <MaterialCommunityIcons name="alert-circle-outline" size={24} color={colors.warning} />
<TouchableOpacity onPress={() => { cargarProductosCriticos(); setMostrarStockCritico(true)}}>

    
    <Text style={styles.statValue}>{estadisticas.productosStockCritico}</Text>
    <Text style={styles.statLabel}>Stock Crítico</Text>

</TouchableOpacity>
  </View>
<View style={styles.statCard}>
  <MaterialCommunityIcons name="chart-areaspline" size={24} color={colors.info} />
  <Text style={styles.statValue}>${ganancias[tipoGanancia].toFixed(2)}</Text>
<Text style={styles.statLabel}>Ganancia ({labelGanancia[tipoGanancia]})</Text>
  <View style={styles.switchButtons}>
    {(['dia', 'mes', 'anio'] as ('dia' | 'mes' | 'anio')[]).map((t) => (
     <Text
  key={t}
  style={[
    styles.switchOption,
    tipoGanancia === t && styles.switchSelected
  ]}
  onPress={() => setTipoGanancia(t)}
>
  {labelGanancia[t]}
</Text>
    ))}
  </View>
</View>
{estadisticas.productoMasRentable && (
  <View style={styles.statCard}>
    <MaterialCommunityIcons name="trophy" size={24} color={colors.success} />
    <Text style={styles.statValue}>{estadisticas.productoMasRentable.nombre}</Text>
    <Text style={styles.statLabel}>
      Rentabilidad: ${estadisticas.productoMasRentable.rentabilidad.toFixed(2)}
    </Text>
  </View>
)}
{mostrarStockCritico && (
  <Modal visible transparent animationType="slide">
    <View style={styles.modalContainer}>
      <ScrollView style={styles.modalContent}>
        <Text style={styles.modalTitle}>Productos con Stock Crítico</Text>
        {productosCriticos.map(p => (
          <Text key={p.id} style={styles.modalItem}>{p.nombre} - Stock: {p.stock}</Text>
        ))}
        <Button title="Cerrar" onPress={() => setMostrarStockCritico(false)} />
      </ScrollView>
    </View>
  </Modal>
)}

</View>
<View style={styles.chartContainer}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   <BarChart
  data={{
    labels: ventasMensuales.map((v) => v.mes.slice(5)), // "01", "02"...
    datasets: [{ data: ventasMensuales.map((v) => v.total) }],
  }}
  width={chartWidth} // ancho adaptable
  height={220}
  fromZero
  yAxisLabel="$"
  yAxisSuffix=""
  chartConfig={{
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    labelColor: () => colors.gray[600],
  }}
  style={{
    borderRadius: 16,
    marginVertical: spacing.lg,
    marginHorizontal: spacing.sm,
  }}
/>

  </ScrollView>
</View>
      </ScrollView>

    
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
  width: '100%',
  marginTop: spacing.lg,
  marginBottom: spacing.xl,
},

    modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalItem: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },

 switchButtons: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: spacing.sm,
  marginTop: spacing.sm,
  width: '100%',
},
switchOption: {
  fontSize: typography.sizes.sm,
  color: colors.gray[500],
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderRadius: borderRadius.full,
  borderWidth: 1,
  borderColor: colors.gray[300],
  textAlign: 'center',
  minWidth: 60,
},
switchSelected: {
  backgroundColor: colors.primary,
  color: colors.white,
  borderColor: colors.primary,
  fontWeight: typography.weights.bold,
},

   statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Esto permite múltiples líneas
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%', // Ajustable para que entren dos por fila
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
    textAlign: 'center',
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