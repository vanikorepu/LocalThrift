import React, {useEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { Modal } from "../components/modal";
import { TabActions } from '@react-navigation/native';

import HomePage from './tab_pages/home';
import CartPage from './tab_pages/cart';
import ProfilePage from './tab_pages/profile';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';

import { COLOR, FONT } from '../../assets/setting';

import Home from '../../assets/icons/home.svg';
import Profile from '../../assets/icons/profile.svg';
import Cart from '../../assets/icons/cart.svg';


type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'TabNavigationRoutes'
>;

type Props = {
  navigation: NavigationProp;
};

const Tab = createBottomTabNavigator();

function TabNavigationRoutes({navigation}: Props): JSX.Element {

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
            <Home style={{width: size, height: size}} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            navigation.replace('HomePage');
          },
        })}
        />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage} 
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Profile style={{width: size, height: size}} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            navigation.replace('ProfilePage');
          },
        })}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartPage} 
        options={{
          headerShown: true,
          headerTitle: "Shopping Cart",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Cart style={{width: size, height: size}} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            navigation.navigate('Cart');
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLOR,
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 30,
    fontFamily: FONT,
  }
});

export default TabNavigationRoutes;