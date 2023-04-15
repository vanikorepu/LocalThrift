import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image} from 'react-native';

import { RootStackScreenProps } from '../type';

import {COLOR} from '../../assets/setting'
import { ImagesAssets } from '../../assets/images/image_assest';


function RegisterPage({ navigation, route }: RootStackScreenProps<'Register'>): JSX.Element {
  return (

    <SafeAreaView style={styles.container}>
        <Image source={ImagesAssets.logo} style={styles.image}/>
        <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
        <Text style={[styles.subTitle, styles.text]}>Welcome</Text>

        <TextInput placeholder="Full Name" style={[styles.input, {marginTop: 10}]} placeholderTextColor={'white'}/>
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor={'white'}/>
        <TextInput placeholder="Password" style={styles.input} placeholderTextColor={'white'}/>
        <TextInput placeholder="Mobile Contact" style={styles.input} placeholderTextColor={'white'}/>

        <TouchableOpacity
            style={[styles.button, {width: '80%', marginTop: 10}]}
            activeOpacity={0.5}
            onPress={() => {navigation.replace('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}});}}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={[styles.text, {fontSize: 12, marginTop: 40}]}>Already have an account?</Text>
        <TouchableOpacity
            style={[styles.button, {width: '40%'}]}
            activeOpacity={0.5}
            onPress={() => {navigation.replace('Login');}}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR,
        alignItems: 'center',
        height: '100%',
    },
    image: {
        marginTop: 50,
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    text: {
        color: 'white',
    },
    title: {
        marginTop: 10,
        fontSize: 25,
        fontWeight: 'normal',
    },
    subTitle: {
        marginVertical: 20,
        fontSize: 20,
        fontWeight: '300',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        width: '80%',
        marginVertical: 15,
        color: 'white',
        fontWeight: '200',
    },
    button: {
        backgroundColor: 'white',
        marginVertical: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        color: COLOR,
        fontSize: 14,
    }
});

export default RegisterPage;