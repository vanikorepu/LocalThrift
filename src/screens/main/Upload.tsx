import React, { useLayoutEffect, useState, createRef } from 'react';
import {
  ScrollView, StyleSheet, Text, View,
  TextInput, TouchableOpacity, Image,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { RootStackScreenProps, ProductParamsList, ImageParamsList } from '../../types';
import { COLOR } from '../../settings';
import Category from '../../data/category.json';
import MeetingPoint from '../../data/meeting_point.json';

function UploadPage({ navigation, route }: RootStackScreenProps<'UploadPage'>): JSX.Element {
  const state = route.params.state;
  const product = route.params.product;
  const product_id = route.params.product_id;

  const [photos, setPhotos] = useState<(ImageParamsList | undefined)[]>(
    product === undefined ? [undefined, undefined, undefined, undefined]
    : [...product.images!, ...new Array(4 - product.images!.length).fill(undefined)],
  );
  const [count, setCount] = useState(product === undefined ? 0 : product.images!.length);
  const [price, setPrice] = useState(product?.price ?? '');
  const [size, setSize] = useState(product?.size ?? '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [usage, setUsage] = useState(product?.usage ?? '');
  const [category, setCategory] = useState<number | undefined>(product?.category);
  const [meeting, setMeeting] = useState<number | undefined>(product?.meeting);

  const sizeRef = createRef<TextInput>();
  const brandRef = createRef<TextInput>();
  const usageRef = createRef<TextInput>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: state === 'post' ? 'Upload' : 'Edit Post',
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('TabNavigationRoutes', {
              screen: 'Home',
              params: { screen: 'SellerHomePage', params: { reload: false } },
            })
          }>
          <Text style={styles.cancelBtn}>✕</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const takePhoto = async () => {
    if (count >= 4) return;
    const result = await launchCamera({ mediaType: 'photo', maxWidth: 500, maxHeight: 500 });
    if (result.didCancel || result.errorMessage || !result.assets) return;
    const newPhotos = [...photos];
    newPhotos[count] = {
      name: result.assets[0].fileName!,
      type: result.assets[0].type!,
      uri: result.assets[0].uri!,
      width: result.assets[0].width!,
      height: result.assets[0].height!,
    };
    setPhotos(newPhotos);
    setCount(count + 1);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    newPhotos.push(undefined);
    setPhotos(newPhotos);
    setCount(count - 1);
  };

  const submit = () => {
    const p: ProductParamsList = {
      price, size, brand, usage, category, meeting,
      images: photos.filter(Boolean) as ImageParamsList[],
    };
    navigation.push('Summary', { state, product: p, product_id });
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets style={{ height: '100%' }}>
      <View style={styles.container}>
        <View style={styles.picture}>
          <Text style={styles.pictureTitle}>Upload images of your item</Text>
          <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
            <Text style={styles.plusText}>＋</Text>
          </TouchableOpacity>
          <View style={styles.images}>
            {photos.map((photo, index) =>
              photo ? (
                <View key={index}>
                  <Image source={{ uri: photo.uri }} style={styles.image} />
                  <TouchableOpacity onPress={() => removePhoto(index)} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View key={index} style={styles.image} />
              ),
            )}
          </View>
        </View>

        <Picker
          selectedValue={category}
          style={styles.picker}
          onValueChange={val => setCategory(val)}>
          <Picker.Item label="Select Category" value={undefined} />
          {Category.map((cat, i) => <Picker.Item key={i} label={cat} value={i} />)}
        </Picker>

        <TextInput
          style={styles.input} placeholder="Price" placeholderTextColor="#AAA"
          autoCorrect={false} autoCapitalize="none" keyboardType="number-pad"
          returnKeyType="next" onSubmitEditing={() => sizeRef.current?.focus()}
          onChangeText={setPrice} value={price}
        />
        <TextInput
          style={styles.input} placeholder="Size" placeholderTextColor="#AAA"
          autoCorrect={false} autoCapitalize="none" returnKeyType="next"
          onSubmitEditing={() => brandRef.current?.focus()}
          onChangeText={setSize} value={size} ref={sizeRef}
        />
        <TextInput
          style={styles.input} placeholder="Brand" placeholderTextColor="#AAA"
          autoCorrect={false} autoCapitalize="none" returnKeyType="next"
          onSubmitEditing={() => usageRef.current?.focus()}
          onChangeText={setBrand} value={brand} ref={brandRef}
        />
        <TextInput
          style={styles.input} placeholder="Usage" placeholderTextColor="#AAA"
          autoCorrect={false} autoCapitalize="none" returnKeyType="done"
          onChangeText={setUsage} value={usage} ref={usageRef}
        />

        <Picker
          selectedValue={meeting}
          style={styles.picker}
          onValueChange={val => setMeeting(val)}>
          <Picker.Item label="Select Meeting Point" value={undefined} />
          {MeetingPoint.map((mp, i) => <Picker.Item key={i} label={mp} value={i} />)}
        </Picker>

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  picture: {
    width: '90%',
    backgroundColor: COLOR,
    height: 170,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  pictureTitle: { paddingTop: 10, color: 'white', fontSize: 15 },
  cameraButton: {
    width: 40, height: 40, backgroundColor: 'white',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  plusText: { fontSize: 24, color: COLOR },
  images: {
    width: '100%', height: 70, flexDirection: 'row',
    justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20, marginTop: 10,
  },
  image: { width: 50, height: 50, borderRadius: 5, backgroundColor: 'white' },
  deleteButton: {
    position: 'absolute', top: -8, left: -8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#AAA', alignItems: 'center', justifyContent: 'center',
  },
  deleteText: { fontSize: 10, color: 'white' },
  picker: { width: '85%', marginVertical: 5 },
  input: {
    width: '85%', height: 40, marginVertical: 5, paddingLeft: 20,
    borderColor: '#AAA', borderWidth: 1, borderRadius: 20,
  },
  button: {
    width: 70, height: 40, marginVertical: 20,
    borderColor: '#AAA', borderWidth: 1, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontSize: 15 },
  cancelBtn: { marginRight: 20, fontSize: 18, color: COLOR },
});

export default UploadPage;
