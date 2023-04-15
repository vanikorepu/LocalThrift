import React, {useState} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';

import Menu, { MenuItem } from '../../components/manu';

import CartProduct from '../../../data/cart.json';
import Empty from '../../../assets/icons/empty.svg';
import {COLOR, CLICK_COLOR} from '../../../assets/setting';

import { TabScreenProps } from '../../type';

import { ImagesAssets } from '../../../assets/images/image_assest';
import Trash from '../../../assets/icons/trash.svg';

import Gmail from '../../../assets/icons/gmail.svg';
import SMS from '../../../assets/icons/sms.svg';

function CartPage({ navigation, route }: TabScreenProps<'Cart'>): JSX.Element {
  const trash = (item: number) => {

  }

  const send_sms = (items: {}) => {
  }

  const send_gmail = (items: {}) => {
  
  }
  
  const cart = CartProduct;
  const sum = cart.reduce((acc, cur) => acc + cur.product.length, 0);
  
  let content: JSX.Element;
  if (sum === 0) {
    content = (<View style={styles.container}>
      <Text style={styles.subTitle}>Your cart is empty!</Text>
      <Empty style={styles.empty}/>
      <TouchableOpacity
          style={[styles.button]}
          activeOpacity={0.5}
          onPress={() => {navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}})}}>
          <Text style={styles.buttonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>);
  } else {
    content = (<ScrollView>
      <View style={[styles.container, {paddingTop: 10}]}>
        {cart.map((items, index) => (
          <View>
            <Text style={styles.sellerText}>Selled by: {items.seller}</Text>
            <View style={styles.seller}>
              <View style={styles.product}>
                {items.product.map((item) =>(
                  <View style={styles.infos}>
                    <Image style={styles.image} source={ImagesAssets.logo} resizeMode="cover" />
                    <View style={styles.info}>
                      <Text style={styles.text}>Size: {item.size}</Text>
                      <Text style={styles.text}>Price: ${item.price}</Text>
                      <Text style={styles.text}>Brand: {item.brand}</Text>
                      <Text style={styles.text}>Usage: {item.usage}</Text>
                      <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {trash(item.id)}}>
                          <Trash style={styles.trash} />
                      </TouchableOpacity>
                      
                    </View>
                  </View>
                ))
                }
              </View>
              <Menu 
                style={styles.modal}
                trigger={<View style={styles.contactButton}><Text style={styles.contactText}>Contact Seller</Text></View>}
                >
                <MenuItem
                  element={<SMS style={[styles.icon]}/>}
                  onPress={() => {send_sms(items)}}
                />
                <MenuItem
                  element={<Gmail style={[styles.icon]}/>}
                  onPress={() => {send_gmail(items)}}
                />
              </Menu>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>)
  }

  return (
    <SafeAreaView>
      <View >
        <Text style={styles.total}>{sum} Items</Text>
      </View>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  total: {
    marginLeft: 5,
    fontSize: 12,
    textDecorationLine: 'underline',
  }, 
  container: {
    alignItems: 'center',
  },
  subTitle: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: '400',
    color: COLOR,
  },
  empty: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 20,
    borderColor: COLOR,
    borderWidth: 1,
    marginTop: 10,
  },
  button: {
    borderColor: COLOR,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    height: 30,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sellerText: {
    marginLeft: 10,
    marginTop: 10,
  },
  seller: {
    width: '90%',
    borderBottomWidth: 1,
    marginHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 5,
    borderColor: COLOR,
    borderWidth: 1,
    margin: 8,
  },
  product: {
    flex: 3,
  },
  infos: {
    flexDirection: 'row',
    alignContent: 'space-around',
  },
  info: {
    justifyContent: 'center',
  },
  trash: {
    width: 20,
    height: 20,
    marginTop: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '300',
    marginVertical: 2,
  },
  contact: {
    flex: 1,
    height: 80,
    alignItems: 'center',
  },
  contactButton: {
    width: 80,
    borderRadius: 12,
    backgroundColor: COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,

  },
  contactText: {
    fontSize: 9,
    fontWeight: '600',
    color: 'white'
  },
  modal: {
    flexDirection: 'row',
    width: 80,
    height: 40,
    borderRadius: 10,
    justifyContent: 'space-around',
    backgroundColor: CLICK_COLOR,
    alignItems: 'center',
  },
  icon: {
    width: 35,
    height: 35,
  }
});

export default CartPage;