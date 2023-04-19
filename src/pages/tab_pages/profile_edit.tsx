import React, {useState, useEffect, createRef} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackScreenProps, UserProfileParamsList } from '../../type';

import { ImagesAssets } from '../../../assets/images/image_assest';
import {COLOR} from '../../../assets/setting'

import BuyerProfile from '../../../data/buyer_profile.json';

import { GetUserProfile, UpdateUserProfile } from '../../api/api';

function ProfileEditPage({ navigation, route }: RootStackScreenProps<'ProfileEditPage'>): JSX.Element {
    const [user_id, setUser_id] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [load, setLoad] = useState(false);

    const fetchData = async () => {
        const id = await AsyncStorage.getItem('user_id');
        setUser_id(id);
        const user = await GetUserProfile(id);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setLoad(true);
    }

    useEffect(() => {
        fetchData();
     }, [])

    const edit = async () => {
        await UpdateUserProfile(user_id, name, email, phone);
        navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}});
    }
  return !load ? <View></View> : (

  <SafeAreaView style={styles.container}>
      <Image source={ImagesAssets.logo} style={styles.image}/>
      <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
      <Text style={[styles.subTitle, styles.text]}>Edit Profile</Text>
        <TextInput 
        placeholder="Full Name" 
        autoCapitalize='none'
        onChangeText={(name) =>
            setName(name)
        }
        style={[styles.input, {marginTop: 10}]} 
        placeholderTextColor={'white'} value={name}/>
        <TextInput 
        placeholder="Email" 
        autoCorrect={false}
        inputMode='email'
        onChangeText={(email) =>
            setEmail(email)
        }
        autoCapitalize='none'
        keyboardType='email-address'
        style={styles.input} 
        placeholderTextColor={'white'}
        value={email}/>
        <TextInput 
        placeholder="Mobile Contact" 
        inputMode='tel'
        onChangeText={(phone) =>
            setPhone(phone)
        }
        keyboardType='phone-pad'
        style={styles.input} 
        placeholderTextColor={'white'}
        value={phone}/>
      
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
  inputContainer: {
        width: '100%',
        alignItems: 'center',
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