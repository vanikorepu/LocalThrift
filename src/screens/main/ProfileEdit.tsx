import React, { useState, useEffect, createRef } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, TextInput, Image,
} from 'react-native';
import { ImagesAssets } from '../../../assets/images/image_assest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../../types';
import { COLOR, FONT } from '../../settings';
import { GetUserProfile, UpdateUserProfile } from '../../api/api';

function ProfileEditPage({ navigation }: RootStackScreenProps<'ProfileEditPage'>): JSX.Element {
  const [user_id, setUser_id] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [load, setLoad] = useState(false);

  const emailRef = createRef<TextInput>();
  const phoneRef = createRef<TextInput>();

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) return;
      setUser_id(id);
      const user = await GetUserProfile(id);
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setLoad(true);
    })();
  }, []);

  const save = async () => {
    await UpdateUserProfile(user_id, name, email, phone);
    navigation.navigate('TabNavigationRoutes', { screen: 'Home', params: { screen: 'HomePage' } });
  };

  if (!load) return <View />;

  return (
    <SafeAreaView style={styles.container}>
      <Image source={ImagesAssets.logo} style={styles.logo} resizeMode="contain" />
      <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
      <Text style={[styles.subTitle, styles.text]}>Edit Profile</Text>

      <TextInput
        placeholder="Full Name" autoCapitalize="none"
        onChangeText={setName} value={name}
        style={[styles.input, { marginTop: 10 }]}
        placeholderTextColor="white"
        returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()}
      />
      <TextInput
        placeholder="Email" autoCorrect={false} inputMode="email"
        autoCapitalize="none" keyboardType="email-address"
        onChangeText={setEmail} value={email}
        style={styles.input} placeholderTextColor="white"
        ref={emailRef} returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
      />
      <TextInput
        placeholder="Mobile Contact" inputMode="tel" keyboardType="phone-pad"
        onChangeText={setPhone} value={phone}
        style={styles.input} placeholderTextColor="white"
        ref={phoneRef} returnKeyType="done"
      />

      <TouchableOpacity
        style={[styles.button, { width: '80%', marginTop: 10 }]}
        activeOpacity={0.5}
        onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLOR, alignItems: 'center', height: '100%' },
  logo: { marginTop: 50, width: 120, height: 120 },
  text: { color: 'white' },
  title: { marginTop: 10, fontSize: 25, fontFamily: FONT },
  subTitle: { marginVertical: 20, fontSize: 20, fontFamily: FONT },
  input: {
    borderBottomWidth: 1, borderBottomColor: 'white',
    width: '80%', marginVertical: 15,
    color: 'white', fontWeight: '200', paddingVertical: 8,
  },
  button: {
    backgroundColor: 'white', marginVertical: 10,
    height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20,
  },
  buttonText: { color: COLOR, fontSize: 14, fontWeight: '600' },
});

export default ProfileEditPage;
