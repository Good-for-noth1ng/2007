import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Friends from '../screens/Friends';
import Group from '../screens/Group';
import ReactedUsersList from '../screens/ReactedUsersList';
import UserProfile from '../screens/UserProfile';
import OpenPost from '../screens/OpenPost';
import CommentThread from '../screens/CommentThread';
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
import Messages from '../screens/Messages';
import Dialog from '../screens/Dialog';
import Favorites from '../screens/Favorites';
import Topics from '../screens/Topics';
import Topic from '../screens/Topic';
import ReactedOnPostUsers from '../screens/ReactedOnPostUsers';
import ReactedOnVideoUsers from '../screens/ReactedOnVideoUsers';
import OpenedPhoto from '../screens/OpenedPhoto';
import ReactedOnPhoto from '../screens/ReactedOnPhoto';
import Gifts from '../screens/Gifts';

const FavoriteStack = createNativeStackNavigator();

const FavoriteRoute = () => {
  return (
    <FavoriteStack.Navigator initialRouteName='Favorites'>
      <FavoriteStack.Screen name='Favorites' component={Favorites} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='UserProfile' component={UserProfile} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='OpenPost' component={OpenPost} options={{headerShown: false, animation: 'slide_from_right'}} />
      <FavoriteStack.Screen name='Friends' component={Friends} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='CommentThread' component={CommentThread} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Group' component={Group} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='ReactedUsersList' component={ReactedUsersList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='MembersList' component={MembersList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='FollowersList' component={FollowersList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='SubscriptionsList' component={SubscriptionsList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='UsersGroups' component={UsersGroups} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='VideosList' component={VideosList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='VideoScreen' component={VideoScreen} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Photos' component={Photos} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='AlbumPhotos' component={AlbumPhotos} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='AlbumVideos' component={AlbumVideos} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='PhotoAlbumsList' component={PhotoAlbumsList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='VideoAlbumsList' component={VideoAlbumsList} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='VideoComments' component={VideoComments} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Messages' component={Messages} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Dialog' component={Dialog} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Topics' component={Topics} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Topic' component={Topic} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='ReactedOnPostUsers' component={ReactedOnPostUsers} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='ReactedOnVideoUsers' component={ReactedOnVideoUsers} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='OpenedPhoto' component={OpenedPhoto} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='ReactedOnPhoto' component={ReactedOnPhoto} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <FavoriteStack.Screen name='Gifts' component={Gifts} options={{headerShown: false, animation: 'slide_from_right'}}/>
    </FavoriteStack.Navigator>
  )
}

export default FavoriteRoute

const styles = StyleSheet.create({})