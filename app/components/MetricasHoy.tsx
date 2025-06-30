import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface MetricasHoyProps {
  gananciaHoy: number;
  ventasHoy: number;
}

const MetricasHoy: React.FC<MetricasHoyProps> = ({ gananciaHoy, ventasHoy }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.ventasCard]}>
        <MaterialCommunityIcons name="cash-multiple" size={28} color="#10b981" />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Ventas de Hoy</Text>
          <Text style={styles.value}>${ventasHoy.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.card, styles.gananciaCard]}>
        <MaterialCommunityIcons name="chart-timeline-variant" size={28} color="#3b82f6" />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Ganancia de Hoy</Text>
          <Text style={styles.value}>${gananciaHoy.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  ventasCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  gananciaCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  textContainer: {
    marginLeft: 12,
  },
  label: {
    fontSize: RFValue(13),
    color: '#4b5563',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: RFValue(18),
    fontWeight: '700',
    color: '#1f2937',
  },
});

export default MetricasHoy; 