import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';

interface Props {
  confirmado?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ScannerOverlay({ confirmado = false }: Props) {
  // Animaciones para el estado de escaneo
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Animaciones para el estado confirmado
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!confirmado) {
      // Animación de línea de escaneo
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animación de esquinas pulsantes
      Animated.loop(
        Animated.sequence([
          Animated.timing(cornerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(cornerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animación de pulso general
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animación de brillo
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Secuencia de animación de éxito
      Animated.sequence([
        // Expansión del fondo
        Animated.timing(successScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Aparición del contenido
        Animated.parallel([
          Animated.timing(successOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(checkmarkScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        // Efecto de ondas
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 600,
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

  const cornerOpacity = cornerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      {!confirmado ? (
        // Estado de escaneo
        <Animated.View
          style={{
            width: 280,
            height: 180,
            transform: [{ scale: pulseScale }],
          }}
        >
          {/* Marco principal */}
          <View
            style={{
              width: 280,
              height: 180,
              borderWidth: 2,
              borderColor: '#3b82f6',
              borderRadius: 16,
              position: 'relative',
            }}
          />

          {/* Efecto de brillo */}
          <Animated.View
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderWidth: 3,
              borderColor: '#60a5fa',
              borderRadius: 18,
              opacity: glowOpacity,
            }}
          />

          {/* Línea de escaneo */}
          <Animated.View
            style={{
              position: 'absolute',
              top: scanLinePosition,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: '#10b981',
              shadowColor: '#10b981',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 8,
            }}
          />

          {/* Esquinas animadas */}
          <Animated.View
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              width: 20,
              height: 20,
              borderTopWidth: 3,
              borderLeftWidth: 3,
              borderColor: '#10b981',
              borderTopLeftRadius: 16,
              opacity: cornerOpacity,
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 20,
              height: 20,
              borderTopWidth: 3,
              borderRightWidth: 3,
              borderColor: '#10b981',
              borderTopRightRadius: 16,
              opacity: cornerOpacity,
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: -2,
              left: -2,
              width: 20,
              height: 20,
              borderBottomWidth: 3,
              borderLeftWidth: 3,
              borderColor: '#10b981',
              borderBottomLeftRadius: 16,
              opacity: cornerOpacity,
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 20,
              height: 20,
              borderBottomWidth: 3,
              borderRightWidth: 3,
              borderColor: '#10b981',
              borderBottomRightRadius: 16,
              opacity: cornerOpacity,
            }}
          />

          {/* Indicador de escaneo */}
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -20 }, { translateY: -20 }],
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons 
              name="barcode-scan" 
              size={24} 
              color="#3b82f6" 
            />
          </View>

          {/* Texto de instrucción */}
          <View
            style={{
              position: 'absolute',
              bottom: -40,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Animated.Text
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
                opacity: pulseAnim,
                textAlign: 'center',
              }}
            >
              Escanea el código de barras
            </Animated.Text>
          </View>
        </Animated.View>
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
            position: 'relative',
          }}
        >
          {/* Fondo de éxito */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 280,
              height: 180,
              backgroundColor: '#10b981',
              borderRadius: 16,
              transform: [
                {
                  scale: successScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            }}
          />

          {/* Efecto de ondas */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 280,
              height: 180,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#ffffff',
              transform: [
                {
                  scale: rippleScale,
                },
              ],
              opacity: rippleOpacity,
            }}
          />

          {/* Contenido de éxito */}
          <Animated.View
            style={{
              opacity: successOpacity,
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    scale: checkmarkScale,
                  },
                ],
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons 
                name="check-circle" 
                size={64} 
                color="#ffffff" 
              />
            </Animated.View>
            
            <Animated.Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '700',
                textAlign: 'center',
                opacity: successOpacity,
              }}
            >
              ¡Código escaneado!
            </Animated.Text>
            
            <Animated.Text
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 14,
                fontWeight: '500',
                textAlign: 'center',
                marginTop: 4,
                opacity: successOpacity,
              }}
            >
              Producto encontrado
            </Animated.Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
