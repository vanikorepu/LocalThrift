import React from 'react';

import {ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground} from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';

import Edit from '../../../assets/icons/edit.svg';
import Sold from '../../../assets/icons/sold.svg';

import {COLOR} from '../../../assets/setting';
import Product from '../../../data/product_list.json';

import {ImagesAssets} from '../../../assets/images/image_assest';
import { HomeStackScreenProps } from '../../type';

function SellerHomePage({ navigation, route }: HomeStackScreenProps<'SellerHomePage'>): JSX.Element {
  const edit = (item: number) => {

  }
  const sold = (item: number) => {

  }
  const images = [ImagesAssets.bottoms, ImagesAssets.tops]
  const products = Product.map((item, index) => {
    return {
      ...item,
      image: images[index % 2],
    }
  })
  const lst: Array<typeof Product> = [[], []]
  let sum = [0, 0]
  for (const product of products) {
    const aspectRatio = product.height / product.width
    if (sum[0] > sum[1]) {
      lst[1].push(product)
      sum[1] += aspectRatio
    } else {
      lst[0].push(product)
      sum[0] += aspectRatio
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {
          lst.map((items) => {
            return <View style={styles.list}>
              {
                items.map((item, index) => {
                  return <View style={styles.product}>
                      <ImageBackground source={item.image} style={styles.image}/>
                      <TouchableOpacity
                        style={[styles.button, {left: '5%'}]}
                        activeOpacity={0.5}
                        onPress={() => {edit(item.id);}}>
                        <Edit fill="black" style={[styles.icon]}/>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, {right: '5%'}]}
                        activeOpacity={0.5}
                        onPress={() => {sold(item.id);}}>
                        <Sold fill="black" style={[styles.icon]}/>
                      </TouchableOpacity>
                      <Text 
                        style={styles.price}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                      >${item.price}</Text>
                  </View>
                })
              }
            </View>
          })
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflowY: 'scroll',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  list: {
    width: '50%',
    alignItems: 'center',
  },
  product: {
    alignItems: 'flex-end',
    width: '95%',
    height: 250,
    marginVertical: '1%',
    borderColor: COLOR,
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    position: 'absolute',
    top: '5%',
  },
  icon: {
    width: 30,
    height: 30,
  },
  price: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderColor: COLOR,
    borderWidth: 1,
    borderRadius: 15,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 25,
    fontSize: 12,
  },
});

export default SellerHomePage;