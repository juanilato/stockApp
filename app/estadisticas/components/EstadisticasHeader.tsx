import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EstadisticasHeaderProps {
  onConfigurar: () => void;
}

const EstadisticasHeader: React.FC<EstadisticasHeaderProps> = ({ onConfigurar }) => {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <Text style={styles.headerSubtitle}>Análisis de rendimiento</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonDestacado]} onPress={onConfigurar}>
            <MaterialCommunityIcons name="cog" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
    backgroundColor: '#8b5cf6',
  },
});

export default EstadisticasHeader; 