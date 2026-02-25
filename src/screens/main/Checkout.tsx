import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { RootStackScreenProps, CartGroup } from '../../types';
import { COLOR, CLICK_COLOR, FONT } from '../../settings';
import { CreatePaymentIntent, ConfirmPayment, GetImage } from '../../api/api';

function CheckoutInner({ navigation, route }: RootStackScreenProps<'Checkout'>) {
  const { cart } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState('');

  const allProducts = cart.flatMap((group: CartGroup) => group.products);
  const total = allProducts.reduce((sum, p) => sum + parseFloat(p.price || '0'), 0);

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('user_id') ?? '';
      setUserId(id);
      await setupPaymentSheet(total);
    };
    init();
  }, []);

  const setupPaymentSheet = async (amount: number) => {
    try {
      const { clientSecret, publishableKey } = await CreatePaymentIntent(amount);
      if (!clientSecret) return;

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'LocalThrift',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: { name: 'LocalThrift Buyer' },
      });

      if (!error) setReady(true);
    } catch (e) {
      console.log('Payment setup error:', e);
    }
  };

  const handlePay = async () => {
    if (!ready) return;
    setLoading(true);
    const { error } = await presentPaymentSheet();
    setLoading(false);

    if (error) {
      if (error.code !== 'Canceled') {
        Alert.alert('Payment failed', error.message);
      }
      return;
    }

    // Mark products as sold
    const product_ids = allProducts.map(p => p._id!).filter(Boolean);
    await ConfirmPayment(product_ids, userId);

    Alert.alert(
      'Payment successful!',
      'Your order has been placed. The seller will contact you to arrange pickup.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('TabNavigationRoutes', {
              screen: 'Home',
              params: { screen: 'HomePage' },
            }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Order Summary</Text>

        {cart.map((group: CartGroup, gi: number) => (
          <View key={gi} style={styles.sellerGroup}>
            <Text style={styles.sellerLabel}>Seller {gi + 1}</Text>
            {group.products.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                {item.images && item.images.length > 0 ? (
                  <Image
                    source={{ uri: GetImage(item.images[0].name) }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.itemImage, styles.imageFallback]} />
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemDetail}>Size: {item.size}</Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <Text style={styles.note}>
          Payment processed securely via Stripe. After payment, sellers will contact you to arrange meeting points.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, (!ready || loading) && styles.payBtnDisabled]}
          onPress={handlePay}
          disabled={!ready || loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payBtnText}>Pay ${total.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
        {!ready && !loading && (
          <Text style={styles.setupNote}>Setting up payment...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function CheckoutPage(props: RootStackScreenProps<'Checkout'>) {
  const [publishableKey, setPublishableKey] = useState('');

  useEffect(() => {
    // Fetch publishable key from server
    fetch('http://localhost:3000/payments/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 0.5 }), // minimal amount to get key
    })
      .then(r => r.json())
      .then(data => {
        if (data.publishableKey) setPublishableKey(data.publishableKey);
      })
      .catch(() => {});
  }, []);

  if (!publishableKey) return <View style={{ flex: 1 }} />;

  return (
    <StripeProvider publishableKey={publishableKey}>
      <CheckoutInner {...props} />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scroll: { padding: 20, paddingBottom: 140 },
  heading: { fontSize: 24, fontFamily: FONT, color: COLOR, marginBottom: 20 },
  sellerGroup: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sellerLabel: { fontSize: 12, color: '#888', marginBottom: 8, fontWeight: '500' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  imageFallback: { backgroundColor: '#e0e0e0' },
  itemInfo: { flex: 1 },
  itemBrand: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 2 },
  itemDetail: { fontSize: 13, color: '#666', marginBottom: 2 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: COLOR },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: { fontSize: 18, fontWeight: '600', color: '#111' },
  totalAmount: { fontSize: 22, fontWeight: '700', color: COLOR },
  note: { fontSize: 12, color: '#aaa', lineHeight: 18, textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payBtn: {
    height: 52,
    backgroundColor: COLOR,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnDisabled: { backgroundColor: '#ccc' },
  payBtnText: { color: 'white', fontSize: 18, fontWeight: '700', fontFamily: FONT },
  setupNote: { textAlign: 'center', color: '#aaa', fontSize: 12, marginTop: 6 },
});

export default CheckoutPage;
