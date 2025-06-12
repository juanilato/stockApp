import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import EstadisticasView from './components/EstadisticasView';
import InicioView from './components/InicioView';
import MaterialesView from './components/MaterialesView';
import NuevaVentaView from './components/NuevaVentaView';

import { borderRadius, spacing, typography } from '../styles/theme';
//import ProductosView from './components/ProductosView';
import ProductosView from '../app/productos/pages/main';


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

  const renderContent =  () => {
 

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
          style={[styles.navButton, currentView === 'dashboard' && styles.navButtonActive]} 
          onPress={() => handleViewChange('dashboard')}
        >
          <MaterialCommunityIcons 
            name="home-variant-outline" 
            size={24} 
            color={currentView === 'dashboard' ? '#2563eb' : '#64748b'} 
          />
          <Text style={[styles.navLabel, currentView === 'dashboard' && styles.navLabelActive]}>Inicio</Text>
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
          <Text style={[styles.navLabel, currentView === 'estadisticas' && styles.navLabelActive]}>Métricas</Text>
        </TouchableOpacity>


      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  content: ViewStyle;
  bottomNav: ViewStyle;
  navButton: ViewStyle;
  navButtonActive: ViewStyle;
  navLabel: TextStyle;
  navLabelActive: TextStyle;
  title: TextStyle;
  card: ViewStyle;
  cardContent: ViewStyle;
  statContainer: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  main: ViewStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  content: {
    flex: 1,

  },

bottomNav: {
  position: 'absolute',
  bottom: 6,
  left: 16,
  right: 16,
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 30,
  paddingVertical: 2,
  paddingHorizontal: 12,
  shadowColor: '#000',

  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 10,
  backdropFilter: 'blur(10px)', // solo para web, visualmente iOS
},

navButton: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  borderRadius: 20,
  marginHorizontal: 2,
  paddingVertical: 6,
  transitionDuration: '200ms',
},

navButtonActive: {
  backgroundColor: '#e0edff', // más claro y suave que #eef2ff
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: 20,
  transform: [{ scale: 1.12 }],
  shadowColor: '#1d4ed8',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 8,
},


navLabel: {
  fontSize: 7,
  color: '#64748b',
  marginTop: 2,
},

navLabelActive: {
  color: '#2563eb',
  fontWeight: '600',
  fontSize: 8,
},


  // Título para el fallback
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typeof typography.weights.bold === 'number' ? typography.weights.bold : (typography.weights.bold as any),
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff',
    elevation: 6,
  },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statContainer: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typeof typography.weights.bold === 'number' ? typography.weights.bold : (typography.weights.bold as any),
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: '#6b7280',
    marginTop: 2,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#f8fafc',
  },
  
});

