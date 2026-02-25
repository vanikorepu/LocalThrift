import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  ScrollView, Image, TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenProps } from '../../types';
import { COLOR, CLICK_COLOR, FONT } from '../../settings';
import { GetUserProfile, GetSellerProduct, DeleteProduct, GetImage } from '../../api/api';

function ProfilePage({ navigation }: TabScreenProps<'ProfilePage'>): JSX.Element {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [load, setLoad] = useState(false);

  const fetchData = useCallback(async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    if (!user_id) return;
    const [u, p] = await Promise.all([
      GetUserProfile(user_id),
      GetSellerProduct(user_id),
    ]);
    setUser(u);
    setProducts(p || []);
    setLoad(true);
  }, []);

  useFocusEffect(fetchData);

  const handleDelete = (product_id: string, brand: string) => {
    Alert.alert('Remove listing', `Remove "${brand}" from your listings?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await DeleteProduct(product_id);
          fetchData();
        },
      },
    ]);
  };

  if (!load) return <View style={{ flex: 1, backgroundColor: 'white' }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile card */}
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {products.filter(p => p.sold).length}
            </Text>
            <Text style={styles.statLabel}>Sold</Text>
          </View>
        </View>

        {/* My listings */}
        <Text style={styles.sectionTitle}>My Listings</Text>
        {products.length === 0 ? (
          <Text style={styles.emptyText}>No listings yet. Start selling!</Text>
        ) : (
          products.map((item, i) => (
            <View key={i} style={styles.listingRow}>
              {item.images && item.images.length > 0 ? (
                <Image
                  source={{ uri: GetImage(item.images[0].name) }}
                  style={styles.listingImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.listingImage, styles.imageFallback]} />
              )}
              <View style={styles.listingInfo}>
                <Text style={styles.listingBrand}>{item.brand}</Text>
                <Text style={styles.listingDetail}>Size: {item.size}</Text>
                <Text style={styles.listingPrice}>${item.price}</Text>
                {item.sold ? (
                  <View style={styles.soldBadge}>
                    <Text style={styles.soldBadgeText}>SOLD</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.listingActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    navigation.navigate('UploadPage', {
                      state: 'edit',
                      product: item,
                      product_id: item._id,
                    })
                  }>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item._id, item.brand)}>
                  <Text style={styles.deleteBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  card: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: COLOR,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: 'white', fontSize: 32, fontWeight: '700' },
  name: { color: 'white', fontSize: 22, fontFamily: FONT, marginBottom: 4 },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  phone: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '700', color: COLOR },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#ddd' },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT,
    color: '#111',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  emptyText: { color: '#aaa', textAlign: 'center', padding: 30 },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listingImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  imageFallback: { backgroundColor: '#e0e0e0' },
  listingInfo: { flex: 1 },
  listingBrand: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 2 },
  listingDetail: { fontSize: 12, color: '#666', marginBottom: 2 },
  listingPrice: { fontSize: 14, fontWeight: '700', color: COLOR },
  soldBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#34C759',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: 3,
  },
  soldBadgeText: { color: 'white', fontSize: 10, fontWeight: '700' },
  listingActions: { gap: 8, alignItems: 'center' },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR,
  },
  editBtnText: { color: COLOR, fontSize: 12, fontWeight: '600' },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 18 },
});

export default ProfilePage;
