import React, { useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface Props extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  style,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

Animated.timing(animatedIsFocused, {
  toValue: isFocused || value ? 1 : 0,
  duration: 300, 
  useNativeDriver: false,
}).start();

const labelStyle = {
  position: 'absolute' as const,
  left: animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [wp('4%'), wp('0.5%')], // se mueve levemente a la izquierda
  }),
  top: animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [hp('4%'), hp('0.2%')], // más sutil, no flota tanto
  }),
  fontSize: animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [RFValue(11), RFValue(10)], // menos salto de tamaño
  }),
  color: animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['#94a3b8', '#2563eb'], // mismo, pero suave por duración
  }),
  paddingHorizontal: wp('1%'),
  zIndex: 1,
};


  return (
    <View style={[styles.container, style && { width: style.width || '100%' }]}>
      <Animated.Text  style={labelStyle} pointerEvents="none">{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, isFocused && styles.inputFocused, style]}
      onFocus={() => {

          setIsFocused(true);
      
      }}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: hp('2.2%'),
    marginBottom: hp('2.5%'),
  },
  input: {
    height: hp('6%'),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: wp('3.5%'),
    paddingHorizontal: wp('4%'),

    fontSize: RFValue(12),
    backgroundColor: '#f9fafb',
    color: '#0f172a',
  },
  inputFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#f8fafc',
  },
});