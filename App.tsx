import './gesture-handler'; //must first
import React from 'react';


import './global.css'
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/RootNavigator';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';


const queryClient = new QueryClient();

function App(): React.JSX.Element {
 
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
      <RootNavigator/>
      <Toast />
      </QueryClientProvider>
    </NavigationContainer>
  );
}


export default App;
