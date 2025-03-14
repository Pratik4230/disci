import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../RootNavigator';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { default as V } from 'react-native-video';
import { format, formatDistanceToNow } from 'date-fns';
import Toast from 'react-native-toast-message';
import Comments from '../components/Comments';

const Video: React.FC = () => {
  const [showDescription, setShowDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [content, setContent] = useState<string>("");

  const route = useRoute<RouteProp<RootStackParamList, 'Video'>>();
  const { id } = route.params;

  const { data: video, isPending, isError, refetch } = useQuery({
    queryKey: ['Video', id],
    queryFn: async () => {
      const response = await api.get(`/video/vid/${id}`);
      return response.data;
    }
  });

  const { data: comments, isPending: commentsPending, isError: commentsError, refetch: commentsRefetch } = useQuery({
    queryKey: ['Comments', id],
    queryFn: async () => {
      const response = await api.get(`/comment/video/${id}`);
      return response.data.data ?? [];
    }
  });

  const toggleSubscribe = useMutation({
    mutationFn: async (channelId) => {
      const response = await api.post(`/subscription/subscribe/${channelId}`);
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Subscribe Error',
        text2: error?.response?.data?.message || error?.message,
      });
    }
  });

  const addComment = useMutation({
    mutationFn: async (data: any) => {
      console.log("data : ", data);
      
      const response = await api.post(`/comment/add/${data?.videoId}`, {content: data?.content});
      return response.data
    },
    onSuccess: (data) => {
      setContent("");
      commentsRefetch();
     Toast.show({
      type: "success",
      text1: data.message
     });
     
     
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: "Add comment error",
        text2: error?.response?.data?.message
      })
    }
  });

  const handleAddComment = (videoId: string) => {
    if (content) {
      console.log("content : ", content);
      
      addComment.mutate({videoId: videoId, content: content.trim()})
    }
  }

  if (isPending) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <Text className='text-white'>Video is Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className='flex-1 justify-center items-center bg-black'>
        <Text className='text-red-500'>Video Loading Error</Text>
      </View>
    );
  }

  // console.log("video", video);
  

  return (
    <View className='bg-black' >
      
      <V
        source={{ uri: video?.video }}
        controls
        resizeMode='contain'
        muted
        paused
        style={{ height: 250, width: '100%', backgroundColor: 'black', borderRadius: 1 }}
      />

      {!showDescription && !showComments && (
        <View className='bg-black h-16'>
          <Text className='text-lg font-semibold text-white px-3'>{video?.title}</Text>
          <View className='flex-row gap-2 px-3'>
            <Text className='text-gray-200'>{video?.views} views</Text>
            <Text className='text-gray-200'>{formatDistanceToNow(new Date(video?.createdAt), { addSuffix: true })}</Text>
            <Text onPress={() => setShowDescription(true)} className='text-gray-400'>more</Text>
          </View>

          <View className='flex-row items-center bg-black px-3 py-2'>
            <Image source={{ uri: video?.ownerAvatar }} className='h-12 w-12 rounded-full mr-4' />
            <Text className='text-white'>{video?.owner}</Text>

            <Pressable
              className={video?.isSubscribed ? 'ml-auto mr-3 px-2 py-1.5 bg-gray-900 rounded-xl' : 'ml-auto mr-3 px-2 py-1.5 bg-blue-500 rounded-xl'}
              onPress={() => toggleSubscribe.mutate(video?.channelId)}
            >
              <Text className='text-white font-bold text-lg'>
                {video?.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Text>
            </Pressable>
          </View>

          <View className='bg-black px-3 py-2'>
            <Text className='text-white mb-2'>{video?.likes} likes</Text>
          </View>

         
          <Pressable className='bg-slate-900  px-3 py-2 pb-5' onPress={() => setShowComments(true)} >
            <Text className='text-white pl-2 text-lg font-medium'>Comments {comments?.length}</Text>
            {comments?.[0] && (
              <View className='bg-gray-800 rounded-3xl px-3 py-2 ml-4'>
                <Text className='text-white'>{comments[0].content}</Text>
              </View>
            )}
          </Pressable>
        </View>
      )}

      {/* Full Comments Section */}
      {showComments && (
        <View className='bg-black py-2'>
          <View className='flex-row justify-between px-3 py-2'>
            <Text className='text-white font-medium text-lg'>Comments</Text>
            <Text onPress={() => setShowComments(false)} className='text-white font-medium text-2xl'>X</Text>
          </View>

          <View className='flex-row gap-2 px-3'>
            <Pressable className='px-3 py-2 bg-slate-700 rounded-lg'>
              <Text className='text-white font-medium text-lg'>Top</Text>
            </Pressable>
            <Pressable className='px-3 py-2 bg-slate-700 rounded-lg'>
              <Text className='text-white font-medium text-lg'>Newest</Text>
            </Pressable>
          </View>

          <View className='pt-5 px-7 flex-row gap-2 items-center' >
            <TextInput className='bg-gray-900 h-12 w-[80%] border-2 border-gray-600 px-3 py-2 rounded-lg text-white'  value={content} onChangeText={(text) => setContent(text)}  />
            <Pressable  className='px-3 py-2 bg-green-600 rounded-lg  '  onPress={() => handleAddComment(video._id)}   > <Text className='text-white font-medium text-lg ' >Add</Text> </Pressable>
          </View>

          <View className='bg-black py-2'>
            <FlatList
              data={comments}
              keyExtractor={(item) => item?._id?.toString() ?? Math.random().toString()}
              renderItem={({ item }) => <Comments item={item} />}
            />
          </View>
        </View>
      )}

      {/* Description Section */}
      {showDescription && (
        <View className='bg-black'>
          <View className='flex-row justify-between px-2 border-b-2 py-2'>
            <Text className='text-white text-xl'>Description</Text>
            <Text onPress={() => setShowDescription(false)} className='text-red-50 text-2xl font-bold'>X</Text>
          </View>

          <View>
            <Text className='text-white pl-5 font-medium text-base'>{video?.title ?? 'No title available'}</Text>

            <View className='flex-row justify-around'>
              <View className='flex items-center'>
                <Text className='text-white'>{video?.likes ?? '0'}</Text>
                <Text className='text-white'>Likes</Text>
              </View>
              <View className='flex items-center'>
                <Text className='text-white'>{video?.views ?? '0'}</Text>
                <Text className='text-white'>Views</Text>
              </View>
              <View className='flex items-center'>
                <Text className='text-white'>
                  {video?.createdAt ? format(new Date(video.createdAt), 'dd MMM yyyy') : 'No date'}
                </Text>
              </View>
            </View>

            <View className='m-5 p-2 bg-slate-950 rounded-lg'>
              <Text className='text-white'>{video?.description ?? 'No description available'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Video;
