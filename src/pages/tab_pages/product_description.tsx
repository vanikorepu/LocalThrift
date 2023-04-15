import React, {useLayoutEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions} from 'react-native';

import Carousel from 'react-native-reanimated-carousel';

import { RootStackScreenProps } from '../../type';

import { ImagesAssets } from '../../../assets/images/image_assest';
import Product from '../../../data/product_list.json';
import MeetingPoint from '../../../data/meeting_point.json';

import Back from '../../../assets/icons/left_arrow.svg';
import Cart from '../../../assets/icons/cart.svg';
import LeftArrow from '../../../assets/icons/left_arrow.svg';
import RightArrow from '../../../assets/icons/right_arrow.svg';

import {COLOR} from '../../../assets/setting';

function ProductDescriptionPage({ navigation, route }: RootStackScreenProps<'ProductDescriptionPage'>): JSX.Element {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TouchableOpacity onPress={navigation.goBack}>
            <Back style={styles.back} stroke={'black'}/>
      </TouchableOpacity>
    });
  }, [navigation]);


  const product = Product[route.params.product - 1];
  const images = [ImagesAssets.bottoms, ImagesAssets.buying, ImagesAssets.home, ImagesAssets.logo, ImagesAssets.selling, ImagesAssets.tops, ImagesAssets.winterwear];

  const {height, width} = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
          width={width}
          height={height * 0.6}
          loop
          // autoPlay={true}
          data={[...new Array(images.length).keys()]}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => console.log('current index:', index)}
          renderItem={({ index }) => (
            <View style={styles.carouselContent}>
              <Image style={styles.image} resizeMode='cover' source={images[index]}/>
            </View>
          )}
      />
      <View style={styles.arrows}>
        <LeftArrow stroke={'white'} style={[styles.arrow]}/>
        <RightArrow stroke={'white'} style={[styles.arrow]}/>
      </View>
      {/* <View style={{flex: 3}}/> */}
      <View style={styles.info}>
        <View style={{width: '100%'}}>
          <Text style={styles.text}>Price: ${product.price}</Text>
          <Text style={styles.text}>Size: {product.size}</Text>
          <Text style={styles.text}>Brand: {product.brand}</Text>
          <Text style={styles.text}>Usage: {product.usage}</Text>
          <Text style={styles.text}>Sold by: {product.seller}</Text>
          <Text style={styles.text}>Meeting point: {MeetingPoint[product.meeting]}</Text>
        </View>
        <TouchableOpacity
            style={[styles.button]}
            activeOpacity={0.5}
            onPress={() => {}}>
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
  },
  arrows: {
    position: 'absolute',
    flexDirection: 'row',
    width: '94%',
    marginHorizontal: '3%',
    flex: 1,
    top: '30%',
    justifyContent: 'space-between',
  },
  arrow: {
    height: 60, 
    width: 60
  },
  info: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    flex: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLOR,
    // borderColor: COLOR,
    paddingTop: 20,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginLeft: 30,
    marginVertical: 3,
    fontSize: 15,
    fontWeight: '400'
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
  }
});

export default ProductDescriptionPage;