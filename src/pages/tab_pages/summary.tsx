import React, {useLayoutEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';


type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductListPage'
>;

type Props = {
  navigation: NavigationProp;
};

function Summary({navigation}: Props): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Cancel" onPress={() => {
        navigation.navigate('TabNavigationRoutes', {screen: 'Home'})
      }} />
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <View >
        <Text>Summary</Text>
      </View>
    </SafeAreaView>
  );
}

export default Summary;