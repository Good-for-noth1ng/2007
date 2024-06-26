import { Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import OpenedPhoto from '../screens/OpenedPhoto';
import Gifts from '../screens/Gifts';

const PhotoStack = createNativeStackNavigator();

const PhotosRoute = () => {
  return (
    <PhotoStack.Navigator initialRouteName='Photos'>
      <PhotoStack.Screen name='Photos' component={Photos} options={{headerShown:false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='GroupList' component={GroupList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='Group' component={Group} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='OpenPost' component={OpenPost} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='CommentThread' component={CommentThread} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='UserProfile' component={UserProfile} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='ReactedUsersList' component={ReactedUsersList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='MembersList' component={MembersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='FollowersList' component={FollowersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='SubscriptionsList' component={SubscriptionsList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='UsersGroups' component={UsersGroups} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='VideosList' component={VideosList} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='Video' component={VideoScreen} options={{headerShown:false, animation: 'slide_from_right'}}/>
      <PhotoStack.Screen name='AlbumPhotos' component={AlbumPhotos} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='AlbumVideos' component={AlbumVideos} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='PhotoAlbumsList' component={PhotoAlbumsList}options={{headerShown:false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='VideoAlbumsList' component={VideoAlbumsList}options={{headerShown:false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='OpenedPhoto' component={OpenedPhoto} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PhotoStack.Screen name='Gifts' component={Gifts} options={{headerShown:false, animation: 'slide_from_right'}}/>
    </PhotoStack.Navigator>
  )
}

export default PhotosRoute