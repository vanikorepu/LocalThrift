import React, {useState, createRef} from 'react';

import {ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Dimensions} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackScreenProps } from '../type';

import {COLOR} from '../../assets/setting'
import { ImagesAssets } from '../../assets/images/image_assest';

import {GetCode} from '../api/api';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function RegisterPage({ navigation, route }: RootStackScreenProps<'Register'>): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState(false);

    const emailInputRef = createRef<TextInput>();
    const passwordInputRef = createRef<TextInput>();
    const phoneInputRef = createRef<TextInput>();

    const register = async () => {
        setDisable(true);
        setError(false);
        const res = await GetCode(email);
        if (res.state === 1) {
            setDisable(false);
            navigation.navigate('Verification', {code: res.code, email: email, password: password, phone: phone, name: name});
            // await AsyncStorage.setItem('user_id', res.id);
            // navigation.replace('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}});
        } else {
            setError(true);
            setDisable(false);
        }
    }
  return (

    <ScrollView 
        automaticallyAdjustKeyboardInsets={true}
        style={{height: '100%', backgroundColor: COLOR}}>
        <View style={styles.container}>
        <View style={[styles.subcontainer, {flex: 2}]}>
          <View style={[styles.subcontainer, {flex: 8}]}>
            <Image source={ImagesAssets.logo} style={styles.image} />
          </View>
          <View style={[styles.subcontainer, {flex: 2}]}>
            <Text style={[styles.title, styles.text, {position: 'absolute', bottom: 0}]}>LOCALTHRIFT</Text>
          </View>
        </View>
        <View style={[styles.subcontainer, {flex: 3, justifyContent: 'center'}]}>
            <Text style={[styles.subTitle, styles.text]}>Welcome</Text>

            <TextInput 
                placeholder="Full Name" 
                autoCapitalize='none'
                style={[styles.input, {marginTop: 10}]} 
                returnKeyType="next"
                onSubmitEditing={() =>
                    emailInputRef.current &&
                    emailInputRef.current.focus()
                }
                onChangeText={(name) =>
                    setName(name)
                }
                placeholderTextColor={'white'}/>
            <TextInput 
                placeholder="Email" 
                autoCapitalize='none'
                autoCorrect={false}
                inputMode='email'
                returnKeyType="next"
                onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                }
                onChangeText={(email) =>
                    setEmail(email)
                }
                ref={emailInputRef}
                keyboardType='email-address'
                style={styles.input} 
                placeholderTextColor={'white'}/>
            {error && <Text style={[{color: 'red', fontSize: 12}]}>Email already exists. Please use another.</Text>}
            <TextInput 
                placeholder="Password" 
                autoCapitalize='none'
                returnKeyType="next"
                onSubmitEditing={() =>
                    phoneInputRef.current &&
                    phoneInputRef.current.focus()
                }
                onChangeText={(password) =>
                    setPassword(password)
                }
                ref={passwordInputRef}
                secureTextEntry={true}
                style={styles.input} 
                placeholderTextColor={'white'}/>
            <TextInput 
                placeholder="Mobile Contact" 
                inputMode='tel'
                keyboardType='phone-pad'
                returnKeyType="next"
                onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                }
                onChangeText={(phone) =>
                    setPhone(phone)
                }
                ref={phoneInputRef}
                style={styles.input} 
                placeholderTextColor={'white'}/>

            <TouchableOpacity
                style={[styles.button, {width: '80%', marginTop: 10}]}
                activeOpacity={0.5}
                disabled={disable}
                onPress={register}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>

        <View style={[styles.subcontainer, {flex: 1}]}>
            <Text style={[styles.text, {fontSize: 12}]}>Already have an account?</Text>
            <TouchableOpacity
                style={[styles.button, {width: '40%'}]}
                activeOpacity={0.5}
                onPress={() => {navigation.replace('Login');}}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: height,
    },
    subcontainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
    },
    image: {
        position: 'absolute', 
        bottom: 0,
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 15,
    },
    text: {
        color: 'white',
    },
    title: {
        fontSize: 25,
        fontWeight: 'normal',
    },
    subTitle: {
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