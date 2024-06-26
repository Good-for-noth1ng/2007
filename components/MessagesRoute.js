import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Messages from '../screens/Messages'
import GroupList from '../screens/GroupList';
import OpenPost from '../screens/OpenPost';
import Group from '../screens/Group';
import CommentThread from '../screens/CommentThread';
import UserProfile from '../screens/UserProfile';
import ReactedUsersList from '../screens/ReactedUsersList';
import MembersList from '../screens/MembersList';
import FollowersList from '../screens/FollowersList';
import SubscriptionsList from '../screens/SubscriptionsList';
import UsersGroups from '../screens/UsersGroups';
import VideosList from '../screens/VideosList';
import VideoScreen from '../screens/VideoScreen';
import Photos from '../screens/Photos';
import AlbumPhotos from '../screens/AlbumPhotos';
import AlbumVideos from '../screens/AlbumVideos';
import PhotoAlbumsList from '../screens/PhotoAlbumsList';
import VideoAlbumsList from '../screens/VideoAlbumsList';
import VideoComments from '../screens/VideoComments';
import Friends from '../screens/Friends';
import Dialog from '../screens/Dialog';
import Topics from '../screens/Topics';
import Topic from '../screens/Topic';
import OpenedPhoto from '../screens/OpenedPhoto';
import Gifts from '../screens/Gifts';

const MessagesStack = createNativeStackNavigator();

const MessagesRoute = () => {
  return (
    <MessagesStack.Navigator initialRouteName='Messages'>
      <MessagesStack.Screen name='Messages' component={Messages} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='GroupList' component={GroupList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='Group' component={Group} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='OpenPost' component={OpenPost} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='CommentThread' component={CommentThread} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='UserProfile' component={UserProfile} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='ReactedUsersList' component={ReactedUsersList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='MembersList' component={MembersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='FollowersList' component={FollowersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='SubscriptionsList' component={SubscriptionsList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='UsersGroups' component={UsersGroups} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='VideosList' component={VideosList} options={{headerShown:false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='Video' component={VideoScreen} options={{headerShown:false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='Photos' component={Photos} options={{headerShown:false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='AlbumPhotos' component={AlbumPhotos} options={{headerShown:false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='AlbumVideos' component={AlbumVideos} options={{headerShown:false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='PhotoAlbumsList' component={PhotoAlbumsList} options={{headerShown:false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='VideoAlbumsList' component={VideoAlbumsList} options={{headerShown:false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='VideoComments' component={VideoComments} options={{headerShown:false, animation: 'slide_from_right'}} />
      <MessagesStack.Screen name='FriendsList' component={Friends} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='Dialog' component={Dialog} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='Topics' component={Topics} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='Topic' component={Topic} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='OpenedPhoto' component={OpenedPhoto} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <MessagesStack.Screen name='Gifts' component={Gifts} options={{headerShown: false, animation: 'slide_from_right'}}/>
    </MessagesStack.Navigator>
  )
}

export default MessagesRoute

const styles = StyleSheet.create({})