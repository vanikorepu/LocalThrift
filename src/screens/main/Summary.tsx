import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, StyleSheet, Text, View,
  TouchableOpacity, Image, ScrollView, Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../../types';
import { COLOR } from '../../settings';
import Category from '../../data/category.json';
import MeetingPoint from '../../data/meeting_point.json';
import { PostProduct, UpdateProduct } from '../../api/api';

const { width } = Dimensions.get('window');

function Summary({ navigation, route }: RootStackScreenProps<'Summary'>): JSX.Element {
  const state = route.params.state;
  const product = route.params.product;
  const productId = route.params.product_id;
  const [user_id, setUser] = useState('');
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('user_id').then(id => setUser(id ?? ''));
  }, []);

  const confirm = async () => {
    if (state === 'edit') {
      await UpdateProduct(productId!, product);
    } else {
      await PostProduct(user_id, product);
    }
    navigation.navigate('TabNavigationRoutes', {
      screen: 'Home',
      params: { screen: 'SellerHomePage', params: { reload: true } },
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / (width * 0.8)))}>
          {product.images!.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img.uri }}
              style={{ width: width * 0.8, height: width * 0.8 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.info}>
          <Text style={styles.text}>Price: ${product.price}</Text>
          <Text style={styles.text}>Size: {product.size}</Text>
          <Text style={styles.text}>Brand: {product.brand}</Text>
          <Text style={styles.text}>Category: {product.category !== undefined ? Category[product.category] : ''}</Text>
          <Text style={styles.text}>Usage: {product.usage}</Text>
          <Text style={styles.text}>Meeting Point: {product.meeting !== undefined ? MeetingPoint[product.meeting] : ''}</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('UploadPage', { state, product, product_id: productId })}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={confirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { alignItems: 'center', flex: 1 },
  carousel: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 30,
    borderColor: COLOR,
    borderWidth: 1,
    overflow: 'hidden',
  },
  info: {
    width: '70%',
    borderRadius: 30,
    backgroundColor: COLOR,
    paddingVertical: 20,
    marginTop: 20,
  },
  text: { color: 'white', marginLeft: 30, marginVertical: 3, fontSize: 12, fontWeight: '400' },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    borderRadius: 5, borderColor: COLOR, borderWidth: 1,
    width: '40%', height: 30, justifyContent: 'center', alignItems: 'center',
  },
  buttonText: { fontWeight: '500' },
});

export default Summary;
