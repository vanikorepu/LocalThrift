import React, { useState, createRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';

import { COLOR } from '../settings';

function RegisterPage({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const emailInputRef = createRef<TextInput>();
  const passwordInputRef = createRef<TextInput>();
  const phoneInputRef = createRef<TextInput>();

  const register = async () => {
    // For now, just navigate to TabNavigation
    // Later you can add real registration
    if (name && email && password && phone) {
      navigation.replace('TabNavigation');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ height: '100%', backgroundColor: COLOR }}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🛍️</Text>
        </View>
        <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
        <Text style={[styles.subTitle, styles.text]}>Welcome</Text>

        <TextInput
          placeholder="Full Name"
          autoCapitalize="words"
          style={[styles.input, { marginTop: 10 }]}
          returnKeyType="next"
          onSubmitEditing={() =>
            emailInputRef.current && emailInputRef.current.focus()
          }
          onChangeText={(name) => setName(name)}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          onChangeText={(email) => setEmail(email)}
          ref={emailInputRef}
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() =>
            phoneInputRef.current && phoneInputRef.current.focus()
          }
          onChangeText={(password) => setPassword(password)}
          ref={passwordInputRef}
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
        />
        <TextInput
          placeholder="Mobile Contact"
          inputMode="tel"
          keyboardType="phone-pad"
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          onChangeText={(phone) => setPhone(phone)}
          ref={phoneInputRef}
          style={styles.input}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
        />

        <TouchableOpacity
          style={[styles.button, { width: '80%', marginTop: 10 }]}
          activeOpacity={0.5}
          onPress={register}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={[styles.text, { fontSize: 12, marginTop: 40 }]}>
          Already have an account?
        </Text>
        <TouchableOpacity
          style={[styles.button, { width: '40%' }]}
          activeOpacity={0.5}
          onPress={() => {
            navigation.replace('Login');
          }}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR,
    alignItems: 'center',
    minHeight: '100%',
    paddingVertical: 50,
  },
  logoContainer: {
    marginTop: 50,
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 50,
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
    paddingVertical: 8,
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
    fontWeight: '600',
  },
});

export default RegisterPage;