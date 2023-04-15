import React, {useLayoutEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';

import { RootStackScreenProps } from '../../type';

function Summary({ navigation, route }: RootStackScreenProps<'Summary'>): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Cancel" onPress={() => {
        navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}})
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