import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';


import api from '../utils/api';

import { RootStackParamList } from '../RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginForm = {
  emailId: string;
  password: string;
};

const LoginSchema = z.object({
  emailId: z.string().email({ message: 'Invalid email' }).toLowerCase().trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      }
    ),
});

const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  // State for password visibility
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const LoginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await api.post('/user/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('data : ', data);
      AsyncStorage.setItem('token', data.accessToken);
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back! 👋',
      });
      navigation.navigate('Feed');
    },
    onError: (error: any) => {
      console.log('error : ', error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: error?.response?.data?.message || error?.message,
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    LoginMutation.mutate(data);
  };

  return (
    <SafeAreaView className="bg-black flex-1 justify-center items-center w-full">
      <View className="w-[90%]">
        <View className="bg-slate-950 p-6 border border-emerald-500 rounded-md w-full">
          <Text className="text-white font-bold text-4xl mb-7">Login</Text>
          
          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#cbd5e1"
            onChangeText={(text) => setValue('emailId', text)}
            className="bg-gray-900 px-4 text-[#fffbeb] rounded-lg border border-slate-300"
          />
          {errors.emailId && <Text className="text-red-400 px-1">{errors.emailId.message}</Text>}

          {/* Password Input with Eye Icon */}
          <View className="flex-row items-center bg-gray-900 px-4 mt-6 rounded-lg border border-slate-300">
            <TextInput
              placeholder="Password"
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#cbd5e1"
              onChangeText={(text) => setValue('password', text)}
              className="flex-1 text-[#fffbeb]"
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Text className="text-[#fffbeb]">{secureTextEntry ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text className="text-red-400 px-1">{errors.password.message}</Text>}

          {/* Login Button */}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} className="mt-5 items-center bg-red-500 p-3 rounded-lg">
            <Text className="text-white font-bold text-lg">Login</Text>
          </TouchableOpacity>

          {/* Navigation Links */}
          <View className="mt-7 flex-row justify-center">
            <Text className="text-[#e7e5e4] font-medium text-lg">New to Devflix? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-blue-200 font-medium text-lg">Sign up Now.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
              <Text className="text-blue-200 font-medium text-lg"> Feed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
