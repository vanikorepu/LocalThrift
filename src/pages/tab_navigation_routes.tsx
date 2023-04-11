import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomePage from './tab_pages/home';
import CartPage from './tab_pages/cart';

const Tab = createBottomTabNavigator();


function TabNavigationRoutes(): JSX.Element {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Cart" component={CartPage} />
    </Tab.Navigator>
  );
}

export default TabNavigationRoutes;