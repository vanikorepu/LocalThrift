import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { HomeStackScreenProps } from '../../type';

function SellerHomePage({ navigation, route }: HomeStackScreenProps<'SellerHomePage'>): JSX.Element {
  return (
    <SafeAreaView>
      <View >
        <Text>Seller Home</Text>
      </View>
    </SafeAreaView>
  );
}

export default SellerHomePage;