import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Material } from '../../../services/db';

interface MaterialItemProps {
  material: Material;
}

export default function MaterialItem({ material }: MaterialItemProps) {
  return (
    <View style={styles.materialItem}>
      <View style={styles.materialHeader}>
        <Text style={styles.materialNombre}>{material.nombre}</Text>
      </View>
      
      <View style={styles.materialDetalles}>
        <View style={styles.detalleItem}>
          <Text style={styles.detalleLabel}>Precio:</Text>
          <Text style={styles.detalleValor}>${material.precioCosto}</Text>
        </View>
        
        <View style={styles.detalleItem}>
          <Text style={styles.detalleLabel}>Unidad:</Text>
          <Text style={styles.detalleValor}>{material.unidad}</Text>
        </View>
        
        <View style={styles.detalleItem}>
          <Text style={styles.detalleLabel}>Stock:</Text>
          <Text style={[
            styles.detalleValor, 
            material.stock <= 10 ? styles.lowStock : null
          ]}>
            {material.stock} unidades
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  materialItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  materialHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  materialNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  materialDetalles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detalleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detalleLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detalleValor: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  lowStock: {
    color: '#ef4444',
  },
}); 