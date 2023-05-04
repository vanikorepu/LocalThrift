import React, {useLayoutEffect, useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';

import BuyerHomePage from './buyer_home';
import SellerHomePage from './seller_home';
import ProductListPage from './product_list';

import {createStackNavigator} from '@react-navigation/stack';
import {
  HomeStackScreenProps,
  TabScreenProps,
  HomeStackParamList,
} from '../../type';

import {COLOR} from '../../../assets/setting';
import {ImagesAssets} from '../../../assets/images/image_assest';

import Upload from '../../../assets/icons/upload.svg';
import Back from '../../../assets/icons/left_arrow.svg';

import Category from '../../../data/category.json';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function HomePage({
  navigation,
  route,
}: HomeStackScreenProps<'HomePage'>): JSX.Element {
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.subcontainer, {flex: 1}]}>
        <View style={[styles.subcontainer, {flex: 8}]}>
          <ImageBackground
            source={ImagesAssets.home}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
        <View style={[styles.subcontainer, {flex: 2, justifyContent: 'center'}]}>
          <Text style={styles.text}>What are you looking to do today?</Text>
        </View>
      </View>
      <View style={[styles.subcontainer, {flex: 1, justifyContent: 'center'}]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => navigation.push('BuyerHomePage')}>
          <ImageBackground
            source={ImagesAssets.buying}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={styles.textBox}>
            <Text style={styles.buttonText}>Buying</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.subcontainer, {flex: 1, justifyContent: 'center'}]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => navigation.push('SellerHomePage')}>
          <ImageBackground
            source={ImagesAssets.selling}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={styles.textBox}>
            <Text style={styles.buttonText}>Selling</Text>
          </View>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  subcontainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'normal',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
  },
  button: {
    height: '95%',
    width: '95%',
    borderColor: COLOR,
    borderWidth: 1,
    marginVertical: 3,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  textBox: {
    position: 'absolute',
    height: '12%',
    width: '20%',
    backgroundColor: COLOR,
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  upload: {
    height: 30,
    width: 30,
    marginRight: 20,
  },
  back: {
    height: 20,
    width: 20,
    marginLeft: 20,
  },
});

const Stack = createStackNavigator<HomeStackParamList>();

function HomeStack({navigation, route}: TabScreenProps<'Home'>): JSX.Element {
  return (
    <Stack.Navigator
      id="HomeStack"
      initialRouteName="HomePage"
      screenOptions={{
        cardStyle: {backgroundColor: 'white'},
        headerShadowVisible: false,
        animationEnabled: false,
      }}>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{
          headerShown: true,
          headerTitle: 'Explore',
          gestureEnabled: false,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="BuyerHomePage"
        component={BuyerHomePage}
        options={{
          headerShown: true,
          headerTitle: 'Explore',
          gestureEnabled: false,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        name="ProductListPage"
        component={ProductListPage}
        options={({route}) => ({
          title: Category[route.params.category],
          headerShown: true,
          gestureEnabled: true,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TabNavigationRoutes', {
                  screen: 'Home',
                  params: {screen: 'BuyerHomePage'},
                });
              }}>
              <Back style={styles.back} stroke={'black'} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="SellerHomePage"
        component={SellerHomePage}
        options={{
          headerShown: true,
          headerTitle: 'Clothes to Sell',
          gestureEnabled: false,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => <></>,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.push('UploadPage', {
                  state: 'post',
                  product: undefined,
                  product_id: undefined,
                });
              }}>
              <Upload style={styles.upload} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
