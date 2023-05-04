/* eslint-disable react/no-unstable-nested-components */
import React, {useLayoutEffect, useState, useEffect} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated, 
  Platform
} from 'react-native';

import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { Portal } from "@gorhom/portal";
import { useHeaderHeight } from '@react-navigation/elements';

import {HomeStackScreenProps, ProductParamsList} from '../../type';

import {COLOR} from '../../../assets/setting';

import Filter from '../../../assets/icons/filter.svg';

import {GetProductList, GetImage} from '../../api/api';

function ProductListPage({
  navigation,
  route,
}: HomeStackScreenProps<'ProductListPage'>): JSX.Element {
  // const [modalVisible, setModalVisible] = useState(false);
  const topOffset = useHeaderHeight();
  let order: number|undefined = undefined;
  let filter: string|undefined = undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Filter style={styles.filter} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [lst, setLst] = useState<Array<Array<ProductParamsList>>>([[], []]);
  const [products, setProducts] = useState<Array<ProductParamsList>>([]);
  const [orderState, setOrder] = useState<number|undefined>(undefined);
  const [filterState, setFilter] = useState<string|undefined>(undefined);
  const [isModalVisible, setModalVisible] = useState(false);

  const categrory = route.params.category;
  const fetchData = async () => {
    setLoad(false);
    const id = await AsyncStorage.getItem('user_id');
    if (id === null) {
      navigation.navigate('Auth');
    } else {
      const _products = await GetProductList(id, categrory);
      setProducts(_products);
      setLoad(true);
    }
  };

  const arrangeProduct = async () => {
    let _products = products;
    if (filterState === 'XSmall') {
      _products = _products.filter(product => product.size === 'XS');
    } else if (filterState === 'Small') {
      _products = _products.filter(product => product.size === 'S');
    } else if (filterState === 'Medium') {
      _products = _products.filter(product => product.size === 'M');
    } else if (filterState === 'Large') {
      _products = _products.filter(product => product.size === 'L');
    } else if (filterState === 'XLarge') {
      _products = _products.filter(product => product.size === 'XL');
    }

    if (orderState === 1 || orderState === -1) {
      _products.sort(
        (a, b) => orderState * (Number(a.price) - Number(b.price)),
      );
    }

    let _lst: Array<Array<ProductParamsList>> = [[], []];
    let sum = [0, 0];
    for (const product of _products) {
      const aspectRatio = (product.images[0]?.height ?? 0) / (product.images[0]?.width ?? 1);
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

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (load) {
      arrangeProduct();
    }
  }, [load, orderState, filterState]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView>
      <Portal hostName="menu">
        {isModalVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={[styles.modalWrapper]}
          >
            <Animated.View
              style={[styles.activeSection, {top: topOffset}]}
              collapsable={false}
            >
              <TouchableOpacity 
                style={{alignSelf: 'flex-end', marginRight: '8%', marginTop: 5}}
                onPress={() => {
                  setOrder(undefined);
                  setFilter(undefined);
                  order = undefined;
                  filter = undefined;
                  setModalVisible(false);
                }}
                >
                <Text style={{color: COLOR}}>Clear all</Text>
              </TouchableOpacity>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{label: "Sort by"}}
                onValueChange={value => {
                  order = value;
                }}
                onDonePress={async () => {
                  setOrder(order);
                }}
                items={[
                  {label: 'Price: Low to High', value: 1},
                  {label: 'Price: High to Low', value: -1},
                ]}
                value={orderState}
              />
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{label: 'Size'}}
                onValueChange={value => {
                  filter = value;
                }}
                onDonePress={async () => {
                  setFilter(filter);
                }}
                items={[
                  {label: 'Size: XS', value: 'XSmall'},
                  {label: 'Size: S', value: 'Small'},
                  {label: 'Size: M', value: 'Medium'},
                  {label: 'Size: L', value: 'Large'},
                  {label: 'Size: XL', value: 'XLarge'},
                ]}
                value={filterState}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </Portal>
      <View style={styles.container}>
        {!show && <Text>Loading ...</Text>}
        {show && (lst[0].length + lst[1].length) === 0 && <Text>No products in this category</Text>}

        {show &&
          lst.map(items => {
            return (
              <View style={styles.list}>
                {items.map((item, index) => {
                  const width = Dimensions.get('window').width * 0.5 * 0.95;
                  const height = width * ((item.images[0]?.height ?? 0) / (item.images[0]?.width ?? 1));
                  return (
                    <TouchableOpacity
                      style={[styles.product, {width: width, height: height}]}
                      activeOpacity={0.5}
                      onPress={() => {
                        navigation.push('ProductDescriptionPage', {
                          category: item.category ?? 0,
                          product: item._id ?? '',
                        });
                      }}>
                      <FastImage
                        source={{uri: GetImage(item.images[0]?.name ?? '')}}
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
  modalWrapper: {
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSection: {
    // backgroundColor: "white",
    // alignSelf: "flex-end",
    position: "absolute",
    // top: '10%',
    right: 5,
    ...Platform.select({
      ios: {
        // alignSelf: "flex-start",
        // width: layoutWidth * 0.5,

        // borderRadius: 13,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.35,
        shadowRadius: 100,
      },
    }),
    width: '50%',
    height: 130,
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: COLOR,
    borderWidth: 1,
    justifyContent: 'center',

    zIndex: 99,
  },
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
    lineHeight: 27,
    fontSize: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '85%',
    height: 40,
    marginLeft: '7.5%',
    marginVertical: 5,
    paddingLeft: 20,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 15,
  },
  container: {
    width: '85%',
    height: 40,
    marginLeft: '7.5%',
    marginVertical: 5,
    paddingLeft: 20,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 15,
  },
  dropDown: {
    width: '85%',
    marginLeft: '7.5%',
  }
});

export default ProductListPage;
