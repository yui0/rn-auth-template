// ©2023 Yuichiro Nakada
import * as React from 'react';
import {
  Alert,
  //Button,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import Icon from 'react-native-vector-icons/FontAwesome';
//import { BeakerIcon } from '@heroicons/react/24/solid';
//import Icon from 'supercons';

//const theme = require('./theme-orange.json');
const color_primary_100 = "#FFECD2";
const color_primary_400 = "#FF9758";

const AuthContext = React.createContext();

// Components
interface CButtonProps {
    children: React.ReactNode,
    mode?: "flat" | "normal",
    onPress: null,
    style: ViewStyle,
}
function CButton({children, onPress, mode, style}: CButtonProps) {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 4,
      padding: 8,
      backgroundColor: color_primary_400,
    },
    flat: {
      backgroundColor: 'transparent'
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    flatText: {
      color: color_primary_400,
    },
    pressed: {
      opacity: 0.75,
      backgroundColor: color_primary_100,
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

// Landing page
function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={{ flex:1, padding:20, width:'100%', maxWidth:400,
      alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
      <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
      <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Let's start!</Text>
      <Text style={{ marginBottom:12 }}>Your amazing app starts here. Open your favorite code editor and start editing this project.</Text>
      <View style={{ width:'100%' }}>
        <CButton onPress={signOut} style={{ marginTop: 24 }}>SIGN OUT</CButton>
      </View>
    </View>
  );
}

function SplashScreen() {
  const rotation = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    };
  }, [rotation.value]);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      200
    );
    return () => cancelAnimation(rotation);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    spinner: {
      height: 60,
      width: 60,
      borderRadius: 30,
      borderWidth: 7,
      borderTopColor: '#f5f5f5',
      borderRightColor: '#f5f5f5',
      borderBottomColor: '#f5f5f5',
      borderLeftColor: 'blue',
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, animatedStyles]} />
    </View>
  );
}

export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email can't be empty."
  if (!re.test(email)) return 'Ooops! We need a valid email address.'
  return ''
}
export function nameValidator(name) {
  if (!name) return "Name can't be empty."
  return ''
}
export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 5) return 'Password must be at least 5 characters long.'
  return ''
}
function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = React.useState({ value: '', error: '' });

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    navigation.navigate('LoginScreen');
  }

  return (
      <View style={{ flex:1, padding:20, width:'100%', maxWidth:400,
        alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
        <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
        <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Restore Password</Text>
        <TextInput
          placeholder="E-mail address"
          returnKeyType="done"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          description="You will receive email with password reset link."
          style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
        />
        <View style={{ width:'100%' }}>
          <CButton onPress={sendResetPasswordEmail} style={{ marginTop: 16 }}>Send Instructions</CButton>
        </View>
      </View>
  )
}
function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState({ value: '', error: '' })
  const [email, setEmail] = React.useState({ value: '', error: '' })
  const [password, setPassword] = React.useState({ value: '', error: '' })

  const { signUp } = React.useContext(AuthContext);

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    /*navigation.reset({
      index: 0,
      //routes: [{ name: 'Dashboard' }],
      routes: [{ name: 'LoginScreen' }],
    });*/
    signUp(name, email, password);
  }

  return (
      <View style={{ flex:1, padding:20, width:'100%', maxWidth:400,
        alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
        <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
        <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Create Account</Text>
        <TextInput
          placeholder="Name"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
          style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
        />
        <TextInput
          placeholder="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
        />
        <TextInput
          placeholder="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
        />
        <View style={{ width:'100%' }}>
          <CButton onPress={onSignUpPressed} style={{ marginTop: 24 }}>SIGN UP</CButton>
        </View>
        <View style={{ flexDirection:'row', marginTop:4 }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={{ fontWeight:'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}
function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState({ value:'', error:'' })
  const [password, setPassword] = React.useState({ value:'', error:'' })

  const { signIn } = React.useContext(AuthContext);

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    /*if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }*/
    /*navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })*/
    signIn(email.value, password.value);
  }

  return (
      <View style={{ flex:1, padding:20, width:'100%', maxWidth:400,
        alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
        <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
        <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Welcome back!</Text>
        <TextInput
          placeholder="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error:'' })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
        />
        <TextInput
          placeholder="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
        />
        <View style={{ width:'100%', alignItems:'flex-end', marginBottom:24 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordScreen')}>
            <Text style={{ fontSize:13 }}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width:'100%' }}>
          <CButton onPress={onLoginPressed}>LOGIN</CButton>
        </View>
        <View style={{ flexDirection:'row', marginTop:4 }}>
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
            <Text style={{ fontWeight:'bold' }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        //console.log(email);
        // eve.holt@reqres.in
        // cityslicka
        const ENDPOINT = 'https://reqres.in/api/login';
        axios.post(ENDPOINT, {
          email: email,
          password: password
        })
        .then((response) => {
          //console.log(response);
          if (response.status === 200) {
            dispatch({ type:'SIGN_IN', token:response.data.token });
          } else {
            alert('Email or password is incorrect.');
          }
        })
        .catch((error) => {
          alert('Email or password is incorrect. [eve.holt@reqres.in / cityslicka]');
        });

        //dispatch({ type:'SIGN_IN', token:'dummy-auth-token' });
      },
      signOut: () => dispatch({ type:'SIGN_OUT' }),
      signUp: async (name, email, password) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        const req = {
          email: email,
          password: password,
        };
        axios.post('https://reqres.in/api/register', req).then(
          (response) => {
            if (response.status === 200) {
               alert("Registration successful", response.message);
               dispatch({ type:'SIGN_IN', token:'dummy-auth-token' });
            } else {
              alert('An error occurred. Please try again later.');
            }
          },
          (err) => {
            alert('Could not establish connection' ,err.message);
          },
        );

        //dispatch({ type:'SIGN_IN', token:'dummy-auth-token' });
      },
    }),
    []
  );

  // https://ionic.io/ionicons
  const TAB_ICON = {
      Home: 'ios-home',
      Splash: 'ios-snow',
      Settings: 'ios-list',
  };
  const createScreenOptions = ({ route }) => {
      const iconName = TAB_ICON[route.name];
      return {
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ size, color }) => (
              <Ionicons name={iconName} size={size} color={color} />
          )
      };
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Navigator>
            <Stack.Screen name="Splash" component={SplashScreen} />
          </Stack.Navigator>
        ) : state.userToken == null ? (
          // No token found, user isn't signed in
          <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown:false}}>
            <Stack.Screen name="LoginScreen" component={LoginScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          </Stack.Navigator>
        ) : (
          // User is signed in
          <Tab.Navigator initialRouteName="Home" screenOptions={createScreenOptions}>
            <Tab.Screen name="Home" component={HomeScreen}
              options={{
                headerRight: () => (
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 1, paddingTop: 10, paddingBottom: 10, paddingLeft: 10}}
                      onPress={() => authContext.signOut()} >
                      <Ionicons name="ios-log-out-outline" size={24} />
                    </TouchableOpacity>
                  </View>
                )
              }}
            />
            <Tab.Screen name="Splash" component={SplashScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
