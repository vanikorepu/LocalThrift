import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackScreenProps, ImageParamsList } from '../../types';
import EditSvg from '../../../assets/icons/edit.svg';
import SoldSvg from '../../../assets/icons/sold.svg';
import { ACCENT, BACKGROUND, BORDER, MUTED_TEXT, SURFACE } from '../../settings';
import { GetSellerProduct, DeleteProduct, GetImage } from '../../api/api';

function SellerHomePage({ navigation, route }: HomeStackScreenProps<'SellerHomePage'>): JSX.Element {
  const [cols, setCols] = useState<any[][]>([[], []]);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    if (!id) return;
    const products = await GetSellerProduct(id);
    if (!products) return;
    const _cols: any[][] = [[], []];
    products.forEach((p: any, i: number) => _cols[i % 2].push(p));
    setCols(_cols);
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if (route.params.reload) {
      fetchData();
      navigation.setParams({ reload: false });
    }
  }, [route.params.reload]);

  const edit = (id: string, product: any) => {
    const mapped = {
      ...product,
      images: product.images.map((img: ImageParamsList) => ({
        name: img.name,
        type: 'image/' + img.name.split('.')[1],
        uri: GetImage(img.name),
        height: img.height,
        width: img.width,
      })),
    };
    navigation.navigate('UploadPage', { state: 'edit', product: mapped, product_id: id });
  };

  if (cols[0].length === 0 && cols[1].length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No listings yet</Text>
        <Text style={styles.emptyDesc}>Tap "+ New" to list your first item</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {cols.map((items, ci) => (
          <View key={ci} style={styles.col}>
            {items.map((item: any) => (
              <View key={item._id} style={styles.card}>
                <Image source={{ uri: GetImage(item.images[0].name) }} style={styles.cardImage} />
                {/* Price badge */}
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>${item.price}</Text>
                </View>
                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => edit(item._id, item)}>
                    <EditSvg width={16} height={16} fill="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.soldBtn]}
                    onPress={async () => { await DeleteProduct(item._id); fetchData(); }}>
                    <SoldSvg width={16} height={16} fill="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BACKGROUND },
  container: { padding: 20, paddingBottom: 100 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BACKGROUND, gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111' },
  emptyDesc: { fontSize: 14, color: MUTED_TEXT },
  grid: { flexDirection: 'row', gap: 10 },
  col: { flex: 1, gap: 10 },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  cardImage: { width: '100%', aspectRatio: 0.8, resizeMode: 'cover' },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  priceText: { color: 'white', fontSize: 12, fontWeight: '700' },
  actions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldBtn: { backgroundColor: '#111' },
});

export default SellerHomePage;
