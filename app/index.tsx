import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ViewToken,
} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NuevaVentaView from '../app/nueva-venta/main';
import ProductosView from '../app/productos/pages/main';
import InicioView from './components/InicioView';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import EstadisticasView from './estadisticas/main';
import MaterialesView from './materiales/main';

const { width } = Dimensions.get('window');

interface NavItem {
  key: 'materiales' | 'productos' | 'dashboard' | 'ventas' | 'estadisticas';
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

const initialViewIndex = navItems.findIndex(i => i.key === 'dashboard');

function DashboardContent() {
  const { setCurrentTab, shouldOpenScanner, setShouldOpenScanner } = useNavigation();
  const [viewIndex, setViewIndex] = useState(initialViewIndex);
  const sonidoSwipe = useRef<Audio.Sound | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const navIndicatorAnim = useRef(new Animated.Value(viewIndex)).current;

  useEffect(() => {
    if (shouldOpenScanner) {
      const ventasIndex = navItems.findIndex(item => item.key === 'ventas');
      if (ventasIndex !== -1) {
        handleTabPress(ventasIndex);
      }
      setShouldOpenScanner(false);
    }
  }, [shouldOpenScanner]);
  
  useEffect(() => {
    const cargarSonidos = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/swipe.mp3'));
        sonidoSwipe.current = sound;
      } catch (error) {
        console.error("Error al cargar el sonido:", error);
      }
    };
    cargarSonidos();
    return () => {
      sonidoSwipe.current?.unloadAsync();
    };
  }, []);

  const handleTabPress = (index: number) => {
    if (index === viewIndex) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
    sonidoSwipe.current?.replayAsync();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setViewIndex(newIndex);
        setCurrentTab(navItems[newIndex].key);
        Animated.spring(navIndicatorAnim, {
          toValue: newIndex,
          useNativeDriver: false,
        }).start();
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = useCallback(({ item }: { item: NavItem }) => {
    let content;
    switch (item.key) {
      case 'dashboard': content = <InicioView />; break;
      case 'productos': content = <ProductosView />; break;
      case 'ventas': content = <NuevaVentaView />; break;
      case 'estadisticas': content = <EstadisticasView />; break;
      case 'materiales': content = <MaterialesView />; break;
      default: content = null;
    }
    return (
      <View style={styles.pageContainer}>
        <View style={styles.pageContent}>
          {content}
        </View>
      </View>
    )
  }, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    []
  );

  const navContainerHorizontalPadding = wp('4%');
  const navHorizontalPadding = wp('2%');
  const navContentWidth = width - (navContainerHorizontalPadding * 2) - (navHorizontalPadding * 2);
  const navItemWidth = navContentWidth / navItems.length;

  const indicatorTranslateX = navIndicatorAnim.interpolate({
    inputRange: navItems.map((_, i) => i),
    outputRange: navItems.map((_, i) => i * navItemWidth),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Inicio', headerShown: false }} />
      
      <FlatList
        ref={flatListRef}
        data={navItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialViewIndex}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        style={styles.content}
      />

      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <Animated.View
            style={[
              styles.navIndicator,
              {
                width: navItemWidth,
                left: navHorizontalPadding,
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />
          {navItems.map((item, index) => {
            const isActive = viewIndex === index;
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.navButton}
                onPress={() => handleTabPress(index)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={isActive ? item.color : '#94a3b8'}
                />
                <Text
                  style={[
                    styles.navLabel,
                    isActive && { color: item.color, fontWeight: '700' },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  return (
    <NavigationProvider>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
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
  navIndicator: ViewStyle;
  navButton: ViewStyle;
  navLabel: TextStyle;
  pageContainer: ViewStyle;
  pageContent: ViewStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
  pageContainer: {
    width: width,
    height: '100%',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  pageContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
  },
  bottomNavContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('1%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  navIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    borderRadius: 24,
    zIndex: 0,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
    paddingVertical: hp('0.5%'),
  },
  navLabel: {
    fontSize: RFValue(10),
    color: '#64748b',
    fontWeight: '500',
    marginTop: 4,
  },
});

