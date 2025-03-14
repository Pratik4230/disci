import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import api from '../utils/api';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../RootNavigator';
import VideoCard from '../components/VideoCard';



const Feed: React.FC = () => {
  const { data: feed, isPending, isError  } = useQuery<{ videos: any[] }, Error>({
    queryKey: ['feed'],
    queryFn: async (): Promise<{ videos: any[] }> => {
      const response = await api.get('/video/feed?page=1&limit=100');
      
      return response.data;
    },
  });
  
  

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-red-500">Error fetching feed. Try again.</Text>
      </View>
    );
  }

console.log("feeed : ", feed);


  return (
    <View className="bg-black">
      <Text className="text-white font-bold text-4xl mb-7" onPress={() => navigation.navigate('Login')}>
        Feed
      </Text>
      <FlatList
      data={feed?.videos}
      renderItem={({item}) => <VideoCard video={item} /> }
      keyExtractor={(item) => item?._id}
      
      />
    </View>
  );
};

export default Feed;




{/* <ScrollView className='bg-black' >
       <Text className='text-white font-bold text-4xl mb-7 ' >Feed</Text>
    </ScrollView> */}