import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Estadisticas() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Estadísticas' }} />
      <Text style={styles.text}>Aquí se mostrarán estadísticas y gráficos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, color: '#1f2937' }
});
