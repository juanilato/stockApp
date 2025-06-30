import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import NuevaVentaView from '../app/nueva-venta/main';
import ProductosView from '../app/productos/pages/main';
import InicioView from './components/InicioView';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import EstadisticasView from './estadisticas/main';
import MaterialesView from './materiales/main';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');
import * as NavigationBar from 'expo-navigation-bar';

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

function DashboardContent() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentView, setCurrentView] = useState<'dashboard' | 'productos' | 'ventas' | 'estadisticas' | 'materiales'>('dashboard');
  const sonidoSwipe = useRef<Audio.Sound | null>(null);
  const [menuVisible, setMenuVisible] = useState(true);

  const [viewIndex, setViewIndex] = useState(() => navItems.findIndex(i => i.key === currentView));
  const fadeSlideAnim = useRef(new Animated.Value(0)).current;
  const navAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Usar el contexto de navegación
  const { currentTab, shouldOpenScanner, setShouldOpenScanner, activeModal, closeModal } = useNavigation();

  // Efecto para sincronizar el tab actual con el contexto
  useEffect(() => {
    if (currentTab !== currentView) {
      console.log(`🔄 Cambiando de tab: ${currentView} -> ${currentTab}`);
      const newIndex = navItems.findIndex(i => i.key === currentTab);
      if (newIndex !== -1) {
        animateToIndex(newIndex);
      }
    }
  }, [currentTab]);

  // Efecto para manejar la apertura automática del scanner
  useEffect(() => {
    if (shouldOpenScanner && currentView === 'ventas') {
      console.log('🎯 Scanner solicitado en tab de ventas');
      // El scanner se activará automáticamente en NuevaVentaView
      setShouldOpenScanner(false);
    }
  }, [shouldOpenScanner, currentView]);

  const toggleMenu = () => {
    Animated.parallel([
      Animated.timing(navAnim, {
        toValue: menuVisible ? 100 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: menuVisible ? 0.8 : 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(rotationAnim, {
        toValue: menuVisible ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    setMenuVisible(!menuVisible);
  };

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
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateToIndex = (newIndex: number) => {
    if (newIndex === viewIndex) return;

    const direction = newIndex > viewIndex ? -1 : 1;

    // Animación de escala para feedback visual
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Fase de salida con efecto de desvanecimiento
    Animated.parallel([
      Animated.timing(fadeSlideAnim, {
        toValue: direction * 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Cambio de vista
      setViewIndex(newIndex);
      setCurrentView(navItems[newIndex].key);

      // Reposicionar instantáneamente en dirección contraria
      fadeSlideAnim.setValue(-direction * 1);

      // Fase de entrada con efecto de aparición
      Animated.parallel([
        Animated.timing(fadeSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Sonido
    sonidoSwipe.current?.replayAsync();
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    const newIndex =
      dir === 'left'
        ? Math.min(viewIndex + 1, navItems.length - 1)
        : Math.max(viewIndex - 1, 0);

    animateToIndex(newIndex);
  };

  const renderAnimatedContent = () => {
    let content;
    switch (currentView) {
      case 'dashboard':
        content = <InicioView />;
        break;
      case 'productos':
        content = <ProductosView />;
        break;
      case 'ventas':
        content = <NuevaVentaView />;
        break;
      case 'estadisticas':
        content = <EstadisticasView />;
        break;
      case 'materiales':
        content = <MaterialesView />;
        break;
      default:
        content = <InicioView />;
    }

    const slideX = fadeSlideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-width * 0.3, 0, width * 0.3],
    });

    const opacity = fadeSlideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.1, 1, 0.1],
    });

    const scale = fadeSlideAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.8, 1, 0.8],
    });

    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: slideX }, { scale }],
          opacity,
        }}
      >
        {content}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de toggle modernizado */}
<Animated.View
  style={[
    styles.toggleButton,
    {
      transform: [
        { translateY: navAnim }, 
        { scale: scaleAnim },
      ],
    },
  ]}
>
  <TouchableOpacity
    onPress={toggleMenu}
    style={styles.toggleButtonInner}
    activeOpacity={0.8}
  >
    <View style={styles.handleBar} />
  </TouchableOpacity>
</Animated.View>

      <Stack.Screen options={{ title: 'Inicio', headerShown: false }} />

      {/* Main Content con animación mejorada */}
      <PanGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            const { translationX } = nativeEvent;
            if (translationX > 50) {
              handleSwipe('right');
            } else if (translationX < -50) {
              handleSwipe('left');
            }
          }
        }}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {renderAnimatedContent()}
        </Animated.View>
      </PanGestureHandler>

      {/* Bottom Navigation Bar */}
      <Animated.View style={[
        styles.bottomNavContainer,
        { transform: [{ translateY: navAnim }] }
      ]}>
        <View style={styles.bottomNav}>
          {navItems.map((item) => {
            const isActive = currentView === item.key;
            return (
              <TouchableOpacity 
                key={item.key}
                style={[styles.navButton, isActive && styles.navButtonActive]} 
                onPress={() => animateToIndex(navItems.findIndex(i => i.key === item.key))}
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
      </Animated.View>
    </SafeAreaView>
  );
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();


useEffect(() => {
  NavigationBar.setVisibilityAsync("hidden");
  NavigationBar.setBehaviorAsync('overlay-swipe'); 
}, []);

  return (
    <NavigationProvider>
  <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <DashboardContent />
</View>
    </NavigationProvider>
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
  toggleButton: ViewStyle;
  toggleButtonInner: ViewStyle;
  handleBar: ViewStyle;
}>({
container: {
  flex: 1,
  backgroundColor: '#f8fafc',
},
handleBar: {
  width: 40,
  height: 4,
  borderRadius: 2,
  backgroundColor: '#cbd5e1',
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
toggleButton: {
  position: 'absolute',
  bottom: hp('11.5%'), 
  alignSelf: 'center',
  borderRadius: 999,
  padding: 4,
  zIndex: 12,
},
  toggleButtonInner: {
    borderRadius: 999,
    padding: 6,
  },
});

