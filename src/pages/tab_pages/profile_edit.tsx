import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { ProfileStackScreenProps } from '../../type';

import BuyerProfile from '../../../data/buyer_profile.json';

function ProfileEditPage({ navigation, route }: ProfileStackScreenProps<'ProfileEditPage'>): JSX.Element {
  const user = BuyerProfile;
  
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