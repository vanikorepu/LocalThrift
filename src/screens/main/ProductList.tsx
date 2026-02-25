import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, Text, View,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackScreenProps } from '../../types';
import { ACCENT, BACKGROUND, BORDER, MUTED_TEXT, SURFACE } from '../../settings';
import { GetProductList, GetImage } from '../../api/api';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2; // two columns with 20 outer + 8 gap

function ProductListPage({ navigation, route }: HomeStackScreenProps<'ProductListPage'>): JSX.Element {
  const [load, setLoad] = useState(false);
  const [lst, setLst] = useState<any[][]>([[], []]);
  const [order, setOrder] = useState<1 | -1 | 0>(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.sortRow}>
          {(['↑ Price', '↓ Price'] as const).map((label, i) => {
            const val = i === 0 ? 1 : -1;
            return (
              <TouchableOpacity
                key={label}
                style={[styles.sortBtn, order === val && styles.sortBtnActive]}
                onPress={() => setOrder(prev => prev === val ? 0 : val)}>
                <Text style={[styles.sortBtnText, order === val && styles.sortBtnTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ),
    });
  }, [navigation, order]);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    if (!id) return;
    let products = await GetProductList(id, route.params.category);
    if (!products) { setLoad(true); return; }
    if (order !== 0) products.sort((a: any, b: any) => order * (Number(a.price) - Number(b.price)));
    // waterfall split
    const cols: any[][] = [[], []];
    const heights = [0, 0];
    for (const p of products) {
      const ratio = p.images[0]?.height / p.images[0]?.width || 1;
      const col = heights[0] <= heights[1] ? 0 : 1;
      cols[col].push(p);
      heights[col] += ratio;
    }
    setLst(cols);
    setLoad(true);
  };

  useEffect(() => { fetchData(); }, [order]);
  useEffect(() => {
    fetchData();
    navigation.setParams({ reload: false });
  }, [route.params.reload]);

  if (!load) return <View style={styles.empty} />;

  if (lst[0].length === 0 && lst[1].length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🏷</Text>
        <Text style={styles.emptyText}>Nothing here yet</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {lst.map((col, ci) => (
          <View key={ci} style={styles.col}>
            {col.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.push('ProductDescriptionPage', {
                    category: item.category,
                    product: item._id,
                  })
                }>
                <Image
                  source={{ uri: GetImage(item.images[0].name) }}
                  style={[
                    styles.cardImage,
                    { height: CARD_W * (item.images[0].height / item.images[0].width) },
                  ]}
                  resizeMode="cover"
                />
                <View style={styles.cardMeta}>
                  <Text style={styles.cardBrand} numberOfLines={1}>{item.brand}</Text>
                  <Text style={styles.cardPrice}>${item.price}</Text>
                </View>
              </TouchableOpacity>
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
  empty: { flex: 1, backgroundColor: BACKGROUND },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BACKGROUND },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: MUTED_TEXT },
  sortRow: { flexDirection: 'row', gap: 6, marginRight: 16 },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  sortBtnActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  sortBtnText: { fontSize: 12, color: '#111', fontWeight: '500' },
  sortBtnTextActive: { color: 'white' },
  grid: { flexDirection: 'row', gap: 8 },
  col: { flex: 1, gap: 8 },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  cardImage: { width: '100%' },
  cardMeta: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: { fontSize: 12, color: MUTED_TEXT, flex: 1, marginRight: 4 },
  cardPrice: { fontSize: 13, fontWeight: '700', color: ACCENT },
});

export default ProductListPage;
