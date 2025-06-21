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
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
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
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardPressable: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  childrenContainer: {
    marginTop: 12,
    width: '100%',
  },
}); 