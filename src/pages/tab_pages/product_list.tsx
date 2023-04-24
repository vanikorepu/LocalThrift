/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect, useState, useEffect} from 'react';

import {
  ScrollView,
  StyleSheet,
  Modal,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {HomeStackScreenProps} from '../../type';

import {COLOR} from '../../../assets/setting';

import Filter from '../../../assets/icons/filter.svg';
import Product from '../../../data/product_list.json';

import {ImagesAssets} from '../../../assets/images/image_assest';

import AutoHeightImage from 'react-native-auto-height-image';
import RNPickerSelect from 'react-native-picker-select';

import {GetProductList, GetImage} from '../../api/api';

function ProductListPage({
  navigation,
  route,
}: HomeStackScreenProps<'ProductListPage'>): JSX.Element {
  // const [modalVisible, setModalVisible] = useState(false);
  let order = undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={value => {
            order = value;
          }}
          onDonePress={async () => {
            setOrder(order);
          }}
          placeholder={{label: ''}}
          Icon={() => {
            return (
              <TouchableOpacity>
                <Filter style={styles.filter} />
              </TouchableOpacity>
            );
          }}
          items={[
            {label: 'Price: Low to High', value: 1},
            {label: 'Price: High to Low', value: -1},
            {label: 'Size: XS', value: 'XSmall'},
            {label: 'Size: S', value: 'Small'},
            {label: 'Size: M', value: 'Medium'},
            {label: 'Size: L', value: 'Large'},
            {label: 'Size: XL', value: 'XLarge'},
          ]}
        />
      ),
    });
  }, [navigation]);

  const [load, setLoad] = useState(false);
  // const [products, setProducts] = useState([]);
  const [lst, setLst] = useState([[], []]);
  const [orderState, setOrder] = useState(undefined);
  const [filteredList, setFilteredList] = useState([]);

  const categrory = route.params.category;
  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    let _products = [
      {
        id: 1,
        category: 0,
        size: 'S',
        price: 15,
        brand: 'H&M',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 408,
        width: 612,
        seller: 1,
        meeting: 0,
      },
      {
        id: 2,
        category: 0,
        size: 'M',
        price: 10,
        brand: 'Uniqlo',
        usage: 'New',
        image: 'cover image2.jpg',
        height: 664,
        width: 1689,
        seller: 2,
        meeting: 0,
      },
      {
        id: 3,
        category: 0,
        size: 'L',
        price: 20,
        brand: 'Zara',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 408,
        width: 612,
        seller: 5,
        meeting: 1,
      },
      {
        id: 4,
        category: 0,
        size: 'XS',
        price: 13,
        brand: 'H&M',
        usage: 'New',
        image: 'cover image2.jpg',
        height: 664,
        width: 1689,
        seller: 3,
        meeting: 1,
      },
      {
        id: 5,
        category: 1,
        size: '10',
        price: 20,
        brand: 'Zara',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 408,
        width: 612,
        seller: 4,
        meeting: 0,
      },
      {
        id: 6,
        category: 1,
        size: '12',
        price: 10,
        brand: 'H&M',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 664,
        width: 1689,
        seller: 3,
        meeting: 0,
      },
      {
        id: 7,
        category: 1,
        size: '8',
        price: 15,
        brand: 'Uniqlo',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 408,
        width: 612,
        seller: 2,
        meeting: 1,
      },
      {
        id: 8,
        category: 1,
        size: '9',
        price: 23,
        brand: 'Uniqlo',
        usage: 'New',
        image: 'cover image2.jpg',
        height: 664,
        width: 1689,
        seller: 2,
        meeting: 1,
      },
      {
        id: 9,
        category: 2,
        size: 'S',
        price: 30,
        brand: 'EMS',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 408,
        width: 612,
        seller: 1,
        meeting: 0,
      },
      {
        id: 10,
        category: 2,
        size: 'L',
        price: 50,
        brand: 'Columbia',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 664,
        width: 1689,
        seller: 1,
        meeting: 0,
      },
      {
        id: 11,
        category: 2,
        size: 'XL',
        price: 25,
        brand: 'The North Face',
        usage: 'New',
        image: 'cover image2.jpg',
        height: 408,
        width: 612,
        seller: 3,
        meeting: 1,
      },
      {
        id: 12,
        category: 2,
        size: 'M',
        price: 40,
        brand: 'Timberland',
        usage: 'Almost new',
        image: 'cover image2.jpg',
        height: 664,
        width: 1689,
        seller: 2,
        meeting: 1,
      },
    ];
    // let _products = await GetProductList(id, categrory);
    if (orderState === 'XSmall') {
      _products = _products.filter(product => product.size === 'XS');
      setFilteredList(_products);
    } else if (orderState === 'Small') {
      _products = _products.filter(product => product.size === 'S');
      setFilteredList(_products);
    } else if (orderState === 'Medium') {
      _products = _products.filter(product => product.size === 'M');
      setFilteredList(_products);
    } else if (orderState === 'Large') {
      _products = _products.filter(product => product.size === 'L');
      setFilteredList(_products);
    } else if (orderState === 'XLarge') {
      _products = _products.filter(product => product.size === 'XL');
      setFilteredList(_products);
    }

    if (orderState !== undefined) {
      _products.sort(
        (a, b) => orderState * (Number(a.price) - Number(b.price)),
      );
    }

    let _lst = [[], []];
    let sum = [0, 0];
    for (const product of _products) {
      const aspectRatio = product.images[0].height / product.images[0].width;
      if (sum[0] > sum[1]) {
        _lst[1].push(product);
        sum[1] += aspectRatio;
      } else {
        _lst[0].push(product);
        sum[0] += aspectRatio;
      }
    }
    setLst(_lst);
    setLoad(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    navigation.setParams({reload: false});
  }, [route.params.reload]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {filteredList.length !== 0 &&
          load &&
          filteredList.map(item => {
            return (
              <TouchableOpacity
                style={styles.product}
                activeOpacity={0.5}
                onPress={() => {
                  navigation.push('ProductDescriptionPage', {
                    category: item.category,
                    product: item._id,
                  });
                }}>
                <AutoHeightImage
                  source={{uri: GetImage(item.images[0].name)}}
                  width={200}
                />
                <Text
                  style={styles.price}
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}>
                  ${item.price}
                </Text>
              </TouchableOpacity>
            );
          })}

        {filteredList.length === 0 &&
          load &&
          lst.map(items => {
            return (
              <View style={styles.list}>
                {items.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.product}
                      activeOpacity={0.5}
                      onPress={() => {
                        navigation.push('ProductDescriptionPage', {
                          category: item.category,
                          product: item._id,
                        });
                      }}>
                      <AutoHeightImage
                        source={{uri: GetImage(item.images[0].name)}}
                        width={200}
                      />
                      <Text
                        style={styles.price}
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}>
                        ${item.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
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
  },
});

export default ProductListPage;
