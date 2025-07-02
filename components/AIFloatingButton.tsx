import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface AIFloatingButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  description?: string;
  icon?: string;
  isRecording?: boolean;
  variant?: 'question' | 'mic';
  isActive?: boolean;
  buttonColor?: string;
  robotColor?: string;
}

export default function AIFloatingButton({
  onPress,
  disabled = false,
  style,
  description = "Asistente IA",
  icon = "robot",
  isRecording = false,
  variant,
  isActive = false,
  buttonColor,
  robotColor,
}: AIFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const tooltipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada desde el navbar
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    setShowTooltip(true);
    Animated.timing(tooltipAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(tooltipAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowTooltip(false));
  };

  // Color del robot: prioridad a prop robotColor, luego lógica previa
  const _robotColor = robotColor || (isRecording && variant === 'mic' ? '#ef4444' : '#ffffff');
  // Color del fondo del botón: prioridad a prop buttonColor
  const _buttonColor = buttonColor || (isRecording ? 'rgba(239, 68, 68, 0.9)' : 'rgba(99, 102, 241, 0.9)');

  // Ícono adicional como badge, solo si isActive
  let extraIcon = null;
  if (isActive && variant === 'question') {
    extraIcon = (
      <MaterialCommunityIcons
        name="help-circle"
        size={20}
        color={_robotColor}
        style={{ position: 'absolute', top: 2, right: 2, zIndex: 2 }}
      />
    );
  } else if (isActive && variant === 'mic') {
    extraIcon = (
      <MaterialCommunityIcons
        name="microphone"
        size={20}
        color={_robotColor}
        style={{ position: 'absolute', top: 2, right: 2, zIndex: 2 }}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: _buttonColor },
          disabled && styles.buttonDisabled,
          isRecording && styles.buttonRecording,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={28}
          color={_robotColor}
        />
        {/* Extra icono arriba a la derecha, sin fondo */}
        {extraIcon}
      </TouchableOpacity>

      {/* Tooltip */}
      {showTooltip && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity: tooltipAnim,
              transform: [{ scale: tooltipAnim }],
            },
          ]}
        >
          <Text style={styles.tooltipText}>{description}</Text>
          <View style={styles.tooltipArrow} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(156, 163, 175, 0.9)',
  },
  buttonRecording: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    transform: [{ scale: 1.1 }],
  },
  tooltip: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: 18,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'rgba(0, 0, 0, 0.85)',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
}); 