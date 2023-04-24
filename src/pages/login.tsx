import React, {useState, createRef} from 'react';

import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootStackScreenProps} from '../type';

import {COLOR} from '../../assets/setting';
import {ImagesAssets} from '../../assets/images/image_assest';

import {Login} from '../api/api';

function LoginPage({
  navigation,
  route,
}: RootStackScreenProps<'Login'>): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordInputRef = createRef<TextInput>();

  const login = async () => {
    //const res = await Login(email, password);

    navigation.replace('TabNavigationRoutes', {
      screen: 'Home',
      params: {screen: 'HomePage'},
    });

    // if (res.state === 1) {
    //   await AsyncStorage.setItem('user_id', res.id);

    // } else {
    //   return;
    // }
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{height: '100%', backgroundColor: COLOR}}>
      <View style={styles.container}>
        <Image source={ImagesAssets.logo} style={styles.image} />
        <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
        <Text style={[styles.subTitle, styles.text]}>Hello</Text>

        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          inputMode="email"
          keyboardType="email-address"
          placeholder="Email"
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          onChangeText={email => setEmail(email)}
          style={styles.input}
          placeholderTextColor={'white'}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={password => setPassword(password)}
          ref={passwordInputRef}
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType="next"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor={'white'}
        />

        <TouchableOpacity
          style={[styles.button, {width: '80%', marginTop: 10}]}
          activeOpacity={0.5}
          onPress={login}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.text,
            {fontSize: 10, fontWeight: '300', marginTop: 3},
          ]}>
          Forgot password?
        </Text>

        <Text style={[styles.text, {fontSize: 12, marginTop: 60}]}>
          Don't have an account?
        </Text>
        <TouchableOpacity
          style={[styles.button, {width: '40%'}]}
          activeOpacity={0.5}
          onPress={() => {
            navigation.replace('Register');
          }}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginVertical: 25,
    fontSize: 20,
    fontWeight: '300',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: '80%',
    marginVertical: 20,
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
  },
});

export default LoginPage;
