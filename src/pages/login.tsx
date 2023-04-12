import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: NavigationProp;
};

function LoginPage({navigation}: Props): JSX.Element {
    const handleSubmitPress = () => {
        navigation.replace('TabNavigationRoutes');
    }
  return (
    <SafeAreaView>
      <View>

        <Text>Email</Text>
        <TextInput placeholder="Email" />
        <Text>Password</Text>
        <TextInput placeholder="Password" />

        <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleSubmitPress}>
            <Text>LOGIN</Text>
        </TouchableOpacity>

        <Text>Don't have an account?</Text>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {navigation.replace('Register');}}>
            <Text>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default LoginPage;