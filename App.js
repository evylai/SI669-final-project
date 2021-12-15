import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Feather } from '@expo/vector-icons';

import {
  useFonts,
  AlegreyaSansSC_100Thin,
  AlegreyaSansSC_100Thin_Italic,
  AlegreyaSansSC_300Light,
  AlegreyaSansSC_300Light_Italic,
  AlegreyaSansSC_400Regular,
  AlegreyaSansSC_400Regular_Italic,
  AlegreyaSansSC_500Medium,
  AlegreyaSansSC_500Medium_Italic,
  AlegreyaSansSC_700Bold,
  AlegreyaSansSC_700Bold_Italic,
  AlegreyaSansSC_800ExtraBold,
  AlegreyaSansSC_800ExtraBold_Italic,
  AlegreyaSansSC_900Black,
  AlegreyaSansSC_900Black_Italic,
} from '@expo-google-fonts/alegreya-sans-sc';

import {
  Hind_300Light,
  Hind_400Regular,
  Hind_500Medium,
  Hind_600SemiBold,
  Hind_700Bold,
} from '@expo-google-fonts/hind';

import {
  NanumGothic_400Regular,
  NanumGothic_700Bold,
  NanumGothic_800ExtraBold,
} from '@expo-google-fonts/nanum-gothic';

import { LoginScreen } from './LoginScreen';
import { HomeScreen } from './HomeScreen';
import { SearchScreen } from './SearchScreen';
import { PlaylistScreen } from './PlaylistScreen';
import { ProfileScreen } from './ProfileScreen';


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Tabs() {
  return(
    <Tab.Navigator
      initialRouteName="Home"
      activeColor='#A3515A'
      inactiveColor='#E2E3E5'
      labeled={false}
      barStyle={{ backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.15, shadowOffset: {width: 0, height: 8}, elevation: 10}}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon:({color})=>(
            <Feather name="home" size={24} color={color} />
          )
        }}/>
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon:({color})=>(
            <Feather name="search" size={24} color={color} />
          )
        }}/>
      <Tab.Screen 
        name="Playlist" 
        component={PlaylistScreen}
        options={{
          tabBarIcon:({color})=>(
            <Feather name="list" size={24} color={color} />
          )
        }}/>
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon:({color})=>(
            <Feather name="user" size={24} color={color} />
          )
        }}/>
    </Tab.Navigator>
  )
}
function App() {
  let [fontsLoaded] = useFonts({
    AlegreyaSansSC_100Thin,
    AlegreyaSansSC_100Thin_Italic,
    AlegreyaSansSC_300Light,
    AlegreyaSansSC_300Light_Italic,
    AlegreyaSansSC_400Regular,
    AlegreyaSansSC_400Regular_Italic,
    AlegreyaSansSC_500Medium,
    AlegreyaSansSC_500Medium_Italic,
    AlegreyaSansSC_700Bold,
    AlegreyaSansSC_700Bold_Italic,
    AlegreyaSansSC_800ExtraBold,
    AlegreyaSansSC_800ExtraBold_Italic,
    AlegreyaSansSC_900Black,
    AlegreyaSansSC_900Black_Italic,
    Hind_300Light,
    Hind_400Regular,
    Hind_500Medium,
    Hind_600SemiBold,
    Hind_700Bold,
    NanumGothic_400Regular,
    NanumGothic_700Bold,
    NanumGothic_800ExtraBold,
  });


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"   
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          <Stack.Screen name="Tabs" component={Tabs} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;