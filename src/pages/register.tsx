import React, {useState, createRef} from 'react';

import {ScrollView, KeyboardAvoidingView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackScreenProps, UserProfileParamsList } from '../type';

import {COLOR} from '../../assets/setting'
import { ImagesAssets } from '../../assets/images/image_assest';

import {Register} from '../api/api';

function RegisterPage({ navigation, route }: RootStackScreenProps<'Register'>): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const emailInputRef = createRef<TextInput>();
    const passwordInputRef = createRef<TextInput>();
    const phoneInputRef = createRef<TextInput>();
    
    const register = async () => {
        const res = await Register(name, email, password, phone);
        if (res.state === 1) {
            await AsyncStorage.setItem('user_id', res.id);
            navigation.replace('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}});
        } else {
            return;
        }
    }
  return (

    <ScrollView 
        automaticallyAdjustKeyboardInsets={true}
        style={{height: '100%', backgroundColor: COLOR}}>
        <View style={styles.container}>
        <Image source={ImagesAssets.logo} style={styles.image}/>
        <Text style={[styles.title, styles.text]}>LOCALTHRIFT</Text>
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
            onPress={register}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={[styles.text, {fontSize: 12, marginTop: 40}]}>Already have an account?</Text>
        <TouchableOpacity
            style={[styles.button, {width: '40%'}]}
            activeOpacity={0.5}
            onPress={() => {navigation.replace('Login');}}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
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