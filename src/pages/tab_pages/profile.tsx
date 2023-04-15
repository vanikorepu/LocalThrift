import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import ProfileEditPage from './profile_edit';

import { createStackNavigator } from '@react-navigation/stack';
import { TabScreenProps, ProfileStackScreenProps, ProfileStackParamList } from '../../type';

import BuyerProfile from '../../../data/buyer_profile.json';


function ProfilePage({ navigation, route }: ProfileStackScreenProps<'ProfilePage'>): JSX.Element {
    const user = BuyerProfile;

    return (
        <SafeAreaView>

            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Phone Number: {user.phone}</Text>
    
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.replace('ProfileEditPage')}>
                <Text>EDIT</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.replace('Login')}>
                <Text>LOGOUT</Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
}

const Stack = createStackNavigator<ProfileStackParamList>();

function ProfileStack({ navigation, route }: TabScreenProps<'Profile'>): JSX.Element {
  return (
    <Stack.Navigator 
        initialRouteName="ProfilePage"
        screenOptions={{
            cardStyle: {backgroundColor: 'white'},
            headerShadowVisible: false,
            animationEnabled: false
        }}
    >
        <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{
                headerShown: true,
                headerTitle: "Profile",
                headerTitleStyle: styles.headerTitle,
                gestureEnabled: false, 
                headerLeft: () => <></>
              }}
        />
        <Stack.Screen
            name="ProfileEditPage"
            component={ProfileEditPage}
            options={{
                headerShown: true,
                headerTitle: "Edit Profile",
                headerTitleStyle: styles.headerTitle,
                gestureEnabled: false, 
                headerLeft: () => <></>
              }}
        />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontWeight: 'normal',
    },
});

export default ProfileStack;