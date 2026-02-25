import React from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu, { MenuItem } from '../components/Menu';
import HomeStack from '../screens/main/HomeStack';
import HomeSvg from '../../assets/icons/home.svg';
import ProfileSvg from '../../assets/icons/profile.svg';
import CartSvg from '../../assets/icons/cart.svg';
import SmsSvg from '../../assets/icons/sms.svg';
import CartPage from '../screens/main/Cart';
import ProfilePage from '../screens/main/Profile';
import ChatListPage from '../screens/main/ChatList';
import { RootStackScreenProps, TabParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_BG = '#111111';
const TAB_ACTIVE = '#FFFFFF';
const TAB_INACTIVE = 'rgba(255,255,255,0.45)';

function TabNavigator({ navigation }: RootStackScreenProps<'TabNavigationRoutes'>): JSX.Element {
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F8F7F4' },
        headerTitleStyle: styles.headerTitle,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: Math.max(insets.bottom, 10) }],
        tabBarItemStyle: styles.tabItem,
      }}
      sceneContainerStyle={{ backgroundColor: '#F8F7F4' }}>

      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <HomeSvg width={22} height={22} fill={focused ? TAB_ACTIVE : TAB_INACTIVE} />,
        }}
      />

      <Tab.Screen
        name="Messages"
        component={ChatListPage}
        options={{
          headerShown: true,
          headerTitle: 'Messages',
          tabBarIcon: ({ focused }) => <SmsSvg width={22} height={22} fill={focused ? TAB_ACTIVE : TAB_INACTIVE} />,
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartPage}
        options={{
          headerShown: true,
          headerTitle: 'Cart',
          tabBarIcon: ({ focused }) => <CartSvg width={22} height={22} fill={focused ? TAB_ACTIVE : TAB_INACTIVE} />,
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Menu
              style={styles.modal}
              alignment="center"
              topOffset={-10}
              backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              trigger={<ProfileSvg width={22} height={22} fill={focused ? TAB_ACTIVE : TAB_INACTIVE} />}>
              <MenuItem
                element={<Text style={styles.menuItemText}>Edit Profile</Text>}
                style={[styles.menuItem, { backgroundColor: '#111' }]}
                onPress={() => navigation.push('ProfileEditPage')}
              />
              <MenuItem
                element={<Text style={styles.menuItemText}>Log out</Text>}
                style={[styles.menuItem, { backgroundColor: '#E5484D' }]}
                onPress={handleLogout}
              />
            </Menu>
          ),
          unmountOnBlur: true,
        }}
        listeners={() => ({ tabPress: e => e.preventDefault() })}
      />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontWeight: '600', fontSize: 17, color: '#111' },
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    backgroundColor: TAB_BG,
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 12 },
    }),
  },
  tabItem: { borderRadius: 20, marginHorizontal: 4 },
  modal: { width: '100%', alignItems: 'center' },
  menuItem: {
    borderRadius: 12,
    width: 320,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuItemText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default TabNavigator;
