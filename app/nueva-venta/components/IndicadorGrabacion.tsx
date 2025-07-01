import { StyleSheet, Text, View } from 'react-native';

interface IndicadorGrabacionProps {
  visible: boolean;
}

export default function IndicadorGrabacion({ visible }: IndicadorGrabacionProps) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.circle} />
      <Text style={styles.text}>Escuchando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 180,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 20,
    zIndex: 1001,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 