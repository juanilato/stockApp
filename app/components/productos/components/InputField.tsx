import React, { useEffect, useState } from 'react';
import { Animated, TextInput, View } from 'react-native';
import { styles } from '../styles';
import { InputFieldProps } from '../types';

export function InputField({ label, value, onChangeText, keyboardType = 'default' }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = new Animated.Value(value ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 0,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [15, -8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 13],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ['#94a3b8', '#2563eb'],
    }),
    backgroundColor: 'transparent',
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={[styles.input, { color: '#1e293b' }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType}
        placeholder=""
      />
    </View>
  );
} 