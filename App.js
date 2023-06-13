// ©2023 Yuichiro Nakada
import * as React from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
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
import 'react-native-gesture-handler'; // for iOS, Android
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {
  alert,
  Button,
  Card,
  EList,
  Input,
} from './Components';

// https://colors.eva.design/
const theme = require('./theme-orange.json');

// https://ionic.io/ionicons
import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from "react-native-crypto-js";
import axios from 'axios';
// eve.holt@reqres.in
// cityslicka
axios.defaults.baseURL = 'https://reqres.in/api';
//axios.defaults.baseURL = 'https://berry0.shop/api.php';
//axios.defaults.withCredentials = true; // reqres is NOT support
//import { BeakerIcon } from '@heroicons/react/24/solid';
//import Icon from 'supercons';

import { LicenseScreen } from './LicenseScreen';

// for Authentication
const AuthContext = React.createContext();
const secretKey = "some-unique-key";

async function getItem(key) {
  const ecryptedData = await AsyncStorage.getItem(key);
  return CryptoJS.AES.decrypt(ecryptedData, secretKey).toString(CryptoJS.enc.Utf8);
}
async function setItem(key, value) {
  await AsyncStorage.setItem(key, CryptoJS.AES.encrypt(value, secretKey).toString());
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
        <Button onPress={signOut} style={{ marginTop:24 }}>SIGN OUT</Button>
      </View>
    </View>
  );
}

function ListScreen() {
  const getData = async () => {
    const res = await axios.get('/users');
    /*res.data.records.unshift(['#','user','email','password']);
    //console.log(res.data);
    return res.data.records;*/

    // reqres
    let a = [];
    for (let d of res.data.data) {
      a.push(Object.values(d));
    }
    //console.log(a);
    return a;
  };
  function delData(id/*, point*/) {
    alert(
      '確認',
      'このデータを消しますか',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          console.log('OK Pressed')
          axios.delete('/users/'+id).then((res) => {
            /*if (window.id) {
              axios.get('/data?filter=uid,eq,'+window.id).then((res) => {
                let d = res.data.data.records;
                if (d.length>0) {
                  console.log(d[0][3]);
                  point = d[0][3] -point;
                  axios.put('/data/'+d[0][0], {shop:1, point:point}).then((res) => {
                    console.log(res);
                  });
                }
              });
            }*/
            getData();
          });
        }},
      ]
    );
  }
  return (
    <View style={{ flex:1 }}>
      <EList getData={() => getData()} delData={() => delData()} />
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
      borderTopColor: theme['color-primary-100'],
      borderRightColor: theme['color-primary-100'],
      borderBottomColor: theme['color-primary-100'],
      borderLeftColor: theme['color-primary-500'],
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, animatedStyles]} />
    </View>
  );
}

