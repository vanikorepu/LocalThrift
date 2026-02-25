import React, { useState, useRef } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, TextInput, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Register as RegisterAPI } from '../../api/api';
import { ACCENT, BACKGROUND, BORDER, FONT, MUTED_TEXT, SURFACE } from '../../settings';

function RegisterPage({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const register = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await RegisterAPI(name, email, password, phone);
      if (res?.user?._id) {
        await AsyncStorage.setItem('user_id', res.user._id);
        navigation.replace('TabNavigationRoutes');
      } else {
        Alert.alert('Registration failed', res.message || 'Please try again');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to server');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>L</Text>
          </View>
          <Text style={styles.wordmark}>LOCALTHRIFT</Text>

          <View style={styles.formSection}>
            <Text style={styles.heading}>Create account</Text>
            <Text style={styles.sub}>Join your campus thrift community</Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={MUTED_TEXT}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              onChangeText={setName}
              value={name}
            />
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={MUTED_TEXT}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={MUTED_TEXT}
              autoCapitalize="none"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              onChangeText={setPassword}
              value={password}
            />
            <TextInput
              ref={phoneRef}
              style={styles.input}
              placeholder="Mobile number"
              placeholderTextColor={MUTED_TEXT}
              keyboardType="phone-pad"
              returnKeyType="done"
              onChangeText={setPhone}
              value={phone}
            />

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={register}
              disabled={loading}
              activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>{loading ? 'Creating…' : 'Sign up'}</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.replace('Login')}
              activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>Sign in instead</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoLetter: { color: 'white', fontSize: 30, fontFamily: FONT },
  wordmark: { fontSize: 16, fontFamily: FONT, color: '#111', letterSpacing: 3, marginBottom: 48 },
  formSection: { width: '100%' },
  heading: { fontSize: 28, fontWeight: '700', color: '#111', marginBottom: 6 },
  sub: { fontSize: 15, color: MUTED_TEXT, marginBottom: 32 },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 12,
  },
  btnPrimary: {
    width: '100%',
    height: 52,
    backgroundColor: '#111',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnDisabled: { backgroundColor: '#999' },
  btnPrimaryText: { color: 'white', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: MUTED_TEXT },
  btnSecondary: {
    width: '100%',
    height: 52,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: { color: '#111', fontSize: 16, fontWeight: '500' },
});

export default RegisterPage;
