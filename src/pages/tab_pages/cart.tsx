import React, {useState, useEffect} from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Linking, Platform} from 'react-native';

import Menu, { MenuItem } from '../../components/manu';

import AsyncStorage from '@react-native-async-storage/async-storage';

import CartProduct from '../../../data/cart.json';
import Empty from '../../../assets/icons/empty.svg';
import {COLOR, CLICK_COLOR} from '../../../assets/setting';

import { TabScreenProps } from '../../type';

import { ImagesAssets } from '../../../assets/images/image_assest';
import Trash from '../../../assets/icons/trash.svg';

import Gmail from '../../../assets/icons/gmail.svg';
import SMS from '../../../assets/icons/sms.svg';

import {RemoveItemFromCart, GetCart, GetImage} from '../../api/api';

function CartPage({ navigation, route }: TabScreenProps<'Cart'>): JSX.Element {
  let user_id = '';
  const [cart, setCart] = useState([]);
  const [load, setLoad] = useState(false);
  const [content, setContent] = useState(<View></View>);
  const [sum, setSum] = useState(0);

  const fetchData = async () => {
    user_id = await AsyncStorage.getItem('user_id');
    // await setUser(id);
    const _cart = await GetCart(user_id);
    await setCart(_cart);
    
    const _sum = _cart.reduce((acc, cur) => acc + cur.products.length, 0);
    await setSum(_sum);
  
    let _content: JSX.Element;
    if (_sum === 0) {
      _content = (<View style={styles.container}>
        <Text style={styles.subTitle}>Your cart is empty!</Text>
        <Empty style={styles.empty}/>
        <TouchableOpacity
            style={[styles.button]}
            activeOpacity={0.5}
            onPress={() => {navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'BuyerHomePage'}})}}>
            <Text style={styles.buttonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>);
    } else {
      _content = (<ScrollView>
        <View style={[styles.container, {paddingTop: 10}]}>
          {_cart.map((items, idx) => (
            <View key={idx}>
              <View style={styles.seller}>
                <View style={styles.product}>
                  {items.products.map((item, index) =>(
                    <View style={styles.infos} key={index}>
                      <Image style={styles.image} source={{uri: GetImage(item.images[0].name)}} resizeMode="cover" />
                      <View style={styles.info}>
                        <Text style={styles.text}>Size: {item.size}</Text>
                        <Text style={styles.text}>Price: ${item.price}</Text>
                        <Text style={styles.text}>Brand: {item.brand}</Text>
                        <Text style={styles.text}>Usage: {item.usage}</Text>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {trash(item._id)}}>
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
    await setContent(_content)

    await setLoad(true)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const trash = async (item: string) => {
    await RemoveItemFromCart(item, user_id);
    fetchData();
  }

  const composeMessage = (items: {}) => {
    let message = 'Hi, I am interested in your product' + ('s' ? items.products.length > 1 : '' ) + ': ';
    for (const item of items.products) {
      message += 'brand:' + item.brand + ' size:' + item.size + ', ';
    }
    message += ('Are they' ? items.products.length > 1 : 'Is it' ) + ' available for sale? If so, can you please let me know a time and place that would work for pickup? What is your preferred mode of payment? Thank you.'
    return message;
  }

  const send_sms = async (items: {}) => {
    let message = composeMessage(items);
    const separator = Platform.OS === 'ios' ? '&' : '?'
    const url = `sms:${items.phone}${separator}body=${encodeURIComponent(message)}`;
    await Linking.openURL(url);
  }

  const send_gmail = async (items: {}) => {
    let message = composeMessage(items);
    const url = `googlegmail://co?to=${items.email}&subject=${subject}&body=${encodeURIComponent(message)}`;
    await Linking.openURL(url);
  }

  return (
    <SafeAreaView>
      <View >
        {load && <Text style={styles.total}>{sum} Items</Text>}
      </View>
      <View>
      {!load && <Text>Loading ...</Text>}
      {load && content}
      </View>
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