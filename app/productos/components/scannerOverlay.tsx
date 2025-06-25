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
  outputRange: [-100, 180],
});

  const frameColor = 'rgba(255, 255, 255, 0.6)'; // Blanco semitransparente
  const scanLineColor = '#ffffff';

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
    width: 280,
    height: 180,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: frameColor,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  }}
>
  {/* Línea de escaneo animada */}
<Animated.View
  style={{
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: scanLineColor,
    opacity: 0.8,
    transform: [{ translateY: scanLinePosition }],
  }}
/>
  {/* Instrucción al usuario */}
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
        opacity: 0.9,
        letterSpacing: 0.5,
      }}
    >
      Escaneá el código de barras
    </Text>
  </View>
</View>

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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  }}
>
  {/* Fondo animado de éxito */}
  <Animated.View
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#34d399', // verde esmeralda claro
      borderRadius: 20,
      opacity: successBgOpacity,
    }}
  />

  {/* Contenido animado */}
  <Animated.View
    style={{
      alignItems: 'center',
      transform: [
        {
          scale: successContentScale.interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          }),
        },
      ],
      opacity: successContentScale,
    }}
  >
    <MaterialCommunityIcons 
      name="check-circle" 
      size={76} 
      color="#ffffff" 
      style={{ shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6 }}
    />
    <Text
      style={{
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '700',
        marginTop: 14,
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
