import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from 'react-native';

import { RootStackScreenProps } from '../../type';

import { ImagesAssets } from '../../../assets/images/image_assest';
import {COLOR} from '../../../assets/setting'

import BuyerProfile from '../../../data/buyer_profile.json';


function ProfileEditPage({ navigation, route }: RootStackScreenProps<'ProfileEditPage'>): JSX.Element {
  const user = BuyerProfile;

  const edit = () => {
      // navigation.replace('TabNavigationRoutes', {screen: 'ProfilePage'});
      navigation.goBack();
  }
  return (

  <SafeAreaView style={styles.container}>
      <Image source={ImagesAssets.logo} style={styles.image}/>
      <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
      <Text style={[styles.subTitle, styles.text]}>Edit Profile</Text>

      <TextInput placeholder="Full Name" style={[styles.input, {marginTop: 10}]} placeholderTextColor={'white'} value={user.name}/>
      <TextInput 
          placeholder="Email" 
          autoCorrect={false}
          inputMode='email'
          keyboardType='email-address'
          style={styles.input} 
          placeholderTextColor={'white'}
          value={user.email}/>
      <TextInput 
          placeholder="Mobile Contact" 
          inputMode='tel'
          keyboardType='phone-pad'
          style={styles.input} 
          placeholderTextColor={'white'}
          value={user.phone}/>

      <TouchableOpacity
          style={[styles.button, {width: '80%', marginTop: 10}]}
          activeOpacity={0.5}
          onPress={edit}>
          <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: COLOR,
      alignItems: 'center',
      height: '100%',
  },
  image: {
      marginTop: 50,
      width: 100,
      height: 100,
      borderRadius: 15,
  },
  text: {
      color: 'white',
  },
  title: {
      marginTop: 10,
      fontSize: 25,
      fontWeight: 'normal',
  },
  subTitle: {
      marginVertical: 20,
      fontSize: 20,
      fontWeight: '300',
  },
  input: {
      borderBottomWidth: 1,
      borderBottomColor: 'white',
      width: '80%',
      marginVertical: 15,
      color: 'white',
      fontWeight: '200',
  },
  button: {
      backgroundColor: 'white',
      marginVertical: 10,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
  },
  buttonText: {
      color: COLOR,
      fontSize: 14,
  }
});

export default ProfileEditPage;