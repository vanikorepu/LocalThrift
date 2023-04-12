import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import ProfileEditPage from './profile_edit';

import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';


type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProfilePage'
>;

type Props = {
  navigation: NavigationProp;
};

function ProfilePage({navigation}: Props): JSX.Element {
    return (
        <SafeAreaView>
          <View >
            <Text>Account ID: Evana</Text>
            <Text>Email: evana@umass.edu</Text>
            <Text>Phone Number: 123-456-7890</Text>
    
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.replace('ProfileEditPage')}>
                <Text>EDIT</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.replace('Auth')}>
                <Text>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
}

const Stack = createStackNavigator();

function ProfileStack({navigation}: Props): JSX.Element {
  return (
    <Stack.Navigator initialRouteName="ProfilePage">
        <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="ProfileEditPage"
            component={ProfileEditPage}
            options={{
                headerShown: false,
            }}
        />
    </Stack.Navigator>
  );
}

export default ProfileStack;