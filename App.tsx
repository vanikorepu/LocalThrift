/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import SplashPage from './src/pages/splash';
import LoginPage from './src/pages/login';
import RegisterPage from './src/pages/register';
import TabNavigationRoutes from './src/pages/tab_navigation_routes';
import UploadPage from './src/pages/tab_pages/upload';
import Summary from './src/pages/tab_pages/summary';

import { RootStackParamList } from './src/type';

import { FONT } from './assets/setting';

import setDefaultProps from 'react-native-simple-default-props'

const defaultText = {
  style: [{fontFamily: FONT}],
};

setDefaultProps(Text, defaultText)

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Settings!</Text>
//     </View>
//   );
// }

// function HomeScreen(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//         <StatusBar
//           barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//           backgroundColor={backgroundStyle.backgroundColor}
//         />
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={backgroundStyle}>
//           <Header />
//           <View
//             style={{
//               backgroundColor: isDarkMode ? Colors.black : Colors.white,
//             }}>
//             <Section title="Step One">
//               test test test
//               Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//               screen and then come back to see your edits.
//             </Section>
//             <Section title="See Your Changes">
//               <ReloadInstructions />
//             </Section>
//             <Section title="Debug">
//               <DebugInstructions />
//             </Section>
//             <Section title="Learn More">
//               Read the docs to discover what to do next:
//             </Section>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//   );
// }

function Auth(): JSX.Element {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{cardStyle: { backgroundColor: 'white' }}}
    >
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{
          title: 'Login', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: styles.headerTitle,
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomePage'
>;

type Props = {
  navigation: NavigationProp;
};

function App({navigation}: Props): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          cardStyle: { backgroundColor: 'white' }
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            headerShown: false, 
          }}
        />
        <Stack.Screen
          name="TabNavigationRoutes"
          component={TabNavigationRoutes}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UploadPage"
          component={UploadPage}
          options={{
              presentation: 'modal',
              animationEnabled: false,
              headerTitleStyle: styles.headerTitle,
              // animationTypeForReplace: 'pop',
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "Upload",
              gestureEnabled: false, 
              headerLeft: () => <></>,
          }}
          />
        <Stack.Screen
          name="Summary"
          component={Summary}
          options={{
              presentation: 'modal',
              animationEnabled: false,
              headerTitleStyle: styles.headerTitle,
              // animationTypeForReplace: 'pop',
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "Summary",
              gestureEnabled: false, 
              headerLeft: () => <></>,
          }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'normal',
  },
  // sectionContainer: {
  //   marginTop: 32,
  //   paddingHorizontal: 24,
  // },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
  // header: {
  //   fontFamily: FONT
  // }
});

export default App;
