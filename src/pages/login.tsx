import React, {useState, createRef} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Dimensions
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootStackScreenProps} from '../type';

import {COLOR} from '../../assets/setting';
import {ImagesAssets} from '../../assets/images/image_assest';

import {Login} from '../api/api';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function LoginPage({
  navigation,
  route,
}: RootStackScreenProps<'Login'>): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled,setDisabled]=useState(false);
  const [error, setError] = useState(false);

  const passwordInputRef = createRef<TextInput>();

  const login = async () => {
    setDisabled(true);
    setError(false);
    const res = await Login(email, password);
    
    if (res.state === 1) {
      setDisabled(false);
      await AsyncStorage.setItem('user_id', res.id);
      navigation.replace('TabNavigationRoutes', {
        screen: 'Home',
        params: {screen: 'HomePage'},
      });
      
    } else {
      setError(true);
      setDisabled(false);
    }
  };

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
          <Text style={[styles.subTitle, styles.text]}>Hello</Text>

          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            inputMode="email"
            keyboardType="email-address"
            placeholder="Email"
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current && passwordInputRef.current.focus()
            }
            onChangeText={email => setEmail(email)}
            style={styles.input}
            placeholderTextColor={'white'}
          />
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={password => setPassword(password)}
            ref={passwordInputRef}
            onSubmitEditing={Keyboard.dismiss}
            returnKeyType="next"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor={'white'}
          />
          {error && <Text style={{fontSize: 12, marginBottom: 10, width: '95%', color: 'red', textAlign: 'center'}}>Login Failed. Please check your email and password again.</Text>}

          <TouchableOpacity
            style={[styles.button, {width: '80%', marginTop: 10}]}
            activeOpacity={0.5}
            disabled={disabled}
            onPress={login}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.text,
              {fontSize: 10, fontWeight: '300', marginTop: 3, marginBottom: '15%'},
            ]}>
            Forgot password?
          </Text>
        </View>
        
        <View style={[styles.subcontainer, {flex: 1}]}>
          <Text style={[styles.text, {fontSize: 12}]}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            style={[styles.button, {width: '40%'}]}
            activeOpacity={0.5}
            
            onPress={() => {
              navigation.replace('Register');
            }}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginVertical: '5%',
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
  },
});

export default LoginPage;
