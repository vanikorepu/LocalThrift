import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, ScrollView, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabScreenProps, CartGroup } from '../../types';
import { COLOR, CLICK_COLOR, FONT } from '../../settings';
import { RemoveItemFromCart, GetCart, GetImage } from '../../api/api';

function CartPage({ navigation }: TabScreenProps<'Cart'>): JSX.Element {
  let user_id = '';
  const [cart, setCart] = useState<CartGroup[]>([]);
  const [sum, setSum] = useState(0);
  const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(false);

  const fetchData = async () => {
    user_id = (await AsyncStorage.getItem('user_id')) ?? '';
    const _cart = await GetCart(user_id);
    if (!_cart) { setLoad(true); return; }
    setCart(_cart);
    const allProducts = _cart.flatMap((g: CartGroup) => g.products);
    setSum(allProducts.length);
    setTotal(allProducts.reduce((acc: number, p: any) => acc + parseFloat(p.price || '0'), 0));
    setLoad(true);
  };

  useEffect(() => { fetchData(); }, []);

  const trash = async (itemId: string) => {
    await RemoveItemFromCart(itemId, user_id);
    fetchData();
  };

  if (!load) return <View />;

  if (sum === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty!</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() =>
            navigation.navigate('TabNavigationRoutes', {
              screen: 'Home',
              params: { screen: 'BuyerHomePage' },
            })
          }>
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.total}>{sum} item{sum !== 1 ? 's' : ''}</Text>
        <View style={styles.container}>
          {cart.map((group: CartGroup, idx: number) => (
            <View key={idx} style={styles.seller}>
              <View style={styles.products}>
                {group.products.map((item: any, i: number) => (
                  <View key={i} style={styles.itemRow}>
                    <Image
                      style={styles.image}
                      source={{ uri: GetImage(item.images[0].name) }}
                      resizeMode="cover"
                    />
                    <View style={styles.info}>
                      <Text style={styles.brand}>{item.brand}</Text>
                      <Text style={styles.infoText}>Size: {item.size}</Text>
                      <Text style={styles.infoText}>Brand: {item.brand}</Text>
                      <Text style={styles.infoText}>Usage: {item.usage}</Text>
                      <Text style={styles.price}>${item.price}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.trashBtn}
                      onPress={() => trash(item._id)}>
                      <Text style={styles.trashIcon}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed checkout footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerTotal}>Total</Text>
          <Text style={styles.footerAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout', { cart })}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  total: { marginLeft: 16, marginTop: 8, fontSize: 12, color: '#888' },
  container: { alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontFamily: FONT, color: COLOR, marginBottom: 20 },
  shopButton: {
    borderColor: COLOR, borderWidth: 1, borderRadius: 8,
    height: 36, width: 140, alignItems: 'center', justifyContent: 'center',
  },
  shopButtonText: { fontSize: 13, fontWeight: '500', color: COLOR },
  seller: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 4,
  },
  products: {},
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  image: {
    width: 90, height: 90, borderRadius: 8,
    marginRight: 12,
  },
  info: { flex: 1 },
  brand: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 3 },
  infoText: { fontSize: 12, color: '#666', marginVertical: 1 },
  price: { fontSize: 15, fontWeight: '700', color: COLOR, marginTop: 4 },
  trashBtn: { padding: 8 },
  trashIcon: { fontSize: 20 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    paddingBottom: 32,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerTotal: { fontSize: 16, fontWeight: '600', color: '#111' },
  footerAmount: { fontSize: 18, fontWeight: '700', color: COLOR },
  checkoutBtn: {
    backgroundColor: COLOR,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnText: { color: 'white', fontSize: 17, fontWeight: '700', fontFamily: FONT },
});

export default CartPage;
