import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT, ACCENT, BACKGROUND } from '../../settings';

const SplashPage = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoLetter}>L</Text>
      </View>
      <Text style={styles.wordmark}>LOCALTHRIFT</Text>
      <Text style={styles.tagline}>buy · sell · repeat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND,
    gap: 10,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoLetter: { color: 'white', fontSize: 38, fontFamily: FONT },
  wordmark: { fontSize: 20, fontFamily: FONT, color: '#111111', letterSpacing: 4 },
  tagline: { fontSize: 12, color: '#888888', letterSpacing: 2 },
});

export default SplashPage;
