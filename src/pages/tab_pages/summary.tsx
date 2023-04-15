import React, {useLayoutEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button, Dimensions, Image} from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import {ICarouselInstance} from 'react-native-reanimated-carousel';

import { ImagesAssets } from '../../../assets/images/image_assest';

import LeftArrow from '../../../assets/icons/left_arrow.svg';
import RightArrow from '../../../assets/icons/right_arrow.svg';

import {COLOR} from '../../../assets/setting'

import Categroy from '../../../data/category.json';
import MeetingPoint from '../../../data/meeting_point.json';

import { RootStackScreenProps } from '../../type';

function Summary({ navigation, route }: RootStackScreenProps<'Summary'>): JSX.Element {
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <Button title="Cancel" onPress={() => {
  //       navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}})
  //     }} />
  //   });
  // }, [navigation]);

  const edit = () => {
    navigation.goBack();
  }

  const confirm = () => {
    navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'SellerHomePage'}});
  }

  const images = [ImagesAssets.bottoms, ImagesAssets.buying, ImagesAssets.home, ImagesAssets.logo, ImagesAssets.selling, ImagesAssets.tops, ImagesAssets.winterwear];

  const width = Dimensions.get('window').width;

  const carousel = React.useRef<ICarouselInstance>(null);

  const product = route.params.product;

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
          style={styles.carousel}
          ref={carousel}
          width={width * 0.8}
          height={width * 0.8}
          loop
          // autoPlay={true}
          data={[...new Array(images.length).keys()]}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => console.log('current index:', index)}
          renderItem={({ index }) => (
            <View>
              <Image style={styles.image} resizeMode='cover' source={images[index]}/>
            </View>
          )}
      />
      <View style={styles.arrows}>
        <TouchableOpacity
          style={styles.arrowButton}
          activeOpacity={0.5}
          onPress={() => {carousel.current?.prev()}}>
          <LeftArrow stroke={'white'} style={[styles.arrow]}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowButton}
          activeOpacity={0.5}
          onPress={() => {carousel.current?.next()}}>
          <RightArrow stroke={'white'} style={[styles.arrow]}/>
        </TouchableOpacity>
      </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    position: 'absolute',
    flexDirection: 'row',
    marginHorizontal: '3%',
    flex: 1,
    width: 300,
    height: 300,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowButton: {
    height: '100%',
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