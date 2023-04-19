import React, {useEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Menu, { MenuItem } from '../components/manu';

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
        name="ProfilePage" 
        component={ProfilePage} 
        options={{
          headerShown: true,
          headerTitle: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Menu 
              style={styles.modal}
              alignment="center"
              topOffset={-10}
              backgroundStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
              trigger={<Profile style={{width: size, height: size}} fill={color}/>}
              >
              <MenuItem
                element={<Text style={styles.buttonText}>Edit Profile</Text>}
                style={[styles.button, {backgroundColor: 'rgb(0, 122, 255)'}]}
                onPress={() => {navigation.push('ProfileEditPage')}}
              />
              <MenuItem
                element={<Text style={styles.buttonText}>Logout</Text>}
              style={[styles.button, {backgroundColor: 'rgb(255, 45, 85)'}]}
              onPress={() => {navigation.push('Auth')}}
              />
            </Menu>
          ),
          tabBarActiveTintColor: CLICK_COLOR,
          tabBarInactiveTintColor: 'white',
          unmountOnBlur: true,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault()
          },
        })}
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
          unmountOnBlur: true,
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
  },
  modal: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    borderRadius: 15,
    width: 350,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default TabNavigationRoutes;