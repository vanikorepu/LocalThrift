import React, {useEffect, useState} from 'react';

import {StyleSheet, Text} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
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

import {GetCartCount} from '../api/api'

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigationRoutes({ navigation, route }: RootStackScreenProps<'TabNavigationRoutes'>): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    if (id == null) {
      navigation.navigate('Auth');
    } else {
      const _count = await GetCartCount(id);
      setCount(_count);
    }
  }
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator 
      id="tab"
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
                element={<Text style={[styles.buttonText, {color: 'black'}]}>Edit Profile</Text>}
                style={[styles.button, {backgroundColor: 'white'}]}
                onPress={() => {navigation.push('ProfileEditPage')}}
              />
              <MenuItem
                element={<Text style={[styles.buttonText, {color: 'white'}]}>Logout</Text>}
              style={[styles.button, {backgroundColor: COLOR}]}
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
        initialParams={{setCount: setCount}}
        options={{
          headerShown: true,
          headerTitle: "Shopping Cart",
          headerTitleStyle: styles.headerTitle,
          tabBarShowLabel: false,
          tabBarBadge: count > 0 ? count : undefined,
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
    height: 60,
    justifyContent: 'center',
    borderRadius: 30,
    paddingBottom: 0,
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
    fontSize: 18,
    fontWeight: '500',
  },
});

export default TabNavigationRoutes;