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
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    width: '100%',
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#1e293b',
  },
}); 