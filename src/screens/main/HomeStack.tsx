import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackScreenProps, TabScreenProps, HomeStackParamList } from '../../types';
import { ACCENT, BACKGROUND, BORDER, FONT, MUTED_TEXT, SURFACE } from '../../settings';
import { ImagesAssets } from '../../../assets/images/image_assest';
import Category from '../../data/category.json';

import BuyerHomePage from './BuyerHome';
import SellerHomePage from './SellerHome';
import ProductListPage from './ProductList';

function HomePage({ navigation }: HomeStackScreenProps<'HomePage'>): JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>LOCALTHRIFT</Text>
        <Text style={styles.sub}>What are you up to today?</Text>
      </View>

      {/* Action cards */}
      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.push('BuyerHomePage')}>
          <ImageBackground source={ImagesAssets.buying} style={styles.cardBg} resizeMode="cover">
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Shop</Text>
              <Text style={styles.cardDesc}>Browse what's available</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.push('SellerHomePage', { reload: true })}>
          <ImageBackground source={ImagesAssets.selling} style={styles.cardBg} resizeMode="cover">
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Sell</Text>
              <Text style={styles.cardDesc}>List your clothes</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStack({ navigation }: TabScreenProps<'Home'>): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        cardStyle: { backgroundColor: BACKGROUND },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: BACKGROUND },
        animationEnabled: false,
        headerTitleStyle: styles.headerTitle,
      }}>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="BuyerHomePage"
        component={BuyerHomePage}
        options={{
          headerShown: true,
          headerTitle: 'Shop',
          gestureEnabled: false,
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="ProductListPage"
        component={ProductListPage}
        options={({ route }) => ({
          title: Category[route.params.category] ?? 'Products',
          headerShown: true,
          gestureEnabled: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TabNavigationRoutes', {
                  screen: 'Home',
                  params: { screen: 'BuyerHomePage' },
                })
              }>
              <Text style={styles.backBtn}>‹</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="SellerHomePage"
        component={SellerHomePage}
        options={{
          headerShown: true,
          headerTitle: 'My Listings',
          gestureEnabled: false,
          headerLeft: () => <></>,
          headerRight: () => (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                navigation.push('UploadPage', {
                  state: 'post',
                  product: undefined,
                  product_id: undefined,
                })
              }>
              <Text style={styles.addBtnText}>+ New</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontWeight: '600', fontSize: 17, color: '#111' },
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  brand: { fontSize: 13, fontFamily: FONT, letterSpacing: 3, color: ACCENT, marginBottom: 8 },
  sub: { fontSize: 26, fontWeight: '700', color: '#111', lineHeight: 32 },
  cards: { flex: 1, paddingHorizontal: 20, paddingBottom: 100, gap: 12 },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardBg: { flex: 1 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  cardLabel: { fontSize: 26, fontWeight: '700', color: 'white' },
  cardDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  backBtn: { fontSize: 30, marginLeft: 16, color: '#111' },
  addBtn: {
    marginRight: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: ACCENT,
    borderRadius: 8,
  },
  addBtnText: { color: 'white', fontSize: 14, fontWeight: '600' },
});

export default HomeStack;
