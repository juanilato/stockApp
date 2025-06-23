import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';

interface Props {
  confirmado?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ScannerOverlay({ confirmado = false }: Props) {
  // Animaciones para el estado de escaneo
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  
  // Animaciones para el estado confirmado
  const successBgOpacity = useRef(new Animated.Value(0)).current;
  const successContentScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!confirmado) {
      // Resetear animaciones de éxito al volver a escanear
      successBgOpacity.setValue(0);
      successContentScale.setValue(0);
      
      // Animación de línea de escaneo
      const scanAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      );
      
      scanAnimation.start();

      return () => {
        scanAnimation.stop();
      };
    } else {
      // Detener animaciones de escaneo
      scanLineAnim.setValue(0);

      // Secuencia de animación de éxito
      Animated.sequence([
        Animated.timing(successBgOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(successContentScale, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [confirmado]);

  // Interpolaciones para efectos visuales
  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  });

  const frameColor = 'rgba(255, 255, 255, 0.6)'; // Blanco semitransparente
  const scanLineColor = '#ffffff';
  const successColor = '#10b981';
  const textColor = '#e5e7eb';

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      {!confirmado ? (
        // Estado de escaneo
        <View
          style={{
            width: 280,
            height: 180,
          }}
        >
          {/* Marco principal */}
          <View
            style={{
              width: '100%',
              height: '100%',
              borderWidth: 1,
              borderColor: frameColor,
              borderRadius: 16,
            }}
          />



          {/* Texto de instrucción */}
          <View
            style={{
              position: 'absolute',
              bottom: -50,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: textColor,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              
            </Text>
          </View>
        </View>
      ) : (
        // Estado de confirmación
        <View
          style={{
            width: 280,
            height: 180,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Fondo de éxito */}
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: successColor,
              borderRadius: 16,
              opacity: successBgOpacity,
            }}
          />

          {/* Contenido de éxito */}
          <Animated.View
            style={{
              opacity: successContentScale,
              alignItems: 'center',
              transform: [{ scale: successContentScale }],
            }}
          >
            <MaterialCommunityIcons 
              name="check-circle-outline"
              size={72} 
              color="#ffffff" 
            />
            <Text
              style={{
                color: '#ffffff',
                fontSize: 20,
                fontWeight: '700',
                marginTop: 16,
              }}
            >
              Producto Escaneado
            </Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
