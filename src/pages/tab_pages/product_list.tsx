/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect, useState, useEffect} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

import {HomeStackScreenProps} from '../../type';

import {COLOR} from '../../../assets/setting';

import Filter from '../../../assets/icons/filter.svg';

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
  const [show, setShow] = useState(false);
  const [lst, setLst] = useState([[], []]);
  const [products, setProducts] = useState([]);
  const [orderState, setOrder] = useState(undefined);
  
  const categrory = route.params.category;
  const fetchData = async () => {
    setLoad(false);
    const id = await AsyncStorage.getItem('user_id');
    const _products = await GetProductList(id, categrory);
    setProducts(_products);
    setLoad(true);
  };

  const arrangeProduct = async () => {
    let _products = products;
    if (orderState === 'XSmall') {
      _products = _products.filter(product => product.size === 'XS');
    } else if (orderState === 'Small') {
      _products = _products.filter(product => product.size === 'S');
    } else if (orderState === 'Medium') {
      _products = _products.filter(product => product.size === 'M');
    } else if (orderState === 'Large') {
      _products = _products.filter(product => product.size === 'L');
    } else if (orderState === 'XLarge') {
      _products = _products.filter(product => product.size === 'XL');
    }

    if (orderState === 1 || orderState === -1) {
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
    setShow(true);
  }

  useEffect(() => {
    if (load) {
      arrangeProduct();
    }
  }, [load, orderState]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {!show && <Text>Loading ...</Text>}
        {show && (lst[0].length + lst[1].length) === 0 && <Text>No product in this category</Text>}

        {show &&
          lst.map(items => {
            return (
              <View style={styles.list}>
                {items.map((item, index) => {
                  const width = Dimensions.get('window').width * 0.5 * 0.95;
                  const height = width * (item.images[0]?.height / item.images[0]?.width);
                  return (
                    <TouchableOpacity
                      style={[styles.product, {width: width, height: height}]}
                      activeOpacity={0.5}
                      onPress={() => {
                        navigation.push('ProductDescriptionPage', {
                          category: item.category,
                          product: item._id,
                        });
                      }}>
                      <FastImage
                        source={{uri: GetImage(item.images[0]?.name)}}
                        style={{width: width, height: height}}
                        resizeMode='contain'
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
