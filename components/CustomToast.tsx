// components/CustomToast.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { colors } from '../styles/theme';

interface Props {
  type?: 'success' | 'error' | 'warning';
  message: string;
  onClose?: () => void;
  duration?: number;
}

export default function CustomToast({
  type = 'error',
  message,
  onClose,
  duration = 3000
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(hp(10))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: hp(10),
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onClose?.());
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  const backgroundColor =
    type === 'success' ? colors.success :
    type === 'warning' ? colors.warning :
    colors.danger;

  const iconName =
    type === 'success' ? 'check-circle' :
    type === 'warning' ? 'alert-circle' :
    'close-circle';

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: hp(20),
        left: wp(5),
        width: wp(90),
        backgroundColor,
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: wp(3),
        zIndex: 1000,
        opacity,
        transform: [{ translateY }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(2) }}>
        <MaterialCommunityIcons name={iconName} size={wp(6)} color="#fff" />
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: wp(4),
            flexShrink: 1,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
