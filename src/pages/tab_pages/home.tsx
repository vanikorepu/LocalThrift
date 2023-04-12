import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';

import BuyerHomePage from './buyer_home';
import SellerHomePage from './seller_home';
import ProductListPage from './product_list';
import ProductDescriptionPage from './product_description'
import UploadPage from './upload';

import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';


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
      <View >
        <Text>What are you looking to do today?</Text>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push('BuyerHomePage')}>
            <Text>BUYER</Text>
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push('SellerHomePage')}>
            <Text>SELLER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

function HomeStack({navigation}: Props): JSX.Element {

  return (
    <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{headerShown: true,
              gestureEnabled: false, 
              headerLeft: () => <></>
            }}
        />
        <Stack.Screen
            name="BuyerHomePage"
            component={BuyerHomePage}
            options={{
              headerShown: true,
              gestureEnabled: false, 
              headerLeft: () => <></>
            }}
        />
        <Stack.Screen
            name="ProductListPage"
            component={ProductListPage}
            options={{
              headerShown: true,
              gestureEnabled: true, 
              headerLeft: () => <Button title="back" onPress={navigation.goBack} />
            }}
        />
        <Stack.Screen
            name="ProductDescriptionPage"
            component={ProductDescriptionPage}
            options={{
              headerShown: true,
              gestureEnabled: false, 
              headerLeft: () => <Button title="back" onPress={navigation.goBack} />
            }}
        />
        <Stack.Screen
            name="SellerHomePage"
            component={SellerHomePage}
            options={{
                headerShown: true,
                gestureEnabled: false, 
                headerLeft: () => <></>,
                headerRight: () => <Button title="Upload" onPress={() => navigation.push('UploadPage')} />
            }}
        />
        <Stack.Screen
            name="UploadPage"
            component={UploadPage}
            options={{
                headerShown: true,
                gestureEnabled: false, 
                headerLeft: () => <Button title="back" onPress={navigation.goBack} />
            }}
        />
    </Stack.Navigator>
  );
}


export default HomeStack;