import React, {useEffect, useState} from 'react';

import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

function SplashPage({navigation}: Props): JSX.Element {
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
          setAnimating(false);
          //Check if user_id is set or not
          //If not then send for Authentication
          //else send to Home Screen
          navigation.replace('Auth');
        }, 5000);
      }, []);
      
  return (
    <SafeAreaView>
      <View >
        <Text>Welcome to LocalThrift</Text>
      </View>
    </SafeAreaView>
  );
}

export default SplashPage;