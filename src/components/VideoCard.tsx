import React from 'react'
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../RootNavigator';

interface VideoCardProps {
  video: any
}

const VideoCard: React.FC<VideoCardProps> = ({video }) => {

  const {channelName, createdAt, duration, ownerAvatar, thumbnail, title , views , _id} = video

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity className='px-0.5' >
   
   <Pressable onPress={ () => navigation.navigate('Video', {id: _id})} >
       <View className='mb-0.5 rounded-lg' >
       <Image
      className='h-52 rounded-lg'
        source={{
          uri: thumbnail,
        }}
      />
       </View>
       </Pressable>


<View className='flex-row gap-2 p-2 bg-slate-950 border border-gray-800 rounded-lg' >
    <View className=' p-1 '  >
      <Image className='h-10 w-10 rounded-full ' source={{ uri: ownerAvatar  }}
      />
    </View>
    <View  >
      <Text className='text-white text-lg' >{title}</Text>
      <View className='flex-row gap-3 ' ><Text className='  text-gray-300' >{channelName}</Text>
      <Text className='  text-gray-300' >{views} views </Text>
      <Text className=' text-gray-300' >{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</Text>
      </View>
      
    </View>
</View>
    </TouchableOpacity>
  )
}

export default VideoCard
