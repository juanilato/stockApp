import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import InicioView from './components/InicioView';
import EstadisticasView from './estadisticas/main';
import MaterialesView from './materiales/main';

import NuevaVentaView from '../app/nueva-venta/main';

import ProductosView from '../app/productos/pages/main';

const { width, height } = Dimensions.get('window');

interface NavItem {
  key: 'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales';
  icon: string;
  label: string;
  color: string;
}

const navItems: NavItem[] = [
  {
    key: 'materiales',
    icon: 'basket',
    label: 'Materiales',
    color: '#f59e0b'
  },
  {
    key: 'productos',
    icon: 'package-variant-closed',
    label: 'Productos',
    color: '#3b82f6'
  },
  {
    key: 'dashboard',
    icon: 'home-variant-outline',
    label: 'Inicio',
    color: '#10b981'
  },
  {
    key: 'ventas',
    icon: 'cart',
    label: 'Ventas',
    color: '#ef4444'
  },
  {
    key: 'estadisticas',
    icon: 'chart-line',
    label: 'Estadísticas',
    color: '#8b5cf6'
  }
];

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

  const renderContent = () => {
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

      {/* Modern Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          {navItems.map((item) => {
            const isActive = currentView === item.key;
            return (
              <TouchableOpacity 
                key={item.key}
                style={[styles.navButton, isActive && styles.navButtonActive]} 
                onPress={() => handleViewChange(item.key)}
                activeOpacity={0.8}
              >
                <Animated.View style={[
                  styles.iconContainer,
                  isActive && { backgroundColor: `${item.color}15` }
                ]}>
                  <MaterialCommunityIcons 
                    name={item.icon as any} 
                    size={24} 
                    color={isActive ? item.color : '#94a3b8'} 
                  />
                </Animated.View>
                <Text style={[
                  styles.navLabel, 
                  isActive && { color: item.color, fontWeight: '600' }
                ]}>
                  {item.label}
                </Text>
                {isActive && (
                  <View style={[{ backgroundColor: item.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  content: ViewStyle;
  bottomNavContainer: ViewStyle;
  bottomNav: ViewStyle;
  navButton: ViewStyle;
  navButtonActive: ViewStyle;
  iconContainer: ViewStyle;
  navLabel: TextStyle;
  activeIndicator: ViewStyle;
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
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    paddingHorizontal: wp('4%'),
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
    position: 'relative',
  },
  navButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',

  },
  navLabel: {
    fontSize: RFValue(10, height),
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: hp('0.5%'),
    width: 4,
    height: 4,
    borderRadius: 2,
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

