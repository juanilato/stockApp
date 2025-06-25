import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomToast from '../../components/CustomToast';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import { setupProductosDB } from '../../services/db';
import MaterialItem from './components/MaterialItem';
import MaterialesHeader from './components/MaterialesHeader';
import ModalMaterial from './components/ModalMaterial';
import ModalPreciosMateriales from './components/ModalPreciosMateriales';
import { useActualizacionPrecios } from './hooks/useActualizacionPrecios';
import { useAnimaciones } from './hooks/useAnimaciones';
import { useMateriales } from './hooks/useMateriales';
import { useModalMaterial } from './hooks/useModalMaterial';


export default function MaterialesView() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalPreciosVisible, setModalPreciosVisible] = useState(false);
  const [materialAEliminar, setMaterialAEliminar] = useState<null | { id: number; nombre: string }>(null);
  
  // Estados para filtros y expansión
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [costoDesde, setCostoDesde] = useState('');
  const [costoHasta, setCostoHasta] = useState('');
  const [stockDesde, setStockDesde] = useState('');
  const [stockHasta, setStockHasta] = useState('');
  const [filtrosExpanded, setFiltrosExpanded] = useState(false);

  const { materiales, cargarMateriales } = useMateriales();
  const { modalVisible, materialSeleccionado, abrirModal, cerrarModal, guardarMaterial, eliminarMaterial } = useModalMaterial(cargarMateriales);
  const { toast, setToast, mostrarToast } = useAnimaciones();
  const { actualizarPreciosMateriales } = useActualizacionPrecios();

  useEffect(() => {
    const inicializar = async () => {
      try {
        await setupProductosDB();
        await cargarMateriales();
      } catch (error) {
        console.error("❌ Error en inicialización:", error);
      } finally {
        setIsLoading(false);
      }
    };
    inicializar();
  }, []);

  const materialesFiltrados = useMemo(() => {
    return materiales.filter(m => {
      const nombreMatch = nombreFiltro === '' || m.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
      const costoDesdeMatch = costoDesde === '' || (m.precioCosto && parseFloat(m.precioCosto.toString()) >= parseFloat(costoDesde));
      const costoHastaMatch = costoHasta === '' || (m.precioCosto && parseFloat(m.precioCosto.toString()) <= parseFloat(costoHasta));
      const stockDesdeMatch = stockDesde === '' || (m.stock && m.stock >= parseInt(stockDesde, 10));
      const stockHastaMatch = stockHasta === '' || (m.stock && m.stock <= parseInt(stockHasta, 10));
      
      return nombreMatch && costoDesdeMatch && costoHastaMatch && stockDesdeMatch && stockHastaMatch;
    });
  }, [materiales, nombreFiltro, costoDesde, costoHasta, stockDesde, stockHasta]);

  const handleGuardarMaterial = async (nombre: string, precioCosto: string, unidad: string, stock: string) => {
    const result = await guardarMaterial(nombre, precioCosto, unidad, stock);
    if (result?.success) {
      mostrarToast(result.message, 'success');
    } else {
      mostrarToast(result?.message || 'Error al guardar', 'error');
    }
    return result;
  };

  const handleEliminarMaterial = (id: number) => {
    const mat = materiales.find((m) => m.id === id);
    if (mat && mat.id !== undefined) {
      setMaterialAEliminar({ id: mat.id, nombre: mat.nombre });
    }
  };

  const confirmarEliminacionMaterial = async () => {
    if (materialAEliminar?.id) {
      const result = await eliminarMaterial(materialAEliminar.id);
      if (result?.success) {
        mostrarToast(result.message, 'success');
      } else if (result?.message !== 'Operación cancelada') {
        mostrarToast(result?.message || 'Error al eliminar', 'error');
      }
      setMaterialAEliminar(null);
    }
  };

  const handleGuardarPrecios = async (materialesActualizados: any[]) => {
    const result = await actualizarPreciosMateriales(materialesActualizados);
    if (result.success) {
      await cargarMateriales();
      mostrarToast(result.message, 'success');
    } else {
      mostrarToast(result.message, 'error');
    }
    setModalPreciosVisible(false);
    return result;
  };
  
  const handleOpenModalPrecios = () => {
    setModalPreciosVisible(true);
    setFiltrosExpanded(false);
  };

  const handleOpenModalMaterial = () => {
    abrirModal();
    setFiltrosExpanded(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="basket" size={48} color="#94a3b8" />
        <Text style={styles.loadingText}>Cargando materiales...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MaterialesHeader
          nombre={nombreFiltro}
          setNombre={setNombreFiltro}
          costoDesde={costoDesde}
          setCostoDesde={setCostoDesde}
          costoHasta={costoHasta}
          setCostoHasta={setCostoHasta}
          stockDesde={stockDesde}
          setStockDesde={setStockDesde}
          stockHasta={stockHasta}
          setStockHasta={setStockHasta}
          onAgregar={handleOpenModalMaterial}
          onActualizarPrecios={handleOpenModalPrecios}
          cantidad={materiales.length}
          isExpanded={filtrosExpanded}
          setExpanded={setFiltrosExpanded}
        />
        
        <Pressable onPress={() => filtrosExpanded && setFiltrosExpanded(false)} style={{ flex: 1 }}>
          <FlatList
            data={materialesFiltrados}
            keyExtractor={(item) => item.id?.toString() || ''}
            renderItem={({ item }) => (
              <MaterialItem
                material={item}
                onEdit={abrirModal}
                onDelete={(mat) => handleEliminarMaterial(mat.id!)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="basket-outline" size={64} color="#94a3b8" />
                <Text style={styles.emptyStateText}>No se encontraron materiales</Text>
                <Text style={styles.emptyStateSubtext}>
                  Intenta ajustar los filtros o agrega un nuevo material.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>

        <ModalMaterial
          visible={modalVisible}
          material={materialSeleccionado}
          onClose={cerrarModal}
          onSubmit={handleGuardarMaterial}
        />

        <ModalPreciosMateriales
          visible={modalPreciosVisible}
          materiales={materiales}
          onClose={() => setModalPreciosVisible(false)}
          onGuardar={handleGuardarPrecios}
        />

        <ModalConfirmacion
          visible={!!materialAEliminar}
          mensaje={`¿Deseas eliminar el material "${materialAEliminar?.nombre}"?`}
          onCancelar={() => setMaterialAEliminar(null)}
          onConfirmar={confirmarEliminacionMaterial}
        />

        {toast && !modalVisible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </View>
    </GestureHandlerRootView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
