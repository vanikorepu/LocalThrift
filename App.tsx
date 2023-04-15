/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity
} from 'react-native';


import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashPage from './src/pages/splash';
import LoginPage from './src/pages/login';
import RegisterPage from './src/pages/register';
import TabNavigationRoutes from './src/pages/tab_navigation_routes';
import UploadPage from './src/pages/tab_pages/upload';
import Summary from './src/pages/tab_pages/summary';
import ProductDescriptionPage from './src/pages/tab_pages/product_description';

import { RootStackParamList } from './src/type';

import { FONT } from './assets/setting';

import setDefaultProps from 'react-native-simple-default-props'

import Category from './data/category.json'

const defaultText = {
  style: [{fontFamily: FONT}],
};

setDefaultProps(Text, defaultText)

function Auth(): JSX.Element {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{cardStyle: { backgroundColor: 'white' }}}
    >
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          cardStyle: { backgroundColor: 'white' }
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            headerShown: false, 
          }}
        />
        <Stack.Screen
          name="TabNavigationRoutes"
          component={TabNavigationRoutes}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="UploadPage"
          component={UploadPage}
          options={{
              presentation: 'modal',
              animationEnabled: false,
              headerTitleStyle: styles.headerTitle,
              // animationTypeForReplace: 'pop',
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "Upload",
              gestureEnabled: false, 
              headerLeft: () => <></>,
          }}
          />
        <Stack.Screen
          name="Summary"
          component={Summary}
          options={{
              presentation: 'modal',
              animationEnabled: false,
              headerTitleStyle: styles.headerTitle,
              // animationTypeForReplace: 'pop',
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "Post Summary",
              gestureEnabled: false, 
              headerLeft: () => <></>,
          }}
          />
        <Stack.Screen
          name="ProductDescriptionPage"
          component={ProductDescriptionPage}
          options={
            ({ route }) => ({ 
            title: Category[route.params.category],
            headerShown: true,
            gestureEnabled: false, 
            headerShadowVisible: false,
            headerTitleStyle: styles.headerTitle,
            headerLeft: () =>  <></>,
          })}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'normal',
  },
});

export default App;
