import React from 'react';

import {SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import ProfileEditPage from './profile_edit';

import { createStackNavigator } from '@react-navigation/stack';
import { TabScreenProps } from '../../type';

function ProfilePage({ navigation, route }: TabScreenProps<'ProfilePage'>): JSX.Element {

    return (
        <SafeAreaView>
        </SafeAreaView>
      );
}

export default ProfilePage;