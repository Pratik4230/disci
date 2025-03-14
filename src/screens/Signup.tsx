import React from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {z} from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../RootNavigator';


type SignupForm = {
  emailId: string;
  password: string;
  userName: string;
  channelName: string;

}

const SignupSchema = z.object({
   emailId: z.string().email({message: 'Invalid email'}).toLowerCase().trim(),
   userName: z.string().trim().min(3, { message: 'Username must be at least 3 characters' }),
   channelName: z.string().trim().min(3, { message: 'Channel name must be at least 3 characters' }),
   password: z.string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
    { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' }
  )

})


const Signup = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

const {register, handleSubmit, setValue, formState: {errors}, } = useForm<SignupForm>({resolver: zodResolver(SignupSchema)})

  const onSubmit = (data: SignupForm) => {
    console.log(data);
  }

  return (
    <SafeAreaView className='bg-black flex-1 justify-center items-center w-full ' >
      <View className='w-[90%]' >
      <View className='bg-slate-950 p-6 border border-emerald-500 rounded-md w-full ' >
        <Text className='text-white font-bold text-4xl mb-7 ' >Signup</Text>


        <TextInput
        placeholder='Username'
        placeholderTextColor={"#cbd5e1"}
        onChangeText={(text) => setValue('userName', text)}
        className='bg-gray-900 px-4  text-[#fffbeb] rounded-lg border border-slate-300'
        />
        {errors.userName && (
          <Text className='text-red-400 px-1 '>{errors.userName.message}</Text>
        )}

<TextInput
        placeholder='Channel Name'
        placeholderTextColor={"#cbd5e1"}
        onChangeText={(text) => setValue('channelName', text)}
        className='bg-gray-900 px-4 mt-6   text-[#fffbeb] rounded-lg border border-slate-300'
        />
        {errors.channelName && (
          <Text className='text-red-400 px-1 '>{errors.channelName.message}</Text>
        )}

     <TextInput
     placeholder='Email'
     placeholderTextColor={"#cbd5e1"}
     onChangeText={(text) => setValue('emailId', text)}
     className='bg-gray-900 px-4 mt-6   text-[#fffbeb] rounded-lg border border-slate-300'
/>
{errors.emailId && (
  <Text className='text-red-400 px-1 '>{errors.emailId.message}</Text>
)}

 <TextInput
 placeholder='Password'
 secureTextEntry
 placeholderTextColor={"#cbd5e1"}
 onChangeText={(text) => setValue('password', text)}
 className='bg-gray-900 px-4 mt-6  text-[#fffbeb] rounded-lg border border-slate-300'
/>

{
  errors.password && (
    <Text className='text-red-400 px-1 ' >{errors.password.message}</Text>
  )
}

  <TouchableOpacity onPress={handleSubmit(onSubmit)}
  className='mt-5 items-center bg-red-500 p-3 rounded-lg'
  >
    <Text className='text-white font-bold text-lg ' >Signup</Text>
  </TouchableOpacity>

  <View className="mt-7 flex-row justify-center">
  <Text className="text-[#e7e5e4] font-medium text-lg">
    Already have an account?{' '}
  </Text>
  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    <Text className="text-blue-200 font-medium text-lg">Login Now.</Text>
  </TouchableOpacity>
</View>

      </View>
      </View>
    </SafeAreaView>
  )
}

export default Signup;
