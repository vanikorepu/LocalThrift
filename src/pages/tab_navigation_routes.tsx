import React, {useEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



import HomePage from './tab_pages/home';
import CartPage from './tab_pages/cart';
import ProfilePage from './tab_pages/profile';

import { RootStackScreenProps, TabParamList } from '../type';

import { COLOR, FONT, CLICK_COLOR } from '../../assets/setting';

import Home from '../../assets/icons/home.svg';
import Profile from '../../assets/icons/profile.svg';
import Cart from '../../assets/icons/cart.svg';

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigationRoutes({ navigation, route }: RootStackScreenProps<'TabNavigationRoutes'>): JSX.Element {

  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarStyle: styles.tabBar,
        headerShadowVisible: false,
      }}
      sceneContainerStyle={{backgroundColor: 'white'}}
    >
      <Tab.Screen 
        name="Home" 
        component={HomePage} 
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Home style={{width: size, height: size}} fill={color} />
          ),
          tabBarActiveTintColor: CLICK_COLOR,
          tabBarInactiveTintColor: 'white',
          // unmountOnBlur: true,
        }}
        />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage} 
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Profile style={{width: size, height: size}} fill={color}/>
          ),
          tabBarActiveTintColor: CLICK_COLOR,
          tabBarInactiveTintColor: 'white',
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartPage} 
        options={{
          headerShown: true,
          headerTitle: "Shopping Cart",
          headerTitleStyle: styles.headerTitle,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Cart style={{width: size, height: size}} fill={color}/>
          ),
          tabBarActiveTintColor: CLICK_COLOR,
          tabBarInactiveTintColor: 'white',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'normal',
  },
  tabBar: {
    backgroundColor: COLOR,
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 30,
    fontFamily: FONT,
  }
});

export default TabNavigationRoutes;