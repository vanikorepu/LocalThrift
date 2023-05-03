import React, {useState, useEffect} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {RootStackScreenProps} from '../../type';

import {ImagesAssets} from '../../../assets/images/image_assest';
import {COLOR} from '../../../assets/setting';

import {GetUserProfile, UpdateUserProfile} from '../../api/api';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function ProfileEditPage({
  navigation,
}: RootStackScreenProps<'ProfileEditPage'>): JSX.Element {
  const [user_id, setUser_id] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [load, setLoad] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem('user_id');
    if (id === null) {
      navigation.navigate('Auth');
    } else {
      setUser_id(id);
      const user = await GetUserProfile(id);
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setLoad(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const edit = async () => {
    setDisabled(true);
    await UpdateUserProfile(user_id, name, email, phone);
    setDisabled(false);
    navigation.navigate('TabNavigationRoutes', {
      screen: 'Home',
      params: {screen: 'HomePage'},
    });
  };
  return !load ? (
    <View></View>
  ) : (
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
        <View style={[styles.subcontainer, {flex: 4}]}>
          <Text style={[styles.subTitle, styles.text]}>Edit Profile</Text>
          <TextInput
            placeholder="Full Name"
            autoCapitalize="none"
            onChangeText={name => setName(name)}
            style={[styles.input, {marginTop: 10}]}
            placeholderTextColor={'white'}
            value={name}
          />
          <TextInput
            placeholder="Email"
            autoCorrect={false}
            inputMode="email"
            onChangeText={email => setEmail(email)}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor={'white'}
            value={email}
          />
          <TextInput
            placeholder="Mobile Contact"
            inputMode="tel"
            onChangeText={phone => setPhone(phone)}
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor={'white'}
            value={phone}
          />

          <TouchableOpacity
            style={[styles.button, {width: '80%', marginTop: 10}]}
            activeOpacity={0.5}
            disabled={disabled}
            onPress={edit}>
            <Text style={styles.buttonText}>Save</Text>
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
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'normal',
  },
  subTitle: {
    marginVertical: 20,
    fontSize: 20,
    fontWeight: '300',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
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
  },
});

export default ProfileEditPage;
