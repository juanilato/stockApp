import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import QRCode from 'react-native-qrcode-svg';
import { ComponenteProducto, Material, Producto, VarianteProducto, actualizarProducto, actualizarVariante, db, eliminarComponenteProducto, eliminarProducto, insertarComponenteProducto, insertarProducto, insertarVariante, obtenerComponentesProducto, obtenerMateriales, obtenerProductos, setupProductosDB } from '../../services/db';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../styles/theme';
  interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric';
  }

  function InputField({ label, value, onChangeText, keyboardType = 'default' }: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = new Animated.Value(value ? 1 : 0);

    useEffect(() => {
      Animated.timing(animatedLabel, {
        toValue: (isFocused || value) ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, [isFocused, value]);

    const labelStyle = {
      position: 'absolute' as const,
      left: 0,
      top: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: [15, -8],
      }),
      fontSize: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 13],
      }),
      color: animatedLabel.interpolate({
        inputRange: [0, 1],
        outputRange: ['#94a3b8', '#2563eb'],
      }),
      backgroundColor: 'transparent',
      zIndex: 1,
    };
    return (
      <View style={styles.container}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={[
            styles.input,
            { color: '#1e293b' }
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          placeholder=""
        />
      </View>
    );
  }

  interface ComponentesModalProps {
    visible: boolean;
    onClose: () => void;
    productoId: number;
    productos: Producto[];
  }

  function ComponentesModal({ visible, onClose, productoId, productos }: ComponentesModalProps) {
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [componentes, setComponentes] = useState<ComponenteProducto[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
    const [cantidad, setCantidad] = useState('');

    useEffect(() => {
      if (visible) {
        cargarMateriales();
        cargarComponentes();
      }
    }, [visible]);

    const cargarMateriales = async () => {
      try {
        await obtenerMateriales((materiales: Material[]) => {
          setMateriales(materiales);
        });
      } catch (error) {
        console.error('Error al cargar materiales:', error);
        Alert.alert('Error', 'No se pudieron cargar los materiales');
      }
    };

    const cargarComponentes = async () => {
      try {
        await obtenerComponentesProducto(productoId, (componentes: ComponenteProducto[]) => {
          setComponentes(componentes);
        });
      } catch (error) {
        console.error('Error al cargar componentes:', error);
        Alert.alert('Error', 'No se pudieron cargar los componentes');
      }
    };

    const handleAddComponent = async () => {
      if (!selectedMaterial || !cantidad) {
        Alert.alert('Error', 'Por favor seleccione un material y especifique la cantidad');
        return;
      }

      const cantidadNum = parseFloat(cantidad.replace(',', '.'));
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        Alert.alert('Error', 'La cantidad debe ser un número mayor a 0');
        return;
      }

      const producto = productos.find(p => p.id === productoId);
      if (!producto) {
        Alert.alert('Error', 'No se encontró el producto');
        return;
      }

      const material = materiales.find(m => m.id === selectedMaterial);
      if (!material) {
        Alert.alert('Error', 'No se encontró el material');
        return;
      }

      let costoTotal = 0;
      componentes.forEach(componente => {
        const mat = materiales.find(m => m.id === componente.materialId);
        if (mat) {
          costoTotal += mat.precioCosto * componente.cantidad;
        }
      });

      const nuevoCosto = costoTotal + (material.precioCosto * cantidadNum);

      if (nuevoCosto >= producto.precioVenta) {
        Alert.alert('Error', 'El costo total no puede ser mayor o igual al precio de venta');
        return;
      }

      const componente: ComponenteProducto = {
        productoId,
        materialId: selectedMaterial,
        cantidad: cantidadNum,
      };

      try {
        await insertarComponenteProducto(componente);
        setSelectedMaterial(null);
        setCantidad('');
        cargarComponentes();
      } catch (error) {
        console.error('Error al agregar componente:', error);
        Alert.alert('Error', 'No se pudo agregar el componente');
      }
    };

    const getMaterialName = (materialId: number) => {
      const material = materiales.find(m => m.id === materialId);
      return material ? material.nombre : 'Material no encontrado';
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Componentes del Producto</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.componentesList}>
                  <Text style={styles.sectionTitle}>Componentes Actuales</Text>
                  {componentes.map((componente) => (
                    <View key={componente.id} style={styles.componenteItem}>
                      <Text style={styles.componenteNombre}>
                        {getMaterialName(componente.materialId)}
                      </Text>
                      <Text style={styles.componenteCantidad}>
                        Cantidad: {componente.cantidad}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.addComponentContainer}>
                  <Text style={styles.sectionTitle}>Agregar Nuevo Componente</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Seleccionar Material</Text>
                    <View style={styles.materialSelector}>
                      {materiales.map((material) => (
                        <TouchableOpacity
                          key={material.id}
                          style={[
                            styles.materialOption,
                            selectedMaterial === material.id && styles.materialOptionSelected,
                          ]}
                          onPress={() => setSelectedMaterial(material.id || null)}
                        >
                          <Text style={[
                            styles.materialOptionText,
                            selectedMaterial === material.id && styles.materialOptionTextSelected,
                          ]}>
                            {material.nombre}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Cantidad</Text>
                    <TextInput
                      style={styles.input}
                      value={cantidad}
                      onChangeText={setCantidad}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.gray[400]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={onClose}
                >
                  <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleAddComponent}
                >
                  <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Agregar Componente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  interface ProductoSeleccionado extends Producto {
    varianteSeleccionada?: VarianteProducto;
  }

  export default function ProductosView() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [componentesModalVisible, setComponentesModalVisible] = useState(false);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [qrData, setQrData] = useState('');
    const [qrDataVariante, setQrDataVariante] = useState('');
    const [qrProducto, setQrProducto] = useState<Producto | null>(null);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
    const [nombre, setNombre] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [precioCosto, setPrecioCosto] = useState('');
    const [stock, setStock] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const qrRef = useRef<any>(null);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const [variantesModalVisible, setVariantesModalVisible] = useState(false);
    const [varianteNombre, setVarianteNombre] = useState('');
    const [varianteStock, setVarianteStock] = useState('');
    const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | null>(null);
    const [modalComponentesVisible, setModalComponentesVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [componentes, setComponentes] = useState<ComponenteProducto[]>([]);
    const [materialSeleccionado, setMaterialSeleccionado] = useState<Material | null>(null);
    const [cantidadComponente, setCantidadComponente] = useState('');
    const [menuProducto, setMenuProducto] = useState<Producto | null>(null);
    const [showSaveAnimation, setShowSaveAnimation] = useState(false);
    const [cartScale] = useState(new Animated.Value(0));
    const [cartOpacity] = useState(new Animated.Value(0));

    const [showEditAnimation, setShowEditAnimation] = useState(false);
    const [editScale] = useState(new Animated.Value(0));
    const [editOpacity] = useState(new Animated.Value(0));

    const [showDeleteAnimation, setShowDeleteAnimation] = useState(false);
    const [deleteScale] = useState(new Animated.Value(0));
    const [deleteOpacity] = useState(new Animated.Value(0));

    const animateGuardarProductoNuevo = () => {
      setShowSaveAnimation(true);
      Animated.sequence([
        Animated.timing(cartOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cartScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(cartOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSaveAnimation(false);
        cartScale.setValue(0);
      });
    };
    const animateEdicionProducto = () => {
      setShowEditAnimation(true);
      Animated.sequence([
        Animated.timing(editOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(editScale, {
          toValue: 1,
          speed: 12,
          bounciness: 12,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(editOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowEditAnimation(false);
        editScale.setValue(0);
      });
    };
    const animateEliminarProducto = () => {
      setShowDeleteAnimation(true);
      Animated.sequence([
        Animated.timing(deleteOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(deleteScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(deleteScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
        Animated.timing(deleteOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowDeleteAnimation(false);
        deleteScale.setValue(0);
      });
    };
        
    
    useEffect(() => {
      inicializarDB();
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

    const inicializarDB = async () => {
      try {
        await setupProductosDB();
        await cargarProductos();
        await cargarMateriales();
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        Alert.alert('Error', 'No se pudo inicializar la base de datos');
      } finally {
        setIsLoading(false);
      }
    };

    const cargarProductos = async () => {
      try {
        await obtenerProductos((productos: Producto[]) => {
          setProductos(productos);
        });
      } catch (error) {
        console.error('Error al cargar productos:', error);
        Alert.alert('Error', 'No se pudieron cargar los productos');
      }
    };

    const cargarMateriales = async () => {
      try {
        await obtenerMateriales((materiales: Material[]) => {
          setMateriales(materiales);
        });
      } catch (error) {
        console.error('Error al cargar materiales:', error);
        Alert.alert('Error', 'No se pudieron cargar los materiales');
      }
    };

    const limpiarFormulario = () => {
      setNombre('');
      setPrecioVenta('');
      setPrecioCosto('');
      setStock('');
      setEditingProduct(null);
    };

    const abrirModal = (producto?: Producto) => {
      if (producto) {
        setEditingProduct(producto);
        setNombre(producto.nombre);
        setPrecioVenta(producto.precioVenta.toString());
        setPrecioCosto(producto.precioCosto.toString());
        setStock(producto.stock.toString());
      } else {
        limpiarFormulario();
      }
      setModalVisible(true);
    };

    const abrirComponentesModal = async (producto: Producto) => {
      setProductoSeleccionado(producto);
      setModalComponentesVisible(true);
      await cargarMateriales();
      await cargarComponentes(producto.id!);
    };

    const cargarComponentes = async (productoId: number) => {
      try {
        await obtenerComponentesProducto(productoId, (componentes) => {
          setComponentes(componentes);
        });
      } catch (error) {
        console.error('Error al cargar componentes:', error);
        Alert.alert('Error', 'No se pudieron cargar los componentes');
      }
    };
    const recalcularPrecioCostoProducto = async (productoId: number) => {
      try {
        const componentes = await db.getAllAsync(
          `SELECT cp.cantidad, m.precioCosto 
           FROM componentes_producto cp
           JOIN materiales m ON cp.materialId = m.id
           WHERE cp.productoId = ?`,
          [productoId]
        );
    
        const nuevoCostoTotal = componentes.reduce((total: number, comp: any) => {
          return total + (comp.cantidad * comp.precioCosto);
        }, 0);
    
        await db.runAsync(
          'UPDATE productos SET precioCosto = ? WHERE id = ?',
          [nuevoCostoTotal, productoId]
        );
    
        return nuevoCostoTotal;
      } catch (error) {
        console.error('❌ Error al recalcular precio de costo:', error);
        throw error;
      }
    };
    const obtenerCostoActual = async (productoId: number): Promise<number> => {
      const row = await db.getFirstAsync('SELECT precioCosto FROM productos WHERE id = ?', [productoId]);
      return row?.precioCosto || 0;
    };
    const agregarComponente = async () => {
      if (!productoSeleccionado || !materialSeleccionado || !cantidadComponente) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }
    
      const cantidad = parseFloat(cantidadComponente.replace(',', '.'));
      if (isNaN(cantidad) || cantidad <= 0) {
        Alert.alert('Error', 'La cantidad debe ser mayor a 0');
        return;
      }
      if (productoSeleccionado?.id == null) {
        Alert.alert('Error', 'El producto seleccionado no tiene ID');
        return;
      }

      const costoActual = await obtenerCostoActual(productoSeleccionado.id);
      const nuevoCostoTotal = costoActual + materialSeleccionado.precioCosto * cantidad;
    
      if (nuevoCostoTotal >= productoSeleccionado.precioVenta) {
        Alert.alert('Error', 'El costo total no puede ser mayor o igual al precio de venta');
        return;
      }
    
      try {


        if (nuevoCostoTotal >= productoSeleccionado.precioVenta) {
          Alert.alert('Error', 'El costo total no puede ser mayor o igual al precio de venta');
          return;
        }
        
        await insertarComponenteProducto({
          productoId: productoSeleccionado.id!,
          materialId: materialSeleccionado.id!,
          cantidad,
        });
        
 
        
        await db.runAsync(
          'UPDATE productos SET precioCosto = ? WHERE id = ?',
          [nuevoCostoTotal, productoSeleccionado.id]
        );

    
        await cargarComponentes(productoSeleccionado.id!);
        await cargarProductos();
    
        setMaterialSeleccionado(null);
        setCantidadComponente('');
        Alert.alert('Éxito', 'Componente agregado correctamente');
      } catch (error) {
        console.error('Error al agregar componente:', error);
        Alert.alert('Error', 'No se pudo agregar el componente');
      }
    };
    
    const eliminarComponente = async (componenteId: number) => {
      try {
        if (!productoSeleccionado?.id) {
          Alert.alert('Error', 'El producto seleccionado no tiene ID');
          return;
        }
    
        // Obtener costo actual desde DB
        const costoActual = await obtenerCostoActual(productoSeleccionado.id);
    
        // Buscar el componente y su material en los estados
        const componenteAEliminar = componentes.find(c => c.id === componenteId);
        if (!componenteAEliminar) {
          Alert.alert('Error', 'No se encontró el componente');
          return;
        }
    
        const material = materiales.find(m => m.id === componenteAEliminar.materialId);
        if (!material) {
          Alert.alert('Error', 'No se encontró el material asociado al componente');
          return;
        }
    
        // Calcular el costo a eliminar
        const costoAEliminar = material.precioCosto * componenteAEliminar.cantidad;
        const nuevoCostoTotal = Math.max(costoActual - costoAEliminar, 0); // Evita valores negativos
    
        // Eliminar el componente
        await eliminarComponenteProducto(componenteId);
    
        // Actualizar el precioCosto del producto en la base de datos
        await db.runAsync(
          'UPDATE productos SET precioCosto = ? WHERE id = ?',
          [nuevoCostoTotal, productoSeleccionado.id]
        );
    
        // Recargar estado
        await cargarComponentes(productoSeleccionado.id);
        await cargarProductos();
    
        Alert.alert('Éxito', 'Componente eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar componente:', error);
        Alert.alert('Error', 'No se pudo eliminar el componente');
      }
    };
    
    

    const renderComponente = ({ item }: { item: ComponenteProducto }) => {
      const material = materiales.find(m => m.id === item.materialId);
      if (!material) return null;

      const costoTotal = material.precioCosto * item.cantidad;

      return (
        <View style={styles.componenteItem}>
          <View style={styles.componenteInfo}>
            <Text style={styles.componenteNombre}>{material.nombre}</Text>
            <Text style={styles.componenteDetalles}>
              {item.cantidad} {material.unidad} - ${costoTotal.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.componenteDeleteButton}
            onPress={() => eliminarComponente(item.id!)}
          >
            <MaterialCommunityIcons name="delete" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      );
    };

    const handleSubmit = async () => {
      if (!nombre || !precioVenta || !precioCosto || !stock) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }

      const precioVentaNum = parseFloat(precioVenta);
      const precioCostoNum = parseFloat(precioCosto);

      // Calcular el costo mínimo basado en los componentes
      let costoMinimo = 0;
      if (editingProduct?.id) {
        const componentes = await obtenerComponentesProducto(editingProduct.id, (componentes) => {
          componentes.forEach(componente => {
            const material = materiales.find(m => m.id === componente.materialId);
            if (material) {
              costoMinimo += material.precioCosto * componente.cantidad;
            }
          });
        });
      }

      if (precioCostoNum < costoMinimo) {
        Alert.alert('Error', `El precio de costo no puede ser menor al costo mínimo de los componentes (${costoMinimo.toFixed(2)})`);
        return;
      }

      if (precioCostoNum >= precioVentaNum) {
        Alert.alert('Error', 'El precio de costo no puede ser mayor o igual al precio de venta');
        return;
      }

      try {
        const productoData: Producto = {
          id: editingProduct?.id,
          nombre,
          precioCosto: precioCostoNum,
          precioVenta: precioVentaNum,
          stock: parseInt(stock),
        };

        if (editingProduct?.id) {
          await actualizarProducto(productoData);
          animateEdicionProducto();
        } else {
          await insertarProducto(productoData);
          animateGuardarProductoNuevo();
        }

        setModalVisible(false);
        cargarProductos();
      } catch (error) {
        console.error('Error al guardar producto:', error);
        Alert.alert('Error', 'No se pudo guardar el producto');
      }
    };

    const handleDelete = async (id: number) => {
      Alert.alert(
        'Confirmar eliminación',
        '¿Está seguro de que desea eliminar este producto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                await eliminarProducto(id);
                cargarProductos();
                animateEliminarProducto();
              } catch (error) {
                console.error('Error al eliminar producto:', error);
                Alert.alert('Error', 'No se pudo eliminar el producto');
              }
            },
          },
        ]
      );
    };

    const abrirModalVariantes = (producto: Producto) => {
      setEditingProduct(producto);
      setVariantesModalVisible(true);
    };

    const cerrarModalVariantes = () => {
      setVariantesModalVisible(false);
      setVarianteNombre('');
      setVarianteStock('');
      setVarianteSeleccionada(null);
    };

    const guardarVariante = async () => {
      if (!editingProduct || !varianteNombre || !varianteStock) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      const variante: VarianteProducto = {
        productoId: editingProduct.id!,
        nombre: varianteNombre,
        stock: parseInt(varianteStock)
      };

      try {
        if (varianteSeleccionada) {
          await actualizarVariante({ ...variante, id: varianteSeleccionada.id });
        } else {
          await insertarVariante(variante);
        }
        await cargarProductos();
        cerrarModalVariantes();
      } catch (error) {
        console.error('Error al guardar la variante:', error);
        Alert.alert('Error', 'No se pudo guardar la variante');
      }
    };

    const eliminarVariante = async (id: number) => {
      try {
        await eliminarVariante(id);
        await cargarProductos();
        Alert.alert('Éxito', 'Variante eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar la variante:', error);
        Alert.alert('Error', 'No se pudo eliminar la variante');
      }
    };

    const editarVariante = (variante: VarianteProducto) => {
      setVarianteSeleccionada(variante);
      setVarianteNombre(variante.nombre);
      setVarianteStock(variante.stock.toString());
    };

    const renderVariante = ({ item }: { item: VarianteProducto }) => (
      <View style={styles.varianteItem}>
        <View style={styles.varianteInfo}>
          <Text style={styles.varianteNombre}>{item.nombre}</Text>
          <Text style={styles.varianteStock}>Stock: {item.stock}</Text>
        </View>
      
        <View style={styles.varianteActions}>

          <TouchableOpacity
            style={styles.varianteButton}
            onPress={() => editarVariante(item)}
          >
            <MaterialCommunityIcons name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.varianteButton}
            onPress={() => eliminarVariante(item.id!)}
          >
            <MaterialCommunityIcons name="delete" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );

    const mostrarMenuOpciones = (item: Producto) => {

      setMenuProducto(item);


    };



    const renderProducto = ({ item }: { item: Producto }) => {
      
      const renderRightActions = () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => mostrarMenuOpciones(item)}
          >
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10b981' }]}
            onPress={() => abrirModal(item)}
          >
            <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
            onPress={() => handleDelete(item.id!)}
          >
            <MaterialCommunityIcons name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      );
      
      return (
        <Swipeable
        key={item.id}
        renderRightActions={renderRightActions}
        overshootRight={false} 
      >
        
<View style={styles.productoItem}>
  <View style={styles.productoInfo}>
    <Text style={styles.productoNombre}>{item.nombre}</Text>
    <View style={styles.productoDetails}>
      <Text style={styles.productoPrecio}> Venta: ${item.precioVenta}</Text>
      <Text style={styles.productoPrecioCosto}> Costo: ${item.precioCosto}</Text>
      <Text style={styles.productoStock}> Stock: {item.stock}</Text>
    </View>
  </View>
</View>
      </Swipeable>
      );
    };
    const generarQR = async (producto: Producto) => {
      if (!producto) {
        console.error('Error: Producto es null');
        Alert.alert('Error', 'No se encontró el producto para generar el código QR');
        return;
      }
    
      try {

        const qrData = {
          id: producto.id,
          nombre: producto.nombre,
          precioVenta: producto.precioVenta,

        };
        console.log('qrData', qrData);  
        setQrData(JSON.stringify(qrData));
        setQrProducto(producto);
        setQrModalVisible(true);
      } catch (error) {
        console.error('Error al generar QR:', error);
        Alert.alert('Error', 'No se pudo generar el código QR');
      }
    };
    const generarQRVariante = async (producto: Producto, variante?: VarianteProducto) => {
      if (!producto || !variante) {
        console.error('Error: Producto o variante es null');
        Alert.alert('Error', 'No se encontró el producto o la variante para generar el código QR');
        return;
      }
    
      try {
        const qrPayload = {
          productoId: producto.id,
          nombre: producto.nombre,
          precioVenta: producto.precioVenta,
          varianteId: variante.id,
          varianteNombre: variante.nombre,
        };
    
        console.log('qrData', qrPayload);
        setQrData(JSON.stringify(qrPayload));
        setQrProducto(producto);
        setQrModalVisible(true);
      } catch (error) {
        console.error('Error al generar QR:', error);
        Alert.alert('Error', 'No se pudo generar el código QR');
      }
    };
    


    const compartirQR = async () => {
      try {
        if (!qrRef.current || !qrProducto) return;

        const path = `${FileSystem.cacheDirectory}qr-${qrProducto.id}.png`;
        
        // @ts-ignore - QRCode ref type issue
        qrRef.current.toDataURL(async (data: string) => {
          try {
            await FileSystem.writeAsStringAsync(path, data, {
              encoding: FileSystem.EncodingType.Base64,
            });
            
            await Sharing.shareAsync(path, {
              mimeType: 'image/png',
              dialogTitle: `QR de ${qrProducto.nombre}`,
            });
            
            setQrModalVisible(false);
          } catch (error) {
            console.error('Error al compartir QR:', error);
            Alert.alert('Error', 'No se pudo compartir el código QR');
          }
        });
      } catch (error) {
        console.error('Error al compartir QR:', error);
        Alert.alert('Error', 'No se pudo compartir el código QR');
      }
    };

    if (isLoading) {
      return (
        <View style={commonStyles.container}>
          <Text style={commonStyles.emptyStateText}>Cargando...</Text>
        </View>
      );
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[commonStyles.container, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📦 Productos</Text>
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => {
      setEditingProduct(null);
      setModalVisible(true);
    }}
    activeOpacity={0.7}
  >
    <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
    <Text style={styles.addButtonText}>Nuevo</Text>
  </TouchableOpacity>
  <Modal
  visible={!!menuProducto}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setMenuProducto(null)}
>
  <View style={styles.modalOverlay}>
    
    {/* Fondo clickeable para cerrar */}
    <TouchableWithoutFeedback onPress={() => setMenuProducto(null)}>
      <View style={StyleSheet.absoluteFillObject} />
    </TouchableWithoutFeedback>

    {/* Menú principal */}
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>Opciones para {menuProducto?.nombre}</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setMenuProducto(null);
          if (menuProducto?.variantes?.length) {
            Alert.alert(
              "Seleccionar variante",
              "Este producto tiene variantes. ¿Qué variante deseas generar?",
              menuProducto.variantes.map((v) => ({
                text: `${v.nombre}`,
                onPress: () => generarQRVariante(menuProducto, v),
              })),
              { cancelable: true }
            );
          } else {
            generarQR(menuProducto!);
          }
        }}
      >
        <MaterialCommunityIcons name="qrcode" size={20} color={colors.primary} />
        <Text style={styles.menuButtonText}>Generar QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setMenuProducto(null);
          abrirComponentesModal(menuProducto!);
        }}
      >
        <MaterialCommunityIcons name="package-variant" size={20} color={colors.primary} />
        <Text style={styles.menuButtonText}>Manejar Componentes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setMenuProducto(null);
          abrirModalVariantes(menuProducto!);
        }}
      >
        <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.primary} />
        <Text style={styles.menuButtonText}>Manejar Variantes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setMenuProducto(null)}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    
</View>

{showSaveAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    opacity: cartOpacity,
    transform: [{ scale: cartScale }],
    zIndex: 999,
  }}>
    <Text style={{ color: 'white', fontWeight: 'bold' }}>✅ Producto guardado</Text>
  </Animated.View>
)}


{showSaveAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    opacity: cartOpacity,
    transform: [{ scale: cartScale }],
    zIndex: 999,
    elevation: 6,
  }}>
    <Text style={{ color: 'white', fontWeight: 'bold' }}>✅ Producto guardado</Text>
  </Animated.View>
)}

{showEditAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    opacity: editOpacity,
    transform: [{ scale: editScale }],
    zIndex: 999,
    elevation: 6,
  }}>
    <Text style={{ color: 'white', fontWeight: 'bold' }}>✏️ Producto editado</Text>
  </Animated.View>
)}

{showDeleteAnimation && (
  <Animated.View style={{
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    opacity: deleteOpacity,
    transform: [{ scale: deleteScale }],
    zIndex: 999,
    elevation: 6,
  }}>
    <Text style={{ color: 'white', fontWeight: 'bold' }}>🗑️ Producto eliminado</Text>
  </Animated.View>
)}
        <View style={commonStyles.content}>
          <FlatList
            data={productos}
            renderItem={renderProducto}
            keyExtractor={(item) => item.id?.toString() || ''}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={commonStyles.emptyState}>
                <Text style={commonStyles.emptyStateText}>
                  No hay productos registrados
                </Text>
              </View>
            }
            ItemSeparatorComponent={() => (
              <View style={{ height: 12 }} />
            )}
          />
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Nombre del producto"
                    autoFocus={true}
                  />
                  <TextInput
                    style={styles.input}
                    value={precioCosto}
                    onChangeText={setPrecioCosto}
                    keyboardType="numeric"
                    placeholder="Precio de costo"
                  />
                  <TextInput
                    style={styles.input}
                    value={precioVenta}
                    onChangeText={setPrecioVenta}
                    keyboardType="numeric"
                    placeholder="Precio de venta"
                  />
                  <TextInput
                    style={styles.input}
                    value={stock}
                    onChangeText={setStock}
                    keyboardType="numeric"
                    placeholder="Stock"
                  />
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleSubmit}
                  >
                    <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                    <Text style={styles.modalButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

        {editingProduct && (
          <ComponentesModal
            visible={componentesModalVisible}
            onClose={() => {
              setComponentesModalVisible(false);
              setEditingProduct(null);
            }}
            productoId={editingProduct.id!}
            productos={productos}
          />
        )}

  <Modal
    visible={qrModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setQrModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Código QR</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setQrModalVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          <View style={styles.qrContainer}>
          <QRCode
  value={qrData}
  size={200}
  backgroundColor="white"
  color="black"
  getRef={(ref) => (qrRef.current = ref)}
/>

{qrData ? (() => {
  try {
    const parsed = JSON.parse(qrData);

    return (
      <>
        <Text style={styles.qrText}>{parsed.nombre}</Text>
        {parsed.varianteNombre && parsed.varianteId && (
          <Text style={styles.qrVarianteText}>
            Variante: {parsed.varianteNombre} (ID: {parsed.varianteId})
          </Text>
        )}

      </>
    );
  } catch (error) {
 
    return <Text style={{ color: "red" }}>⚠️ Error al leer QR</Text>;
  }
})() : null}



            <Text style={styles.qrPrice}>${qrProducto?.precioVenta}</Text>
          </View>
        </View>
{menuProducto && (
  <Modal
    visible={true}
    transparent
    animationType="fade"
    onRequestClose={() => setMenuProducto(null)}
  >
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={() => setMenuProducto(null)}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Opciones para {menuProducto?.nombre}</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setMenuProducto(null);
            if (menuProducto?.variantes?.length) {
              Alert.alert(
                "Seleccionar variante",
                "Este producto tiene variantes. ¿Qué variante deseas generar?",
                menuProducto.variantes.map((v) => ({
                  text: `${v.nombre}`,
                  onPress: () => generarQRVariante(menuProducto, v),
                })),
                { cancelable: true }
              );
            } else {
              generarQR(menuProducto);
            }
          }}
        >
          <MaterialCommunityIcons name="qrcode" size={20} color={colors.primary} />
          <Text style={styles.menuButtonText}>Generar QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setMenuProducto(null);
            abrirComponentesModal(menuProducto!);
          }}
        >
          <MaterialCommunityIcons name="package-variant" size={20} color={colors.primary} />
          <Text style={styles.menuButtonText}>Manejar Componentes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setMenuProducto(null);
            abrirModalVariantes(menuProducto!);
          }}
        >
          <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.primary} />
          <Text style={styles.menuButtonText}>Manejar Variantes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setMenuProducto(null)}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => setQrModalVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={20} color={colors.gray[700]} />
            <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Cerrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={compartirQR}
          >
            <MaterialCommunityIcons name="share" size={20} color={colors.white} />
            <Text style={styles.modalButtonText}>Compartir QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>


        <Modal
          visible={variantesModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={cerrarModalVariantes}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingProduct?.nombre} - Variantes
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={cerrarModalVariantes}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.gray[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nombre de la variante</Text>
                  <TextInput
                    style={styles.input}
                    value={varianteNombre}
                    onChangeText={setVarianteNombre}
                    placeholder="Ej: Color Rojo"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Stock</Text>
                  <TextInput
                    style={styles.input}
                    value={varianteStock}
                    onChangeText={setVarianteStock}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={guardarVariante}
                >
                  <MaterialCommunityIcons name="content-save" size={20} color={colors.white} />
                  <Text style={styles.saveButtonText}>
                    {varianteSeleccionada ? 'Actualizar' : 'Agregar'} Variante
                  </Text>
                </TouchableOpacity>

                {editingProduct?.variantes && editingProduct.variantes.length > 0 && (
                  <View style={styles.variantesList}>
                    <Text style={styles.sectionTitle}>Variantes existentes</Text>
                    <FlatList
                      data={editingProduct.variantes}
                      renderItem={renderVariante}
                      keyExtractor={item => item.id?.toString() || ''}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalComponentesVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalComponentesVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Componentes de {productoSeleccionado?.nombre}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalComponentesVisible(false)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color={colors.gray[800]} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.componentesList}>
                    <Text style={styles.sectionTitle}>Componentes Actuales</Text>
                    <FlatList
                      data={componentes}
                      renderItem={renderComponente}
                      keyExtractor={(item) => item.id?.toString() || ''}
                      ListEmptyComponent={
                        <Text style={styles.emptyText}>No hay componentes agregados</Text>
                      }
                      scrollEnabled={false}
                    />
                  </View>

                  <View style={styles.agregarComponenteContainer}>
                    <Text style={styles.sectionTitle}>Agregar Nuevo Componente</Text>
                    <View style={styles.agregarComponenteForm}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.label}>Seleccionar Material</Text>
                        <View style={styles.materialesList}>
                          {materiales.map((material) => (
                            <TouchableOpacity
                              key={material.id}
                              style={[
                                styles.materialItem,
                                materialSeleccionado?.id === material.id && styles.materialItemSelected
                              ]}
                              onPress={() => setMaterialSeleccionado(material)}
                            >
                              <View style={styles.materialInfo}>
                                <Text style={[
                                  styles.materialNombre,
                                  materialSeleccionado?.id === material.id && styles.materialNombreSelected
                                ]}>
                                  {material.nombre}
                                </Text>
                                <Text style={[
                                  styles.materialUnidad,
                                  materialSeleccionado?.id === material.id && styles.materialUnidadSelected
                                ]}>
                                  {material.unidad} - ${material.precioCosto}
                                </Text>
                              </View>
                              {materialSeleccionado?.id === material.id && (
                                <MaterialCommunityIcons 
                                  name="check-circle" 
                                  size={24} 
                                  color={colors.primary} 
                                />
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {materialSeleccionado && (
                        <View style={styles.inputContainer}>
                          <Text style={styles.label}>Cantidad</Text>
                          <TextInput
                            style={styles.input}
                            value={cantidadComponente}
                            onChangeText={(text) => {
                              // Permitir números, punto y coma como separadores decimales
                              const regex = /^\d*[.,]?\d*$/;
                              if (regex.test(text) || text === '') {
                                setCantidadComponente(text);
                              }
                            }}
                            keyboardType="decimal-pad"
                            placeholder={`Ingrese la cantidad en ${materialSeleccionado.unidad} (ej: 0,3 o 0.3)`}
                          />
                        </View>
                      )}

                      <TouchableOpacity
                        style={[
                          styles.agregarButton,
                          (!materialSeleccionado || !cantidadComponente) && styles.agregarButtonDisabled
                        ]}
                        onPress={agregarComponente}
                        disabled={!materialSeleccionado || !cantidadComponente}
                      >
                        <Text style={styles.agregarButtonText}>Agregar Componente</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </Animated.View>
      </GestureHandlerRootView>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    padding: 16,
    paddingBottom: 80,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
  },
  
  closeButton: {
    padding: 4,
  },
  
  modalBody: {
    gap: 16,
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colors.gray[50],
    color: colors.gray[800],
  },
  
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  
  modalButtonSecondary: {
    backgroundColor: colors.gray[100],
  },
  
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  
  modalButtonTextSecondary: {
    color: colors.gray[700],
  },
  
  productoItem: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // 👈 asegura la alineación vertical
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12, // separación entre items
  },
  
  productoInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  
  productoNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a', // gris oscuro

  },
  
  productoDetails: {
    flexDirection: 'row',
    gap: 4,
  },
  
  productoPrecio: {
    fontSize: 14,
    color: '#10b981', // verde suave
  },
  
  productoPrecioCosto: {
    fontSize: 14,
    color: '#f59e0b', // amarillo suave
  },
  
  productoStock: {
    fontSize: 14,
    color: '#3b82f6', // azul
  },
  
  
  


  productoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  editButton: {
    backgroundColor: colors.info,
  },
  componentesButton: {
    backgroundColor: colors.success,
  },
  qrButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  
  
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    
    marginBottom: spacing.md,
    ...shadows.md,

  },

  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    color: colors.gray[700],
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.sm,
  },
  
 
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[800],
    marginBottom: spacing.lg,
  },
  componentesList: {
    marginBottom: spacing.lg,
  },
  componenteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  componenteInfo: {
    flex: 1,
  },
  componenteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  componenteCantidad: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  componenteDeleteButton: {
    padding: spacing.xs,
  },
  addComponentContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.lg,
  },
  materialSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  materialOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  materialOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  materialOptionText: {
    color: colors.gray[700],
    fontSize: typography.sizes.base,
  },
  materialOptionTextSelected: {
    color: colors.white,
  },
  qrContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[800],
    marginTop: spacing.lg,
  },
  qrPrice: {
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    marginTop: spacing.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[800],
  },
  
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },

  varianteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  varianteInfo: {
    flex: 1,
  },
  varianteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  varianteStock: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  varianteActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  varianteButton: {
    padding: spacing.xs,
  },

  inputContainer: {
    marginBottom: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
  },
  qrVarianteText: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  emptyText: {
    color: colors.gray[500],
    fontSize: typography.sizes.base,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  picker: {
    height: 50,
  },
  agregarComponenteContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.lg,
  },
  agregarComponenteForm: {
    marginTop: spacing.md,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  agregarButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  agregarButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
  componenteDetalles: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  materialesList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  materialItemSelected: {
    backgroundColor: colors.primary[50],
  },
  materialInfo: {
    flex: 1,
  },
  materialNombre: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray[800],
  },
  materialNombreSelected: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  materialUnidad: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  materialUnidadSelected: {
    color: colors.primary[600],
  },
  agregarButtonDisabled: {
    backgroundColor: colors.gray[400],
    opacity: 0.7,
  },
  variantesList: {
    marginTop: spacing.md,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  menuContainer: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 20,
    textAlign: 'center',
  },
  
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: 12,
  },
  
  menuButtonText: {
    fontSize: 16,
    color: colors.gray[700],
    fontWeight: '500',
  },
  
  cancelButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    alignItems: 'center',
  },
  
  cancelText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '600',
  },
  
}); 
