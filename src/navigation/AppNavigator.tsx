import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import SplashPage from '../screens/auth/Splash';
import LoginPage from '../screens/auth/Login';
import RegisterPage from '../screens/auth/Register';
import TabNavigator from './TabNavigator';
import ProductDescriptionPage from '../screens/main/ProductDetail';
import UploadPage from '../screens/main/Upload';
import Summary from '../screens/main/Summary';
import ProfileEditPage from '../screens/main/ProfileEdit';
import ChatRoomPage from '../screens/main/ChatRoom';
import CheckoutPage from '../screens/main/Checkout';

const Stack = createStackNavigator<RootStackParamList>();

const HEADER = {
  headerStyle: { backgroundColor: '#F8F7F4' },
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17, color: '#111' },
  headerBackTitleVisible: false,
  headerTintColor: '#111',
};

function AppNavigator(): JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashPage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="TabNavigationRoutes" component={TabNavigator} />
      <Stack.Screen
        name="ProductDescriptionPage"
        component={ProductDescriptionPage}
        options={{ headerShown: true, headerTitle: 'Product Details', ...HEADER }}
      />
      <Stack.Screen
        name="UploadPage"
        component={UploadPage}
        options={{ headerShown: true, ...HEADER }}
      />
      <Stack.Screen
        name="Summary"
        component={Summary}
        options={{ headerShown: true, headerTitle: 'Summary', ...HEADER }}
      />
      <Stack.Screen
        name="ProfileEditPage"
        component={ProfileEditPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomPage}
        options={{ headerShown: true, ...HEADER }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutPage}
        options={{ headerShown: true, headerTitle: 'Checkout', ...HEADER }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
