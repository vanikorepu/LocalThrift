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
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomePage} 
        options={{headerShown: false,}}
        listeners={() => ({
          tabPress: (e) => {
            navigation.reset({
              index: 0,
              routes: [{name: 'HomePage'}],
            })
          },
        })}
        />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage} 
        listeners={() => ({
          tabPress: (e) => {
            navigation.reset({
              index: 0,
              routes: [{name: 'ProfilePage'}],
            })
          },
        })}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartPage} 
      />
    </Tab.Navigator>
  );
}

export default TabNavigationRoutes;