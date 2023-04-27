import React, {useLayoutEffect, useState, createRef} from 'react';

import {ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import RNPickerSelect from 'react-native-picker-select';


import { RootStackScreenProps, ProductParamsList, ImageParamsList } from '../../type';

import { COLOR } from '../../../assets/setting';

import Cross from '../../../assets/icons/cross.svg';
import Plus from '../../../assets/icons/plus.svg';

import Category from '../../../data/category.json';
import MeetingPoint from '../../../data/meeting_point.json';


function UploadPage({ navigation, route }: RootStackScreenProps<'UploadPage'>): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: state === "post" ? 'Upload' : "Edit Post",
      headerRight: () => 
      <TouchableOpacity onPress={()=>{
        navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'SellerHomePage'}})
          }}>
        <Cross style={styles.cancel}/>
      </TouchableOpacity>
    });
  }, [navigation]);

  const state = route.params.state;
  const product = route.params.product;
  const product_id = route.params.product_id;

  const [photos, setPhotos] = useState<ImageParamsList[]>(product === undefined ? [...new Array(4)] : [...product.images, ...new Array(4 - product.images.length)]);
  const [count, setCount] = useState(product === undefined ? 0 : product.images.length);
  const [price, setPrice] = useState(product === undefined ? '' : product.price);
  const [size, setSize] = useState(product === undefined ? '' : product.size);
  const [brand, setBrand] = useState(product === undefined ? '' : product.brand);
  const [usage, setUsage] = useState(product === undefined ? '' : product.usage);
  const [category, setCategory] = useState(product === undefined ? undefined : product.category);
  const [meeting, setMeeting] = useState(product === undefined ? undefined : product.meeting);

  const sizeInputRef = createRef<TextInput>();
  const brandInputRef = createRef<TextInput>();
  const usageInputRef = createRef<TextInput>();
  

  const takePhotoFromCamera = async () => {
    if (count >= 4) {
      return;
    }
    const result = await launchCamera({
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
    });
    if (result.didCancel) {
      return;
    }
    if (result.errorMessage) {
      return;
    }
    if (result.assets) {
      photos[count] = {
        name: result.assets[0].fileName,
        type: result.assets[0].type,
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
      };
      setCount(count + 1);
    }
  };

  const renderPhoto = (index: number) => {
    if (photos[index] === undefined) {
      return (
        <View style={styles.image}>
        </View>
      );
    } else {
      return (
        <View>
          <Image
            source={{uri: photos[index].uri}}
            style={styles.image}
          />
          <TouchableOpacity 
            activeOpacity={0.5}
            onPress={() => {
              photos.splice(index, 1);
              photos.push(undefined)
              setPhotos(photos);
              setCount(count - 1);
            }}
            style={styles.deleteButton}>
            <Cross style={styles.delete}/>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const submit = () => {
    const product: ProductParamsList = {
      price: price,
      size: size,
      brand: brand,
      usage: usage,
      category: category,
      meeting: meeting,
      images: photos.filter((photo) => photo !== undefined)
    };
    navigation.push('Summary', {state: state, product: product, product_id: product_id});
  }


  return (
    <ScrollView 
        automaticallyAdjustKeyboardInsets={true}
        style={{height: '100%'}}>
      <View style={styles.container}>
        <View style={styles.picture}>
          <Text style={styles.text}>Upload images of your item</Text>
          <TouchableOpacity 
            onPress={async () => {await takePhotoFromCamera()}}
            style={styles.cameraButton}>
            <Plus style={styles.plus}/>
          </TouchableOpacity>
          <View style={styles.images}>
            {photos.map((photo, index) => renderPhoto(index))}
          </View>
        </View>
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{label: "Category"}}
          onValueChange={(cat) => 
            setCategory(cat)
          }
          value={category}
          items={Category.map((cat, index) => {return {label: cat, value: index}})}
        />
        <TextInput 
          autoCorrect={false} 
          placeholderTextColor={'#AAA'}
          autoCapitalize='none'
          placeholder="Price" 
          returnKeyType="next"
          keyboardType="number-pad"
          onSubmitEditing={() =>
            sizeInputRef.current &&
            sizeInputRef.current.focus()
          }
          onChangeText={(price) =>
              setPrice(price)
          }
          value={price}
          style={styles.input}/>
        <TextInput 
          placeholder="Size" 
          placeholderTextColor={'#AAA'}
          autoCorrect={false} 
          autoCapitalize='none'
          returnKeyType="next"
          onSubmitEditing={() =>
            brandInputRef.current &&
            brandInputRef.current.focus()
          }
          onChangeText={(size) =>
              setSize(size)
          }
          value={size}
          style={styles.input}/>
        <TextInput 
          placeholder="Brand" 
          placeholderTextColor={'#AAA'}
          autoCorrect={false} 
          autoCapitalize='none'
          returnKeyType="next"
          onSubmitEditing={() =>
            usageInputRef.current &&
            usageInputRef.current.focus()
          }
          onChangeText={(brand) =>
              setBrand(brand)
          }
          value={brand}
          style={styles.input}/>
        <TextInput 
          placeholder="Usage" 
          placeholderTextColor={'#AAA'}
          autoCorrect={false} 
          autoCapitalize='none'
          returnKeyType="next"
          onChangeText={(usage) =>
              setUsage(usage)
          }
          value={usage}
          style={styles.input}/>
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{label: "Meeting Point"}}
          onValueChange={(meeting) => 
            setMeeting(meeting)
          }
          value={meeting}
          items={MeetingPoint.map((meeting, index) => {return {label: meeting, value: index}})}
        />

        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => {submit()}}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
  },
  picture: {
    width: '90%',
    backgroundColor: COLOR,
    height: 170,
    borderColor: COLOR,
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  cameraButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  plus: {
    width: 30,
    height: 30,
  },
  images: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#AAA',
    borderColor: 'black',
  },
  delete: {
    width: 10,
    height: 10,
  },
  text: {
    paddingTop: 10,
    color: 'white',
    fontSize: 15,
  },
  input: {
    width: '85%',
    height: 40,
    marginVertical: 5,
    paddingLeft: 20,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 20,
  },
  button: {
    width: 70,
    height: 40,
    marginVertical: 20,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
  cancel: {
    marginRight: 20,
    width: 20,
    height: 20,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '85%',
    height: 40,
    marginLeft: '7.5%',
    marginVertical: 5,
    paddingLeft: 20,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 20,
  },
  container: {
    width: '85%',
    height: 40,
    marginLeft: '7.5%',
    marginVertical: 5,
    paddingLeft: 20,
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 20,
  },
  dropDown: {
    width: '85%',
    marginLeft: '7.5%',
  }
});

export default UploadPage;