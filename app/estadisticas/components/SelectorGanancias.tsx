import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectorGananciasProps {
  tipoGanancia: 'dia' | 'mes' | 'anio';
  onTipoChange: (tipo: 'dia' | 'mes' | 'anio') => void;
}

const labelGanancia: { [key in 'dia' | 'mes' | 'anio']: string } = {
  dia: 'DÍA',
  mes: 'MES',
  anio: 'AÑO',
};

export default function SelectorGanancias({ tipoGanancia, onTipoChange }: SelectorGananciasProps) {
  return (
    <View style={styles.container}>
      {(['dia', 'mes', 'anio'] as const).map((tipo) => (
        <TouchableOpacity
          key={tipo}
          style={[
            styles.option,
            tipoGanancia === tipo && styles.optionSelected
          ]}
          onPress={() => onTipoChange(tipo)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.optionText,
            tipoGanancia === tipo && styles.optionTextSelected
          ]}>
            {labelGanancia[tipo]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    minWidth: 50,
  },
  optionSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  optionText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
}); 