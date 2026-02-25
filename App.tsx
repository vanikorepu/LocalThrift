import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <PortalProvider>
      <NavigationContainer>
        <AppNavigator />
        <PortalHost name="menu" />
      </NavigationContainer>
    </PortalProvider>
  );
}

export default App;
