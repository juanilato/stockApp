import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ProductosHeaderProps {
  nombre: string;
  setNombre: (v: string) => void;
  precioCostoDesde: string;
  setPrecioCostoDesde: (v: string) => void;
  precioCostoHasta: string;
  setPrecioCostoHasta: (v: string) => void;
  precioVentaDesde: string;
  setPrecioVentaDesde: (v: string) => void;
  precioVentaHasta: string;
  setPrecioVentaHasta: (v: string) => void;
  stockDesde: string;
  setStockDesde: (v: string) => void;
  stockHasta: string;
  setStockHasta: (v: string) => void;
  onAgregar: () => void;
  onScan: () => void;
  onPrice: () => void;
  cantidad: number;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const ProductosHeader: React.FC<ProductosHeaderProps> = ({
  nombre, setNombre,
  precioCostoDesde, setPrecioCostoDesde,
  precioCostoHasta, setPrecioCostoHasta,
  precioVentaDesde, setPrecioVentaDesde,
  precioVentaHasta, setPrecioVentaHasta,
  stockDesde, setStockDesde,
  stockHasta, setStockHasta,
  onAgregar,
  onScan,
  onPrice,
  cantidad,
  isExpanded,
  setExpanded
}) => {
  const reset = () => {
    setNombre("");
    setPrecioCostoDesde("");
    setPrecioCostoHasta("");
    setPrecioVentaDesde("");
    setPrecioVentaHasta("");
    setStockDesde("");
    setStockHasta("");
  }
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!isExpanded);

  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Mis Productos</Text>
          <Text style={styles.headerSubtitle}>{cantidad} productos en inventario</Text>
        </View>
        <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onPrice}>
            <MaterialCommunityIcons name="currency-usd" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onScan}>
            <MaterialCommunityIcons name="barcode-scan" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleExpand}>
            <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "tune-variant"} size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonDestacado]} onPress={onAgregar}>
            <MaterialCommunityIcons name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <TextInput
              style={styles.inputNombre}
              placeholder="Buscar por nombre..."
              placeholderTextColor="#64748b"
              value={nombre}
              onChangeText={setNombre}
            />
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={reset}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="refresh" size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          <View style={styles.rowFiltros}>
            <View style={styles.filtroGroup}>
              <Text style={styles.filtroLabel}>Costo</Text>
              <TextInput style={styles.inputFiltro} placeholder="Desde" value={precioCostoDesde} onChangeText={setPrecioCostoDesde} keyboardType="numeric" placeholderTextColor="#64748b" />
              <TextInput style={styles.inputFiltro} placeholder="Hasta" value={precioCostoHasta} onChangeText={setPrecioCostoHasta} keyboardType="numeric" placeholderTextColor="#64748b" />
            </View>
            <View style={styles.filtroGroup}>
              <Text style={styles.filtroLabel}>Venta</Text>
              <TextInput style={styles.inputFiltro} placeholder="Desde" value={precioVentaDesde} onChangeText={setPrecioVentaDesde} keyboardType="numeric" placeholderTextColor="#64748b" />
              <TextInput style={styles.inputFiltro} placeholder="Hasta" value={precioVentaHasta} onChangeText={setPrecioVentaHasta} keyboardType="numeric" placeholderTextColor="#64748b" />
            </View>
            <View style={styles.filtroGroup}>
              <Text style={styles.filtroLabel}>Stock</Text>
              <TextInput style={styles.inputFiltro} placeholder="Desde" value={stockDesde} onChangeText={setStockDesde} keyboardType="numeric" placeholderTextColor="#64748b" />
              <TextInput style={styles.inputFiltro} placeholder="Hasta" value={stockHasta} onChangeText={setStockHasta} keyboardType="numeric" placeholderTextColor="#64748b" />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
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
    backgroundColor: '#3b82f6',
  },
  filtersContainer: {
    paddingTop: 14,
    position: 'absolute',
    top: 88,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 5,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  inputNombre: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rowFiltros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  filtroGroup: {
    flex: 1,
  },
  filtroLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputFiltro: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 6,
  },
});

export default ProductosHeader; 