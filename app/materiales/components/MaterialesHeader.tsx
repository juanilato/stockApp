import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MaterialesHeaderProps {
  nombre: string;
  setNombre: (v: string) => void;
  costoDesde: string;
  setCostoDesde: (v: string) => void;
  costoHasta: string;
  setCostoHasta: (v: string) => void;
  stockDesde: string;
  setStockDesde: (v: string) => void;
  stockHasta: string;
  setStockHasta: (v: string) => void;
  onAgregar: () => void;
  onActualizarPrecios: () => void;
  cantidad: number;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const MaterialesHeader: React.FC<MaterialesHeaderProps> = ({
  nombre, setNombre,
  costoDesde, setCostoDesde,
  costoHasta, setCostoHasta,
  stockDesde, setStockDesde,
  stockHasta, setStockHasta,
  onAgregar,
  onActualizarPrecios,
  cantidad,
  isExpanded,
  setExpanded
}) => {
  const reset = () => {
    setNombre("");
    setCostoDesde("");
    setCostoHasta("");
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
          <Text style={styles.headerTitle}>Materiales</Text>
          <Text style={styles.headerSubtitle}>{cantidad} materiales en inventario</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onActualizarPrecios}>
            <MaterialCommunityIcons name="currency-usd" size={22} color="#475569" />
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
              <TextInput style={styles.inputFiltro} placeholder="Desde" value={costoDesde} onChangeText={setCostoDesde} keyboardType="numeric" placeholderTextColor="#64748b" />
              <TextInput style={styles.inputFiltro} placeholder="Hasta" value={costoHasta} onChangeText={setCostoHasta} keyboardType="numeric" placeholderTextColor="#64748b" />
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

export default MaterialesHeader; 