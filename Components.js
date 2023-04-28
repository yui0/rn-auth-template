// ©2023 Yuichiro Nakada
import * as React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// https://colors.eva.design/
const theme = require('./theme-orange.json');

interface ButtonProps {
    children: React.ReactNode,
    mode?: "flat" | "normal",
    onPress: null,
    style: ViewStyle,
}
export function Button({children, onPress, mode, style}: ButtonProps) {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 4,
      padding: 8,
      backgroundColor: theme['color-primary-500'],
    },
    flat: {
      backgroundColor: 'transparent'
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    flatText: {
      color: theme['color-primary-500'],
    },
    pressed: {
      opacity: 0.75,
      backgroundColor: theme['color-primary-100'],
      borderRadius: 4,
    },
  });
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === 'flat' && styles.flat]}>
          <Text style={[styles.buttonText, mode === 'flat' && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
