import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button, Image, ImageBackground} from 'react-native';

import BuyerHomePage from './buyer_home';
import SellerHomePage from './seller_home';
import ProductListPage from './product_list';
import ProductDescriptionPage from './product_description'
import UploadPage from './upload';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';

import { COLOR, FONT } from '../../../assets/setting';
import { ImagesAssets } from '../../../assets/images/image_assest';

import Upload from '../../../assets/icons/upload.svg';
import Back from '../../../assets/icons/left_arrow.svg';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomePage'
>;

type Props = {
  navigation: NavigationProp;
};

function HomePage({navigation}: Props): JSX.Element {
  return (
    <SafeAreaView>
      <View>
        <View style={styles.placeholder}>
          <ImageBackground source={ImagesAssets.home} resizeMode="cover" style={styles.image}/>
        </View>
        <Text style={styles.text}>What are you looking to do today?</Text>
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => navigation.push('BuyerHomePage')}>
            <ImageBackground source={ImagesAssets.buying} resizeMode="cover" style={styles.image}/>
            <Text style={styles.buttonText}>Buying</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => navigation.push('SellerHomePage')}>
            <ImageBackground source={ImagesAssets.selling} resizeMode="cover" style={styles.image}/>
            <Text style={styles.buttonText}>Selling</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function HomeStack({navigation}: Props): JSX.Element {

  return (
    <Stack.Navigator 
      initialRouteName="HomePage"
      screenOptions={{
        cardStyle: {backgroundColor: 'white'}, 
        headerShadowVisible: false,
        animationEnabled: false
      }}
    >
        <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
              headerShown: true,
              headerTitle: "Explore",
              gestureEnabled: false, 
              headerTitleStyle: styles.headerTitle,
              headerLeft: () => <></>
            }}
        />
        <Stack.Screen
            name="BuyerHomePage"
            component={BuyerHomePage}
            options={{
              headerShown: true,
              headerTitle: "Explore",
              gestureEnabled: false, 
              headerTitleStyle: styles.headerTitle,
              headerLeft: () => <></>
            }}
        />
        <Stack.Screen
            name="ProductListPage"
            component={ProductListPage}
            options={
              ({ route }) => ({ 
                title: route.params.name,
                headerShown: true,
                gestureEnabled: true, 
                headerTitleStyle: styles.headerTitle,
                headerLeft: () => <TouchableOpacity onPress={navigation.goBack}>
                      <Back style={styles.back} stroke={'black'}/>
                </TouchableOpacity>
            })}
        />
        <Stack.Screen
            name="ProductDescriptionPage"
            component={ProductDescriptionPage}
            options={{
              headerShown: true,
              gestureEnabled: false, 
              headerTitleStyle: styles.headerTitle,
              headerLeft: () => <TouchableOpacity onPress={navigation.goBack}>
                    <Back style={styles.back} stroke={'black'}/>
              </TouchableOpacity>
            }}
        />
        <Stack.Screen
            name="SellerHomePage"
            component={SellerHomePage}
            options={{
                headerShown: true,
                headerTitle: "Clothes to Sell",
                gestureEnabled: false, 
                headerTitleStyle: styles.headerTitle,
                headerLeft: () => <></>,
                headerRight: () => <TouchableOpacity onPress={()=>{
                      navigation.push('UploadPage')
                    }}>
                      <Upload style={styles.upload}/>
                </TouchableOpacity>
                
                // <Button title="Upload" onPress={() => {
                //   navigation.push('UploadPage')
                // }} />
            }}
        />
        
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'normal',
  },
  placeholder: {
    height: 130,
    backgroundColor: '#AAA',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    paddingVertical: 10
  },
  button: {
    height: 170,
    borderColor: COLOR,
    borderWidth: 1,
    marginVertical: 3,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'flex-end',
    overflow: 'hidden'
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    flex:1
  },
  buttonText: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    paddingVertical: 1,
    backgroundColor: COLOR,
    overflow: 'hidden',
    borderRadius: 5,
    borderColor: COLOR,
    borderWidth: 1,
    width: 70,
    fontWeight: '600',
    // height: 20,
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
  }
});


export default HomeStack;