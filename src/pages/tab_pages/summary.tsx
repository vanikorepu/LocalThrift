import React, {useState, useEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button, Dimensions, Image, Animated, Platform} from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements';

import Carousel from 'react-native-reanimated-carousel';
import {ICarouselInstance} from 'react-native-reanimated-carousel';
import { Portal } from "@gorhom/portal";

import AsyncStorage from '@react-native-async-storage/async-storage';

import LeftArrow from '../../../assets/icons/left_arrow.svg';
import RightArrow from '../../../assets/icons/right_arrow.svg';

import {COLOR} from '../../../assets/setting'

import Categroy from '../../../data/category.json';
import MeetingPoint from '../../../data/meeting_point.json';

import { RootStackScreenProps } from '../../type';

import {PostProduct, UpdateProduct} from '../../api/api';


function Summary({ navigation, route }: RootStackScreenProps<'Summary'>): JSX.Element {
  const height = Dimensions.get('window').height - useHeaderHeight();

  const state = route.params.state;
  const product = route.params.product;
  const productId = route.params.product_id ?? '';
  const [user_id, setUser] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    if (id == null) {
      navigation.navigate('Auth');
    } else {
      setUser(id);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  const edit = () => {
    navigation.navigate("UploadPage", {state: state, product: product, product_id: productId});
  }

  const confirm = async () => {
    setDisabled(true);
    let status;
    if (state == 'edit') {
      status = await UpdateProduct(productId, product);
    } else {
      status = await PostProduct(user_id, product);
    }
    if(status === 1){
      setModalVisible(!isModalVisible);
    }
    setDisabled(false);
  }

  const closeModal = () => {
    setModalVisible(!isModalVisible);
    navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'SellerHomePage'}});
  }

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
  }, [isModalVisible]);

  const width = Dimensions.get('window').width;

  const carousel = React.useRef<ICarouselInstance>(null);


  return (
    <SafeAreaView style={{height: height}}>
      <Portal hostName="menu">
        {isModalVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={[styles.modalWrapper]}
          >
            <Animated.View
              style={[styles.activeSection]}
              collapsable={false}
            >
              <Text style={{textAlign: 'center'}}>You have succesfully uploaded your product!</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      </Portal>
      <View style={[styles.subcontainer, {flex: 6, justifyContent: 'center'}]}>
        <Carousel
            style={styles.carousel}
            ref={carousel}
            width={width * 0.85}
            height={width * 0.85}
            loop
            data={[...new Array(product.images.length).keys()]}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => {}}
            renderItem={({ index }) => (
              <View>
                <Image style={styles.image} resizeMode='cover' source={{uri: product.images[index]?.uri}}/>
              </View>
            )}
        />
        <TouchableOpacity
          style={[styles.arrowButton, {height: height, left: '10%'}]}
          activeOpacity={0.5}
          onPress={() => {carousel.current?.prev()}}>
          <LeftArrow stroke={'white'} style={[styles.arrow]}/>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.arrowButton, {height: height, right: '10%'}]}
          activeOpacity={0.5}
          onPress={() => {carousel.current?.next()}}>
          <RightArrow stroke={'white'} style={[styles.arrow]}/>
        </TouchableOpacity>
      </View>
      <View style={[styles.subcontainer, {flex: 3, justifyContent: 'center'}]}>
        <View style={styles.info}>
          <Text style={styles.text}>Price: ${product.price}</Text>
          <Text style={styles.text}>Size: {product.size}</Text>
          <Text style={styles.text}>Brand: {product.brand}</Text>
          <Text style={styles.text}>Category: {product.category !== undefined ? Categroy[product.category] : ''}</Text>
          <Text style={styles.text}>Usage: {product.usage}</Text>
          <Text style={styles.text}>Meeting Point: {product.meeting !== undefined ? MeetingPoint[product.meeting] : ''}</Text>
        </View>
      </View>
      <View style={[styles.subcontainer, {flex: 2}]}>
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
            disabled={disabled}
            onPress={() => {confirm()}}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSection: {
    // backgroundColor: "white",
    // alignSelf: "flex-start",
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
    width: '80%',
    height: 90,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',

    zIndex: 99,
  },
  subcontainer: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
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
  arrowButton: {
    position: 'absolute',
    justifyContent: 'center',
  },
  arrow: {
    aspectRatio: 1,
    height: '5%'
  },
  info: {
    width: '70%',
    height: '90%',
    borderRadius: 30,
    backgroundColor: COLOR,
    justifyContent: 'space-around',
    paddingVertical: '3%',
  },
  text: {
    color: 'white',
    marginLeft: 30,
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