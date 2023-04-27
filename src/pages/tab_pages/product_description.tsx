import React, {useLayoutEffect, useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import {ICarouselInstance} from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootStackScreenProps} from '../../type';

import MeetingPoint from '../../../data/meeting_point.json';

import Back from '../../../assets/icons/left_arrow.svg';
import Cart from '../../../assets/icons/cart.svg';
import LeftArrow from '../../../assets/icons/left_arrow.svg';
import RightArrow from '../../../assets/icons/right_arrow.svg';

import {COLOR} from '../../../assets/setting';

import {
  GetProduct,
  AddItemToCart,
  GetUserProfile,
  GetImage,
} from '../../api/api';

function ProductDescriptionPage({
  navigation,
  route,
}: RootStackScreenProps<'ProductDescriptionPage'>): JSX.Element {
  const product_id = route.params.product;
  const [user_id, setUser] = useState('');
  const [load, setLoad] = useState(false);
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState({});
  const [disabled, setDisabled] = useState(false);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    const product = await GetProduct(product_id);
    const seller = await GetUserProfile(product.seller);
    setProduct(product);
    console.log(product);
    setSeller(seller);
    setUser(id);
    setLoad(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TabNavigationRoutes', {
              screen: 'Home',
              params: {
                screen: 'ProductListPage',
                params: {category: route.params.category},
              },
            });
          }}>
          <Back style={styles.back} stroke={'black'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const addToCart = async (item: string) => {
    setDisabled(true);
    await AddItemToCart(item, user_id);
    navigation.navigate('TabNavigationRoutes', {
      screen: 'Home',
      params: {
        screen: 'ProductListPage',
        params: {category: route.params.category},
      },
    });
  };

  const {height, width} = Dimensions.get('window');

  const carousel = React.useRef<ICarouselInstance>(null);

  return !load ? (
    <Text>Loading ...</Text>
  ) : (
    <SafeAreaView style={styles.container}>
      <Carousel
        ref={carousel}
        width={width}
        height={height * 0.6}
        loop
        data={[...new Array(product.images.length).keys()]}
        scrollAnimationDuration={1000}
        onSnapToItem={index => {}}
        renderItem={({index}) => (
          <View style={styles.carouselContent}>
            <FastImage
              style={styles.image}
              resizeMode="cover"
              source={{uri: GetImage(product.images[index].name)}}
            />
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.arrowButton, {}]}
        activeOpacity={0.5}
        onPress={() => {
          carousel.current?.prev();
        }}>
        <LeftArrow stroke={'white'} style={[styles.arrow]} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.arrowButton, {right: 0}]}
        activeOpacity={0.5}
        onPress={() => {
          carousel.current?.next();
        }}>
        <RightArrow stroke={'white'} style={[styles.arrow]} />
      </TouchableOpacity>
      <View style={styles.info}>
        <View style={{width: '100%'}}>
          <Text style={styles.text}>Price: ${product.price}</Text>
          <Text style={styles.text}>Size: {product.size}</Text>
          <Text style={styles.text}>Brand: {product.brand}</Text>
          <Text style={styles.text}>Usage: {product.usage}</Text>
          <Text style={styles.text}>Sold by: {seller.name}</Text>
          <Text style={styles.text}>
            Meeting point: {MeetingPoint[product.meeting]}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button]}
          activeOpacity={0.5}
          disabled={disabled}
          onPress={() => {
            addToCart(product._id);
          }}>
          <Cart style={styles.cart} fill={COLOR} />
          <Text style={styles.buttonText}>Add to Bag</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: {
    height: 20,
    width: 20,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignContent: 'center',
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrows: {
    position: 'absolute',
    flexDirection: 'row',
    width: '94%',
    marginHorizontal: '3%',
    flex: 1,
    height: '65%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    position: 'absolute',
    height: '65%',
    justifyContent: 'center',
  },
  arrow: {
    height: 60,
    width: 60,
  },
  info: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    flex: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR,
    paddingTop: 20,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginLeft: 30,
    marginVertical: 3,
    fontSize: 15,
    fontWeight: '400',
  },
  button: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    width: 160,
    height: 30,
  },
  buttonText: {
    color: COLOR,
    marginLeft: 20,
  },
  cart: {
    width: 20,
    height: 20,
  },
});

export default ProductDescriptionPage;