// Login page
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
  const [email, setEmail] = React.useState({ value:'', error:'' });

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error:emailError });
      return;
    }
    navigation.navigate('LoginScreen');
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex:1, padding:20, width:'100%', maxWidth:400,
      alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
      <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
      <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Restore Password</Text>
      <Input
        placeholder="E-mail"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value:text, error:'' })}
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
        <Button onPress={sendResetPasswordEmail} style={{ marginTop:16 }}>Send Instructions</Button>
      </View>
      <View style={{ flexDirection:'row', marginTop:4 }}>
        <Text>Back to Login Screen? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={{ fontWeight:'bold' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    <KeyboardAvoidingView behavior="padding" style={{ flex:1, padding:20, width:'100%', maxWidth:400,
      alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
      <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
      <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Create Account</Text>
      <Input
        placeholder="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
        style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
      />
      <Input
        placeholder="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value:text, error:'' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
      />
      <Input
        placeholder="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value:text, error:'' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
      />
      <View style={{ width:'100%' }}>
        <Button onPress={onSignUpPressed} style={{ marginTop:24 }}>SIGN UP</Button>
      </View>
      <View style={{ flexDirection:'row', marginTop:4 }}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={{ fontWeight:'bold' }}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    <KeyboardAvoidingView behavior="padding" style={{ flex:1, padding:20, width:'100%', maxWidth:400,
      alignSelf:'center', alignItems:'center', justifyContent:'center' }}>
      <Image source={require('./assets/icon.png')} style={{ width:256, height:256, marginBottom:8 }} />
      <Text style={{ fontSize:21, fontWeight:'bold', paddingVertical:12 }}>Welcome back!</Text>
      <Input
        placeholder="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value:text, error:'' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={{ borderColor:"gray", width:"100%", borderWidth:1, borderRadius:10, padding:10, marginBottom:12 }}
      />
      <Input
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
        <Button onPress={onLoginPressed}>LOGIN</Button>
      </View>
      <View style={{ flexDirection:'row', marginTop:4 }}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={{ fontWeight:'bold' }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const BottomTabStack = () => {
  // https://ionic.io/ionicons
  const TAB_ICON = {
    Home: 'ios-home',
    Splash: 'ios-snow',
    Settings: 'ios-list',
  };
  const createScreenOptions = ({ route }) => {
    const iconName = TAB_ICON[route.name];
    return {
      headerShown: false,
      tabBarActiveTintColor: theme['color-primary-500'],
      tabBarInactiveTintColor: theme['color-primary-300'],
      tabBarIcon: ({ size, color }) => (
        <Ionicons name={iconName} size={size} color={color} />
      )
    };
  };
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={createScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Splash" component={SplashScreen} />
    </Tab.Navigator>
  );
};
const HomeScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="BottomTabStack" component={BottomTabStack} />
    </Stack.Navigator>
  );
};
const SettingScreenStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SecondPage"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="SettingScreen" component={SplashScreen} />
    </Stack.Navigator>
  );
};
const CustomSidebarMenu = (props) => {
  const { signOut } = React.useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex:1 }}>
      <View style={{ marginTop:40, marginBottom:20 }}>
        <Image
          source={require('./assets/apple-touch-icon.png')}
          style={{ width:32, height:32, resizeMode:'center', alignSelf:'center', borderRadius:100/2}}
        />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}  />
        <DrawerItem
          label="About"
          icon={({focused, color, size}) => <Ionicons color={color} size={size} name={focused ? 'heart' : 'heart-outline'} /> }
          onPress={() => Linking.openURL('https://berry-japan.com')}
        />
        <DrawerItem
          label="Sign Out"
          icon={({focused, color, size}) => <Ionicons color={color} size={size} name={focused ? 'log-out' : 'log-out-outline'} /> }
          onPress={() => signOut()}
        />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};
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
        //userToken = await AsyncStorage.getItem('userToken');
        userToken = await getItem('userToken');
        axios.defaults.headers['X-Authorization'] = `Bearer ${userToken}`;
        axios.defaults.headers['X-XSRF-TOKEN'] = await getItem('XSRF-TOKEN');
        dispatch({ type:'RESTORE_TOKEN', token:userToken });
      } catch (e) {
        // Restoring token failed
        console.log('Restoring token failed: '+userToken);
        dispatch({ type:'RESTORE_TOKEN', token:userToken });
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      //dispatch({ type:'RESTORE_TOKEN', token:userToken });
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

        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('XSRF-TOKEN');
        axios.post('/login', {
          email: email,
          user: email, // for berry
          password: password
        }).then((response) => {
          //console.log(response);
          if (response.status === 200) {
            try {
              setItem('userToken', response.data.token);
              axios.defaults.headers['X-Authorization'] = `Bearer ${response.data.token}`;
              axios.post('/', {token:response.data.token}).then(function (response) {
                setItem('XSRF-TOKEN', response.data);
                axios.defaults.headers['X-XSRF-TOKEN'] = response.data;
              }).catch(function (e) {
                console.log(e);
              });
              //setItem('AUTH-TOKEN', response.data.token);
            } catch (e) {
              console.log(e);
            }
            dispatch({ type:'SIGN_IN', token:response.data.token });
          } else {
            alert('Email or password is incorrect.');
          }
        }).catch((error) => {
          alert('Email or password is incorrect. [eve.holt@reqres.in / cityslicka]');
        });

        //dispatch({ type:'SIGN_IN', token:'dummy-auth-token' });
      },
      signOut: () => {
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('XSRF-TOKEN');
        dispatch({ type:'SIGN_OUT' });
      },
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
            alert('Could not establish connection', err.message);
          },
        );

        //dispatch({ type:'SIGN_IN', token:'dummy-auth-token' });
      },
    }),
    []
  );

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
          <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown:false }}>
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
          <Drawer.Navigator
            drawerContent={(props) => <CustomSidebarMenu {...props} />}
            screenOptions={{
              drawerType: "slide",
              headerStyle: {
                backgroundColor: theme['color-primary-500'], // Set Header color
              },
              headerTintColor: '#fff', // Set Header text color
              drawerActiveTintColor: theme['color-primary-500']
            }}>
            <Drawer.Screen
              name="HomeScreenStack"
              options={{
                drawerLabel: 'Home',
                title: 'Home',
                drawerIcon: ({focused, color, size}) => (<Ionicons name="ios-home" size={size} color={color} />),
              }}
              component={HomeScreenStack}
            />
            <Drawer.Screen
              name="SettingScreenStack"
              options={{
                drawerLabel: 'Setting',
                title: 'Setting',
                drawerIcon: ({focused, color, size}) => (<Ionicons name="ios-snow" size={size} color={color} />),
              }}
              component={SettingScreenStack}
            />
            <Drawer.Screen
              name="ListScreen"
              options={{
                drawerLabel: 'List',
                title: 'List',
                drawerIcon: ({focused, color, size}) => (<Ionicons name="ios-snow" size={size} color={color} />),
              }}
              component={ListScreen}
            />
            <Drawer.Screen
              name="LicenseScreen"
              options={{
                drawerLabel: 'License',
                title: 'License',
                drawerIcon: ({focused, color, size}) => (<Ionicons name="ios-document-text" size={size} color={color} />),
              }}
              component={LicenseScreen}
            />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
