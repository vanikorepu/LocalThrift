import React, {useLayoutEffect, useState, useCallback} from 'react';

import {SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableOpacity} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';

import { RootStackScreenProps, ProductParamsList } from '../../type';

import { COLOR } from '../../../assets/setting';

import Cross from '../../../assets/icons/cross.svg';

function UploadPage({ navigation, route }: RootStackScreenProps<'UploadPage'>): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => 
      <TouchableOpacity onPress={()=>{
        navigation.navigate('TabNavigationRoutes', {screen: 'Home', params: {screen: 'HomePage'}})
          }}>
        <Cross style={styles.cancel}/>
      </TouchableOpacity>
      // <Button title="Cancel" onPress={() => {
      //   navigation.navigate('TabNavigationRoutes', {screen: 'Home'})
      // }} />
    });
  }, [navigation]);

  const [product, setProduct] = useState<ProductParamsList>({
    id: undefined,
    category: 0,
    price: 0,
    size: '',
    brand: '',
    usage: '',
    meeting: 0,
  })

  const submit = (product: ProductParamsList) => {
    navigation.push('Summary', {product: product});
  }

  // const [catOpen, setCatOpen] = useState(false);
  // const [catValue, setCatValue] = useState(null);
  // const [catItems, setCatItems] = useState([
  //   {label: 'Tops', value: 'tops'},
  //   {label: 'Bottoms', value: 'bottoms'},
  //   {label: 'Winter Clothes', value: 'winter'}
  // ]);

  // const [meetOpen, setMeetOpen] = useState(false);
  // const [meetValue, setMeetValue] = useState(null);
  // const [meetItems, setMeetItems] = useState([
  //   {label: 'On Campus', value: 'on'},
  //   {label: 'Off Campus', value: 'off'}
  // ]);

  // const onCatOpen = useCallback(() => {
  //   setMeetOpen(false);
  // }, []);

  // const onMeetOpen = useCallback(() => {
  //   setCatOpen(false);
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.picture}>
        <Text style={styles.text}>Upload images of your item</Text>
      </View>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{label: "Category"}}
        onValueChange={(value) => console.log(value)}
        items={[
            { label: 'Tops', value: 'tops' },
            { label: 'Bottoms', value: 'bottoms' },
            { label: 'Winter Clothes', value: 'winter' },
        ]}
      />
      {/* <DropDownPicker
        open={catOpen}
        value={catValue}
        items={catItems}
        onOpen={onCatOpen}
        setOpen={setCatOpen}
        setValue={setCatValue}
        setItems={setCatItems}
        placeholder="Category"
        style={pickerSelectStyles.container}
        placeholderStyle={{color: '#BBB'}}
        dropDownContainerStyle={pickerSelectStyles.dropDown}
      /> */}
      <TextInput placeholder="Price" style={styles.input}/>
      <TextInput placeholder="Size" style={styles.input}/>
      <TextInput placeholder="Brand" style={styles.input}/>
      <TextInput placeholder="Usage" style={styles.input}/>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{label: "Meeting Point"}}
        onValueChange={(value) => console.log(value)}
        items={[
            { label: 'On Campus', value: 'on' },
            { label: 'Off Campus', value: 'off' },
        ]}
      />
      {/* <DropDownPicker
        open={meetOpen}
        value={meetValue}
        items={meetItems}
        onOpen={onMeetOpen}
        setOpen={setMeetOpen}
        setValue={setMeetValue}
        setItems={setMeetItems}
        multiple={true}
        placeholder="Meeting Point"
        style={pickerSelectStyles.container}
        placeholderStyle={{color: '#BBB'}}
        dropDownContainerStyle={pickerSelectStyles.dropDown}
      /> */}

      <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {submit(product)}}>
          <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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