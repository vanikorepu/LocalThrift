import React, {useState, createRef} from 'react';

import {ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackScreenProps } from '../type';

import {COLOR} from '../../assets/setting'
import { ImagesAssets } from '../../assets/images/image_assest';

import {Register} from '../api/api';

function VerificationPage({ navigation, route }: RootStackScreenProps<'Verification'>): JSX.Element {
    const code = route.params.code;
    const name = route.params.name;
    const email = route.params.email;
    const password = route.params.password;
    const phone = route.params.phone;

    const height = Dimensions.get("window").height;
    
    const [codeInput, setCodeInput] = useState('');
    const [disable, setDisable] = useState(false);

    const verification = async () => {
        setDisable(true);
        if (codeInput === code) {
            const res = await Register(name, email, password, phone);
            if (res.state === 1) {
                await AsyncStorage.setItem('user_id', res.id);
                navigation.replace('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}});
            } else {
                setDisable(false);
            }
        } else {
            setDisable(false);
        }
    }
  return (

    <ScrollView 
        automaticallyAdjustKeyboardInsets={true}
        style={{height: height}}>
        <View
            style={{justifyContent: 'center', alignItems: 'center', height: height, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
            <View style={styles.container}>
            <Text style={[styles.title, styles.text]}>Verification</Text>

            <Text style={[styles.subTitle, styles.text]}>You will receive an email with a six-digit verfication code. Please enter the code below and click Verify. 
            </Text>

            <TextInput 
                placeholder="verification code" 
                keyboardType="number-pad"
                maxLength={6}
                autoCapitalize='none'
                style={[styles.input, {marginTop: 10}]} 
                onChangeText={(code) =>
                    setCodeInput(code)
                }
                placeholderTextColor={'gray'}/>

            <TouchableOpacity
                style={[styles.button]}
                activeOpacity={0.5}
                disabled={disable}
                onPress={verification}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <Text style={[styles.text, {fontSize: 12, marginTop: 10, width: '95%'}]}>Didn't receive the email? Please check your spam or click 
                <Text>{' '}</Text>
                <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => {
                    navigation.goBack();
                }}>here</Text> 
                <Text>{' '}</Text>
                to turn back to the previous page to check your information.
            </Text>
            </View>
        </View>
        
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        height: 300,
        width: '90%',
        borderRadius: 15,
    },
    image: {
        marginTop: 50,
        width: 100,
        height: 100,
        borderRadius: 15,
    },
    text: {
        color: 'black',
    },
    title: {
        marginVertical: 20,
        fontSize: 20,
        fontWeight: 'normal',
    },
    subTitle: {
        fontSize: 16,
        width: '90%',
        fontWeight: '300',
    },
    input: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'black',
        height: 40,
        width: '80%',
        marginVertical: 15,
        color: 'black',
        fontWeight: '400',
        fontSize: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: COLOR,
        height: 40,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    }
});

export default VerificationPage;