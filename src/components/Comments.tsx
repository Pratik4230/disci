import React from 'react'
import { Image, Text, View } from 'react-native'
import { formatDistanceToNow } from 'date-fns'

interface CommentsProps {
  item: any
}

const Comments:React.FC<CommentsProps> = ({item}) => {

  // console.log("Item : ", item);
  const {avatar, channelName, createdAt, content, likeCount} = item

 
  

  return (
    <View className='bg-black p-2  border-b-2 border-gray-800 rounded-lg my-2 ' >
        <View className='flex-row gap-2 px-3 py-1 ' >
         {avatar ? <Image source={{uri: avatar}} className='h-10 w-10 rounded-full ' /> : <Text className='text-white  font-bold text-2xl h-10 w-10 rounded-full  ' > {channelName[0]}</Text> } 
          <View>
            <Text className='text-gray-200 ' > {channelName}  { formatDistanceToNow(new Date(createdAt), { addSuffix: true })} </Text> 
            <Text className='text-white  ' > {content} </Text>
          </View>
        </View>
      
    </View>
  )
}

export default Comments


{/* <View className='flex-row gap-2 px-3 py-2 ' >
     <Image source={{uri: item?.ownerAvatar}} className='h-10 w-10 rounded-full ' />
     <View className='flex-row gap-2 ' > 
     <Text className='text-white font-medium text-lg ' >{item?.owner}</Text>
     <Text className='text-white font-medium text-lg ' >{item?.createdAt}</Text>
     </View>
     <Text className='text-white font-medium text-lg ' >{item?.content}</Text>
   </View> */}