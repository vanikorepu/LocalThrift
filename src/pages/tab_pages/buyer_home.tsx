import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';


type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'BuyerHomePage'
>;

type Props = {
  navigation: NavigationProp;
};


function BuyerHomePage({navigation}: Props): JSX.Element {
  return (
    <SafeAreaView>
      <View >
        <Text>Buyer Home</Text>
      </View>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductListPage');}}>
          <Text>TOPS</Text>
      </TouchableOpacity>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductListPage');}}>
          <Text>BOTTOMS</Text>
      </TouchableOpacity>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductListPage');}}>
          <Text>WINTER CLOTHES</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default BuyerHomePage;