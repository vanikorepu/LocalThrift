import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  Image, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../../types';
import { COLOR, FONT } from '../../settings';
import MeetingPoint from '../../data/meeting_point.json';
import { GetProduct, AddItemToCart, GetUserProfile, GetImage, CreateRoom } from '../../api/api';

const { width } = Dimensions.get('window');

function ProductDescriptionPage({ navigation, route }: RootStackScreenProps<'ProductDescriptionPage'>): JSX.Element {
  const product_id = route.params.product;
  const [user_id, setUser] = useState('');
  const [load, setLoad] = useState(false);
  const [product, setProduct] = useState<any>({});
  const [seller, setSeller] = useState<any>({});
  const [imgIndex, setImgIndex] = useState(0);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    const p = await GetProduct(product_id);
    const s = await GetUserProfile(p.seller_id ?? p.seller);
    setProduct(p);
    setSeller(s);
    setUser(id ?? '');
    setLoad(true);
  };

  useEffect(() => { fetchData(); }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('TabNavigationRoutes', {
              screen: 'Home',
              params: {
                screen: 'ProductListPage',
                params: { category: route.params.category, reload: false },
              },
            })
          }>
          <Text style={styles.backBtn}>‹</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const addToCart = async (itemId: string) => {
    await AddItemToCart(itemId, user_id);
    navigation.navigate('TabNavigationRoutes', {
      screen: 'Home',
      params: { screen: 'ProductListPage', params: { category: route.params.category, reload: true } },
    });
  };

  const messageSeller = async () => {
    const seller_id = product.seller_id ?? product.seller;
    const room = await CreateRoom(user_id, seller_id, product._id ?? product_id);
    if (!room) return;
    navigation.navigate('ChatRoom', {
      room_id: room.id,
      other_name: seller?.name ?? 'Seller',
      product_brand: product.brand ?? '',
    });
  };

  if (!load) return <View />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Image carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ height: width * 0.8, maxHeight: 350 }}
        onMomentumScrollEnd={e => {
          setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}>
        {product.images.map((img: any, i: number) => (
          <Image
            key={i}
            source={{ uri: GetImage(img.name) }}
            style={{ width, height: width * 0.8, maxHeight: 350 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {product.images.length > 1 && (
        <View style={styles.dots}>
          {product.images.map((_: any, i: number) => (
            <View key={i} style={[styles.dot, i === imgIndex && styles.dotActive]} />
          ))}
        </View>
      )}

      <View style={styles.info}>
        <View style={{ width: '100%' }}>
          <Text style={styles.text}>Price: ${product.price}</Text>
          <Text style={styles.text}>Size: {product.size}</Text>
          <Text style={styles.text}>Brand: {product.brand}</Text>
          <Text style={styles.text}>Usage: {product.usage}</Text>
          <Text style={styles.text}>Sold by: {seller?.name}</Text>
          <Text style={styles.text}>Meeting point: {MeetingPoint[product.meeting]}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cartButton]}
            activeOpacity={0.5}
            onPress={() => addToCart(product._id ?? product_id)}>
            <Text style={styles.buttonText}>🛒 Add to Bag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.msgButton]}
            activeOpacity={0.5}
            onPress={messageSeller}>
            <Text style={[styles.buttonText, styles.msgButtonText]}>💬 Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { fontSize: 30, marginLeft: 15, color: 'black' },
  container: { flex: 1, alignContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc', marginHorizontal: 3 },
  dotActive: { backgroundColor: COLOR },
  info: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR,
    paddingTop: 20,
    alignItems: 'center',
  },
  text: { color: 'white', marginLeft: 30, marginVertical: 3, fontSize: 15, fontWeight: '400' },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 148,
    height: 36,
  },
  cartButton: { backgroundColor: 'white' },
  msgButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  buttonText: { color: COLOR, fontWeight: '600', fontSize: 14 },
  msgButtonText: { color: 'white' },
});

export default ProductDescriptionPage;
