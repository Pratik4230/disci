import React, { useEffect, useState } from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './screens/Login';
import Signup from './screens/Signup';
import Feed from './screens/Feed';
import Video from './screens/Video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Feed: undefined;
  Video: {id: string};
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {


  return (
    <Stack.Navigator>

<Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
<Stack.Screen name="Feed" component={Feed} options={{headerShown: false}} />
<Stack.Screen name="Video" component={Video} options={{headerShown: false}} />
<Stack.Screen name="Signup" component={Signup} options={{headerShown: false}} />

    </Stack.Navigator>
  )
}

export default RootNavigator
