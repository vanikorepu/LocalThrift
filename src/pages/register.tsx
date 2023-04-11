import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
  };

function RegisterPage({navigation}: Props): JSX.Element {
  return (
    <SafeAreaView>
      <View >
        <Text>Account ID</Text>
        <TextInput placeholder="Account ID" />
        <Text>Email</Text>
        <TextInput placeholder="Email" />
        <Text>Password</Text>
        <TextInput placeholder="Password" />
        <Text>Contact Number</Text>
        <TextInput placeholder="Contact Number" />
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {navigation.replace('TabNavigationRoutes');}}>
            <Text>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {navigation.replace('Login');}}>
            <Text>back to LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RegisterPage;