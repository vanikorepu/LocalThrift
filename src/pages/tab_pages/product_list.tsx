import React, {useLayoutEffect, useState, useEffect} from 'react';

import {ScrollView, StyleSheet, Modal, Text, View, TouchableOpacity, Image, ImageBackground, Dimensions} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { HomeStackScreenProps } from '../../type';

import {COLOR} from '../../../assets/setting';

import Filter from '../../../assets/icons/filter.svg';
import Product from '../../../data/product_list.json';

import {ImagesAssets} from '../../../assets/images/image_assest';

import AutoHeightImage from 'react-native-auto-height-image';
import RNPickerSelect from 'react-native-picker-select';

import { GetProductList, GetImage } from '../../api/api';

function ProductListPage({ navigation, route }: HomeStackScreenProps<'ProductListPage'>): JSX.Element {
  // const [modalVisible, setModalVisible] = useState(false);
  let order = undefined
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => 
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => {order = value}}
        onDonePress={async () => {
          setOrder(order)
        }}
        placeholder={{label: ""}}
        Icon={() => {
          return (
            <TouchableOpacity>
              <Filter style={styles.filter}/>
            </TouchableOpacity>
          );
        }}
        items={[
            { label: 'Low to High', value: 1 },
            { label: 'High to Low', value: -1 },
        ]}
      />
    });
  }, [navigation]);

  const [load, setLoad] = useState(false);
  // const [products, setProducts] = useState([]);
  const [lst, setLst] = useState([[], []]);
  const [orderState, setOrder] = useState(undefined);

  const categrory = route.params.category;
  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    let _products = await GetProductList(id, categrory);
    if (orderState !== undefined) {
      _products.sort((a, b) => orderState * (Number(a.price) - Number(b.price)))  
    }

    let _lst = [[], []]
    let sum = [0, 0]
    for (const product of _products) {
      const aspectRatio = product.images[0].height / product.images[0].width
      if (sum[0] > sum[1]) {
        _lst[1].push(product)
        sum[1] += aspectRatio
      } else {
        _lst[0].push(product)
        sum[0] += aspectRatio
      }
    }
    setLst(_lst);
    setLoad(true);
  }

  useEffect(() => {
    fetchData();
  }, [orderState]);

  useEffect(() => {
    fetchData();
    navigation.setParams({reload: false})
  }, [route.params.reload])
  
  return (
    <ScrollView>
      <View style={styles.container}>
        {
          load && lst.map((items) => {
            return <View style={styles.list}>
              {
                items.map((item, index) => {
                  return <TouchableOpacity
                      style={styles.product}
                      activeOpacity={0.5}
                      onPress={() => {navigation.push('ProductDescriptionPage', {category: item.category, product: item._id});}}>
                      <AutoHeightImage source={{uri: GetImage(item.images[0].name)}} width={200}/>
                      <Text 
                        style={styles.price}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                      >${item.price}</Text>
                  </TouchableOpacity>
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
  filter: {
    marginRight: 20,
    width: 30,
    height: 30,
  },
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
    // height: 200,
    marginVertical: '1%',
    borderColor: COLOR,
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    top: 0,
    right: '-70%',
    width: 30,
    height: 30,
  }
});

export default ProductListPage;