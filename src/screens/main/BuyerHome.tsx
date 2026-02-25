import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ImageSourcePropType, ScrollView } from 'react-native';
import { HomeStackScreenProps } from '../../types';
import { ACCENT, BACKGROUND, BORDER, MUTED_TEXT } from '../../settings';
import { ImagesAssets } from '../../../assets/images/image_assest';

function BuyerHomePage({ navigation }: HomeStackScreenProps<'BuyerHomePage'>): JSX.Element {
  const categories: { label: string; description: string; index: number; image: ImageSourcePropType }[] = [
    { label: 'Tops', description: 'T-shirts, blouses, sweaters', index: 0, image: ImagesAssets.tops },
    { label: 'Bottoms', description: 'Pants, skirts, shorts', index: 1, image: ImagesAssets.bottoms },
    { label: 'Winter Wear', description: 'Coats, jackets, scarves', index: 2, image: ImagesAssets.winterwear },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Browse by category</Text>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat.index}
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.push('ProductListPage', { category: cat.index, reload: false })}>
          <ImageBackground source={cat.image} style={styles.cardImage} resizeMode="cover">
            <View style={styles.cardOverlay} />
          </ImageBackground>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>{cat.label}</Text>
            <Text style={styles.cardDesc}>{cat.description}</Text>
            <Text style={styles.cardArrow}>→</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BACKGROUND },
  container: { padding: 20, paddingBottom: 100 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  cardImage: { width: 100, height: '100%' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  cardLabel: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 3 },
  cardDesc: { fontSize: 13, color: MUTED_TEXT },
  cardArrow: { position: 'absolute', right: 16, top: '50%', fontSize: 18, color: ACCENT, marginTop: -9 },
});

export default BuyerHomePage;
