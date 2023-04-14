import React, {useLayoutEffect, useState} from 'react';

import {ScrollView, StyleSheet, Modal, Text, View, TouchableOpacity, Image, ImageBackground, Dimensions} from 'react-native';


import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';

import {COLOR} from '../../../assets/setting'

import Filter from '../../../assets/icons/filter.svg';
import Product from '../../../data/product_list.json';

import {ImagesAssets} from '../../../assets/images/image_assest';

import AutoHeightImage from 'react-native-auto-height-image';
import RNPickerSelect from 'react-native-picker-select';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ProductListPage'
>;

type Props = {
  navigation: NavigationProp;
};


function ProductListPage({navigation}: Props): JSX.Element {
  // const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => 
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{label: ""}}
        Icon={() => {
          return (
            <TouchableOpacity>
              <Filter style={styles.filter}/>
            </TouchableOpacity>
          );
        }}
        onValueChange={(value) => console.log(value)}
        items={[
            // { label: 'Tops', value: 'tops' },
            // { label: 'Bottoms', value: 'bottoms' },
            // { label: 'Winter Clothes', value: 'winter' },
            { label: 'Low to High', value: 'asc' },
            { label: 'High to Low', value: 'desc' },
        ]}
      />
      // <TouchableOpacity onPress={()=>{
      //   setModalVisible(true)
      //     }}>
      //   <Filter style={styles.filter}/>
      // </TouchableOpacity>
      // <Button title="Cancel" onPress={() => {
      //   navigation.navigate('TabNavigationRoutes', {screen: 'Home'})
      // }} />
    });
  }, [navigation]);
  
  const images = [ImagesAssets.bottoms, ImagesAssets.tops]
  const products = Product.map((item, index) => {
    return {
      ...item,
      image: images[index % 2],
    }
  })
  const lst = [[], []]
  let sum = [0, 0]
  for (const product of products) {
    const aspectRatio = product.height / product.width
    if (sum[0] > sum[1]) {
      lst[1].push(product)
      sum[1] += aspectRatio
    } else {
      lst[0].push(product)
      sum[0] += aspectRatio
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {
          lst.map((items) => {
            return <View style={styles.list}>
              {
                items.map((item, index) => {
                  return <TouchableOpacity
                      style={styles.product}
                      activeOpacity={0.5}
                      onPress={() => {navigation.push('ProductDescriptionPage');}}>
                      <AutoHeightImage source={item.image} width={200}/>
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