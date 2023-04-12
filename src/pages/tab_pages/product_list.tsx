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


function ProductListPage({navigation}: Props): JSX.Element {
  return (
    <SafeAreaView>
      <View >
        <Text>Product List</Text>
      </View>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductDescriptionPage');}}>
          <Text>ITEM 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductDescriptionPage');}}>
          <Text>ITEM 2</Text>
      </TouchableOpacity>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductDescriptionPage');}}>
          <Text>ITEM 3</Text>
      </TouchableOpacity>
      <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {navigation.push('ProductDescriptionPage');}}>
          <Text>ITEM 4</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ProductListPage;