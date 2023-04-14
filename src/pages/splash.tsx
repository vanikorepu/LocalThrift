import React, {useEffect, useState} from 'react';

import {SafeAreaView, StyleSheet, Text, View, Image} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../type';

import { ImagesAssets } from '../../assets/images/image_assest';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

type Props = {
  navigation: NavigationProp;
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
    <SafeAreaView style={styles.container}>
        <Image source={ImagesAssets.logo} style={styles.image} resizeMode='cover'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'cover',
    }
});

export default SplashPage;