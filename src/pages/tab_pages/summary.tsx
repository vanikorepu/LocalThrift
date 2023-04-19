import React, {useLayoutEffect, useState, useEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button, Dimensions, Image} from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import {ICarouselInstance} from 'react-native-reanimated-carousel';

import AsyncStorage from '@react-native-async-storage/async-storage';

import LeftArrow from '../../../assets/icons/left_arrow.svg';
import RightArrow from '../../../assets/icons/right_arrow.svg';

import {COLOR} from '../../../assets/setting'

import Categroy from '../../../data/category.json';
import MeetingPoint from '../../../data/meeting_point.json';

import { RootStackScreenProps } from '../../type';

import {PostProduct, UpdateProduct} from '../../api/api';

function Summary({ navigation, route }: RootStackScreenProps<'Summary'>): JSX.Element {

  const state = route.params.state;
  const product = route.params.product;
  const productId = route.params.product_id;
  const [user_id, setUser] = useState('');

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    setUser(id);
  }

  useEffect(() => {
    fetchData();
  }, []);


  const edit = () => {
    navigation.navigate("UploadPage", {state: state, product: product, product_id: productId});
  }

  const confirm = async () => {
    if (state == 'edit') {
     UpdateProduct(productId, product);
    } else {
     PostProduct(user_id, product);
    }
    navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'SellerHomePage', params:{reload: true}}});
  }

  const width = Dimensions.get('window').width;

  const carousel = React.useRef<ICarouselInstance>(null);


  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Carousel
            style={styles.carousel}
            ref={carousel}
            width={width * 0.8}
            height={width * 0.8}
            loop
            data={[...new Array(product.images.length).keys()]}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => {}}
            renderItem={({ index }) => (
              <View>
                <Image style={styles.image} resizeMode='cover' source={{uri: product.images[index].uri}}/>
              </View>
            )}
        />
        <View style={styles.info}>
          <Text style={styles.text}>Price: ${product.price}</Text>
          <Text style={styles.text}>Size: {product.size}</Text>
          <Text style={styles.text}>Brand: {product.brand}</Text>
          <Text style={styles.text}>Category: {Categroy[product.category]}</Text>
          <Text style={styles.text}>Usage: {product.usage}</Text>
          <Text style={styles.text}>Meeting Point: {MeetingPoint[product.meeting]}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => {edit()}}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => {confirm()}}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
          style={[styles.arrowButton, {left: '10%'}]}
          activeOpacity={0.5}
          onPress={() => {carousel.current?.prev()}}>
          <LeftArrow stroke={'white'} style={[styles.arrow]}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.arrowButton, {right: '10%'}]}
          activeOpacity={0.5}
          onPress={() => {carousel.current?.next()}}>
          <RightArrow stroke={'white'} style={[styles.arrow]}/>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
  },
  carousel: {
    borderRadius: 30,
    borderColor: COLOR,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrows: {
    flexDirection: 'row',
    marginHorizontal: '3%',
    flex: 1,
    width: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    position: 'absolute',
    height: 300,
    justifyContent: 'center',
  },
  arrow: {
    height: 60, 
    width: 60
  },
  info: {
    width: '70%',
    borderRadius: 30,
    backgroundColor: COLOR,
    paddingVertical: 20,
    marginTop: 20,
  },
  text: {
    color: 'white',
    marginLeft: 30,
    marginVertical: 3,
    fontSize: 12,
    fontWeight: '400'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    borderColor: COLOR,
    borderWidth: 1,
    width: '40%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
  },
});

export default Summary;