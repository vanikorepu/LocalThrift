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

function LoginPage({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordInputRef = createRef<TextInput>();

  const login = async () => {
    // For now, just navigate to Home
    // Later you can add real authentication
    if (email && password) {
      navigation.replace('TabNavigation');
    } else {
      alert('Please enter email and password');
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
          onChangeText={(email) => setEmail(email)}
          style={styles.input}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(password) => setPassword(password)}
          ref={passwordInputRef}
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType="next"
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor={'rgba(255,255,255,0.7)'}
        />

        <TouchableOpacity
          style={[styles.button, { width: '80%', marginTop: 10 }]}
          activeOpacity={0.5}
          onPress={login}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <Text style={[styles.text, { fontSize: 10, fontWeight: '300', marginTop: 3 }]}>
          Forgot password?
        </Text>

        <Text style={[styles.text, { fontSize: 12, marginTop: 60 }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity
          style={[styles.button, { width: '40%' }]}
          activeOpacity={0.5}
          onPress={() => {
            navigation.replace('Register');
          }}
        >
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

export default LoginPage;