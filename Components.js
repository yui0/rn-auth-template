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
  TextProps,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
//import * as Animatable from 'react-native-animatable';
// https://colors.eva.design/
const theme = require('./theme-orange.json');

const theme_styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    marginLeft: 0,
    marginRight: 0,
  },
  h2: {
    fontSize: 24,
    marginLeft: 0,
    marginRight: 0,
  },
  h3: {
    fontSize: 18,
    marginLeft: 0,
    marginRight: 0,
  },
  h4: {
    fontSize: 16,
    marginLeft: 0,
    marginRight: 0,
  },
  h5: {
    fontSize: 13,
    marginLeft: 0,
    marginRight: 0,
  },
  h6: {
    fontSize: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  s1: {
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 0,
    marginRight: 0,
  },
  c1: {
    fontSize: 15,
    marginLeft: 0,
    marginRight: 0,
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 0,
    marginRight: 0,
  },
  center: {
    textAlign: "center",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  left: {
    textAlign: "left",
    alignItems: "flex-start",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  right: {
    textAlign: "right",
    alignItems: "flex-end",
    alignContent: "flex-end",
    justifyContent: "flex-end",
  },
  bold: {
    fontWeight: "bold",
  },
});

// https://github.com/WrathChaos/react-native-custom-text/tree/master
interface STextProps extends TextProps {
    children: React.ReactNode,
}
export function SText({children, c, style, ...props}: STextProps) {
  return (
    <Text
      style={[style,
        c==='s1' && theme_styles.s1,
        c==='c1' && theme_styles.c1,
        c==='label' && theme_styles.label
      ]}
    >
      {children}
    </Text>
  );
}

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
        <View style={[styles.button, mode==='flat' && styles.flat]}>
          <Text style={[styles.buttonText, mode==='flat' && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

interface InputProps {
    ph: null,
    act: null,
    ac: 'none',
    oct: null,
}
export function Input({ph, act, ac, v, e, kt, oct, ...props}: InputProps) {
  return (
      <TextInput
        placeholder={ph}
        value={v}
        error={e}
        onChangeText={oct}
        autoCapitalize={ac}
        autoComplete={act}
        keyboardType={kt}
        {...props}
        style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
      />
  );
}

/*const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#f4f6f8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 10,
    color: '#b4b6b8',
  },
  input: {
    color: '#353031',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 3,
    marginRight: 10,
    flex: 1,
  },
  error: {
    backgroundColor: '#cc0011',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
const Error = ({ display = false }) => {
  const viewElement = React.useRef(null);

  React.useEffect(() => {
    if (display) {
      viewElement.current.animate('shake', 500, 'linear');
    } else {
      viewElement.current.animate('bounceOut', 500);
    }
  }, [display]);

  const viewStyles = [styles.error, { opacity: 0 }];

  if (display) {
    viewStyles.push({ opacity: 1 });
  }

  return (
    <Animatable.View style={viewStyles} ref={viewElement}>
      <Text style={styles.errorText}>X</Text>
    </Animatable.View>
  );
};

export function Input({ l, e, ph, act, ac, v, kt, oct, ...props }: InputProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{l}</Text>
      <View style={styles.row}>
        <TextInput
          placeholder={ph}
          returnKeyType="done"
          value={v}
          onChangeText={oct}
          autoCapitalize={ac}
          autoComplete={act}
          keyboardType={kt}
          style={styles.input} {...props} />
        <Error display={e} />
      </View>
    </View>
  );
};*/
