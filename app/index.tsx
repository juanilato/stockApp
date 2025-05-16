import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EstadisticasView from './components/EstadisticasView';
import InicioView from './components/InicioView';
import MaterialesView from './components/MaterialesView';
import NuevaVentaView from './components/NuevaVentaView';
import ProductosView from './components/ProductosView';
const { width } = Dimensions.get('window');

export default function Dashboard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentView, setCurrentView] = useState<'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales'>('dashboard');
const sonidoSwipe = useRef<Audio.Sound | null>(null);
useEffect(() => {
  const cargarSonidos = async () => {
    const [swipe] = await Promise.all([

      Audio.Sound.createAsync(require('../assets/sounds/swipe.mp3'))
    ]);


    sonidoSwipe.current = swipe.sound;
  };

  cargarSonidos();

  return () => {
    sonidoSwipe.current?.unloadAsync();
  };
}, []);
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewChange = (view: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales') => {
     sonidoSwipe.current?.replayAsync();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentView(view);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const renderContent = async () => {
 

    switch (currentView) {
      case 'dashboard':
         
        return <InicioView />;
      case 'productos':
          
        return <ProductosView />;
      case 'ventas':
        
        return <NuevaVentaView />;
      case 'estadisticas':
          
        return <EstadisticasView />;
      case 'materiales':
   
        return <MaterialesView />;
      default:
  
        return (
          <Animated.View 
            style={[
              styles.main,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.title}>Panel de Ventas</Text>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.card}
            >
              <View style={styles.cardContent}>
                <View style={styles.statContainer}>
                  <MaterialCommunityIcons name="cash-multiple" size={32} color="#1e293b" />
                  <Text style={styles.statValue}>$0</Text>
                  <Text style={styles.statLabel}>Ventas Totales</Text>
                </View>
                <View style={styles.statContainer}>
                  <MaterialCommunityIcons name="trending-up" size={32} color="#1e293b" />
                  <Text style={styles.statValue}>$0</Text>
                  <Text style={styles.statLabel}>Ganancia Neta</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Inicio', headerShown: false }} />

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentView === 'dashboard' && styles.navButtonActive]} 
          onPress={() => handleViewChange('dashboard')}
        >
          <MaterialCommunityIcons 
            name="view-dashboard" 
            size={24} 
            color={currentView === 'dashboard' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[styles.navLabel, currentView === 'dashboard' && styles.navLabelActive]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentView === 'productos' && styles.navButtonActive]} 
          onPress={() => handleViewChange('productos')}
        >
          <MaterialCommunityIcons 
            name="package-variant-closed" 
            size={24} 
            color={currentView === 'productos' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[styles.navLabel, currentView === 'productos' && styles.navLabelActive]}>Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentView === 'materiales' && styles.navButtonActive]} 
          onPress={() => handleViewChange('materiales')}
        >
          <MaterialCommunityIcons 
            name="basket" 
            size={24} 
            color={currentView === 'materiales' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[styles.navLabel, currentView === 'materiales' && styles.navLabelActive]}>Materiales</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentView === 'ventas' && styles.navButtonActive]} 
          onPress={() => handleViewChange('ventas')}
        >
          <MaterialCommunityIcons 
            name="cart" 
            size={24} 
            color={currentView === 'ventas' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[styles.navLabel, currentView === 'ventas' && styles.navLabelActive]}>Ventas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentView === 'estadisticas' && styles.navButtonActive]} 
          onPress={() => handleViewChange('estadisticas')}
        >
          <MaterialCommunityIcons 
            name="chart-line" 
            size={24} 
            color={currentView === 'estadisticas' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[styles.navLabel, currentView === 'estadisticas' && styles.navLabelActive]}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  userNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
 bottomNav: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 24,
  backgroundColor: '#ffffffee', // semitransparente elegante
  borderTopWidth: 0,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},

navButton: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 8,
  paddingHorizontal: 6,
  borderRadius: 16,
  gap: 2,
},

navButtonActive: {
  backgroundColor: '#e0f2fe',
  shadowColor: '#2563eb',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 5,
},

navLabel: {
  fontSize: 10,
  color: '#64748b',
},

navLabelActive: {
  color: '#2563eb',
  fontWeight: '600',
},

  main: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    color: '#1f2937',
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statContainer: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});
