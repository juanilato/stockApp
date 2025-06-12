import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

interface Props extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedIsFocused]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 14,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [30, -6], // flota hacia arriba
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#94a3b8', '#2563eb'],
    }),
   
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, isFocused && styles.inputFocused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 14, // para no superponer con el label
    fontSize: 15,
    backgroundColor: '#f9fafb',
    color: '#0f172a',
  },
  inputFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#f8fafc',
  },
});
