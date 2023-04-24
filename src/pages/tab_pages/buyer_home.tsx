import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {HomeStackScreenProps} from '../../type';

import {ImagesAssets} from '../../../assets/images/image_assest';
import {COLOR} from '../../../assets/setting';

function BuyerHomePage({
  navigation,
  route,
}: HomeStackScreenProps<'BuyerHomePage'>): JSX.Element {
  return (
    <SafeAreaView>
      <View>
        <Text style={styles.text}>What are you looking to do today?</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            navigation.push('ProductListPage', {category: 0, reload: false});
          }}>
          <ImageBackground
            source={ImagesAssets.tops}
            resizeMode="cover"
            style={styles.image}
          />
          <Text style={styles.buttonText}>Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            navigation.push('ProductListPage', {category: 1, reload: false});
          }}>
          <ImageBackground
            source={ImagesAssets.bottoms}
            resizeMode="cover"
            style={styles.image}
          />
          <Text style={styles.buttonText}>Bottoms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            navigation.push('ProductListPage', {category: 2, reload: false});
          }}>
          <ImageBackground
            source={ImagesAssets.winterwear}
            resizeMode="cover"
            style={styles.image}
          />
          <Text style={styles.buttonText}>Winter Wear</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    paddingBottom: 20,
  },
  button: {
    height: 150,
    borderColor: COLOR,
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 30,
    borderRadius: 20,
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  buttonText: {
    position: 'absolute',
    top: '70%',
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    paddingVertical: 1,
    backgroundColor: COLOR,
    overflow: 'hidden',
    borderRadius: 5,
    borderColor: COLOR,
    borderWidth: 1,
    width: 85,
    fontWeight: '500',
    // height: 20,
  },
});

export default BuyerHomePage;
