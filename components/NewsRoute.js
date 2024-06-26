import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import News from '../screens/News'; 
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
import Messages from '../screens/Messages';
import Dialog from '../screens/Dialog';
import ReactedOnPostUsers from '../screens/ReactedOnPostUsers';
import ReactedOnVideoUsers from '../screens/ReactedOnVideoUsers';
import OpenedPhoto from '../screens/OpenedPhoto';
import ReactedOnPhoto from '../screens/ReactedOnPhoto';
import Gifts from '../screens/Gifts';
import Topic from '../screens/Topic';
import Topics from '../screens/Topics';

const PostStack = createNativeStackNavigator();

const NewsRoute = () => {
  
  return (
    <PostStack.Navigator initialRouteName='News'>
      <PostStack.Screen name='News' component={News} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='OpenPost' component={OpenPost} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='Group' component={Group} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='CommentThread' component={CommentThread} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='UserProfile' component={UserProfile} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='ReactedUsersList' component={ReactedUsersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='MembersList' component={MembersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='FollowersList' component={FollowersList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='SubscriptionsList' component={SubscriptionsList} options={{headerShown: false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='UsersGroups' component={UsersGroups} options={{headerShown: false, animation: 'slide_from_right'}}/>    
      <PostStack.Screen name='VideosList' component={VideosList} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='Video' component={VideoScreen} options={{headerShown:false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='Photos' component={Photos} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='AlbumPhotos' component={AlbumPhotos} options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='AlbumVideos' component={AlbumVideos}options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='PhotoAlbumsList' component={PhotoAlbumsList}options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='VideoAlbumsList' component={VideoAlbumsList}options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='VideoComments' component={VideoComments}options={{headerShown:false, animation: 'slide_from_right'}} />
      <PostStack.Screen name='FriendsList' component={Friends} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='Messages' component={Messages} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='Dialog' component={Dialog} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='ReactedOnPostUsers' component={ReactedOnPostUsers} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='ReactedOnVideoUsers' component={ReactedOnVideoUsers} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='OpenedPhoto' component={OpenedPhoto} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='ReactedOnPhoto' component={ReactedOnPhoto} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='Gifts' component={Gifts} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='Topics' component={Topics} options={{headerShown: false, animation: 'slide_from_right'}}/>
      <PostStack.Screen name='Topic' component={Topic} options={{headerShown: false, animation: 'slide_from_right'}}/>
    </PostStack.Navigator>
  )
}

export default NewsRoute