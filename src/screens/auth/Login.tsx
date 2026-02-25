import React, { useState, useRef } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, TextInput, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Login as LoginAPI } from '../../api/api';
import { ACCENT, BACKGROUND, BORDER, FONT, MUTED_TEXT, SURFACE } from '../../settings';

function LoginPage({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await LoginAPI(email, password);
      if (res?.user?._id) {
        await AsyncStorage.setItem('user_id', res.user._id);
        navigation.replace('TabNavigationRoutes');
      } else {
        Alert.alert('Login failed', res.message || 'Invalid credentials');
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

          {/* Logo mark */}
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>L</Text>
          </View>
          <Text style={styles.wordmark}>LOCALTHRIFT</Text>

          <View style={styles.formSection}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.sub}>Sign in to your account</Text>

            <TextInput
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
              returnKeyType="done"
              onChangeText={setPassword}
              value={password}
            />

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={login}
              disabled={loading}
              activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.replace('Register')}
              activeOpacity={0.85}>
              <Text style={styles.btnSecondaryText}>Create an account</Text>
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

export default LoginPage;
