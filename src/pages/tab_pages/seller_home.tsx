import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';


type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductListPage'
>;

type Props = {
  navigation: NavigationProp;
};

function SellerHomePage({navigation}: Props): JSX.Element {
  return (
    <SafeAreaView>
      <View >
        <Text>Seller Home</Text>
      </View>
    </SafeAreaView>
  );
}

export default SellerHomePage;