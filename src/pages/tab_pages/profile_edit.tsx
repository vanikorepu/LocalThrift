import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';


type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProfilePage'
>;

type Props = {
  navigation: NavigationProp;
};

function ProfileEditPage({navigation}: Props): JSX.Element {
  return (
    <SafeAreaView>
      <View >
        <Text>Profile Edit</Text>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push('ProfilePage')}>
            <Text>SAVE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default ProfileEditPage;