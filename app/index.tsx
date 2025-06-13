import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import EstadisticasView from './components/EstadisticasView';
import InicioView from './components/InicioView';
import MaterialesView from './components/MaterialesView';
import NuevaVentaView from './components/NuevaVentaView';
//import ProductosView from './components/ProductosView';
import ProductosView from '../app/productos/pages/main';

const { width, height } = Dimensions.get('window');


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
    bottom: hp('0%'),

    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopLeftRadius: wp('7%'),
    borderTopRightRadius: wp('7%'),

    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },

  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: wp('5%'),
    marginHorizontal: wp('0.5%'),
    paddingVertical: hp('0.8%'),
  },

  navButtonActive: {
    backgroundColor: '#e0edff',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2.5%'),
    borderRadius: wp('5%'),
    transform: [{ scale: 1.12 }],
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },

  navLabel: {
    fontSize: RFValue(6, height),
    color: '#64748b',
    marginTop: hp('0.3%'),
  },

  navLabelActive: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: RFValue(7, height),
  },

  title: {
    fontSize: RFValue(18, height),
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },

  card: {
    borderRadius: wp('4%'),
    padding: wp('5%'),
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
    fontSize: RFValue(18, height),
    fontWeight: '700',
    color: '#1e293b',
    marginTop: hp('1%'),
  },

  statLabel: {
    fontSize: RFValue(12, height),
    color: '#6b7280',
    marginTop: hp('0.5%'),
  },

  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});

