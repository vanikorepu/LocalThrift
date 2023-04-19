import React, {useState, useEffect, useCallback} from 'react';

import {ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground} from 'react-native';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import AutoHeightImage from 'react-native-auto-height-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Edit from '../../../assets/icons/edit.svg';
import Sold from '../../../assets/icons/sold.svg';

import {COLOR} from '../../../assets/setting';
import Product from '../../../data/product_list.json';

import {ImagesAssets} from '../../../assets/images/image_assest';
import { HomeStackScreenProps, ProductParamsList, ImageParamsList } from '../../type';

import { GetSellerProduct, DeleteProduct, GetImage } from '../../api/api';

function SellerHomePage({ navigation, route }: HomeStackScreenProps<'SellerHomePage'>): JSX.Element {
  const [lst, setLst] = useState([[], []]);
  const [update, setUpdate] = useState(true);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    const products = await GetSellerProduct(id);

    let _lst = [[], []];
    let cnt = 0
    for (const product of products) {
      _lst[cnt % 2].push(product)
      cnt += 1
    }
    setLst(_lst);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    navigation.setParams({reload: false});
  }, [route.params.reload]);

  const edit = async (id: string, product: ProductParamsList) => {
    product.images = product.images.map((image: ImageParamsList) => {
      return {
        name: image.name,
        type: 'image/' + image.name.split('.')[1],
        uri: GetImage(image.name),
        height: image.height,
        width: image.width
      }
    })
    navigation.navigate('UploadPage', {state: "edit", product: product, product_id: id});
  }
  const sold = async (item: string) => {
    await DeleteProduct(item);
    fetchData();
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
                      <ImageBackground source={{uri: GetImage(item.images[0].name)}} style={styles.image}/>
                      <TouchableOpacity
                        style={[styles.button, {left: '5%'}]}
                        activeOpacity={0.5}
                        onPress={() => {edit(item._id, item);}}>
                        <Edit fill="black" style={[styles.icon]}/>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, {right: '5%'}]}
                        activeOpacity={0.5}
                        onPress={() => {sold(item._id);}}>
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