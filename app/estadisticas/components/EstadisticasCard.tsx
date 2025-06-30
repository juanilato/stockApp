import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EstadisticasCardProps {
  icon: string;
  value: string;
  label: string;
  color: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export default function EstadisticasCard({ 
  icon, 
  value, 
  label, 
  color, 
  onPress, 
  children 
}: EstadisticasCardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, onPress && styles.cardPressable]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons name={icon as any} size={26} color={color} />
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      
      {children && (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      )}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    width: '47%',
    alignItems: 'flex-start',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardPressable: {
    transform: [{ scale: 0.99 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'left',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'left',
    fontWeight: '500',
    lineHeight: 18,
  },
  childrenContainer: {
    marginTop: 12,
    width: '100%',

  },
}); 