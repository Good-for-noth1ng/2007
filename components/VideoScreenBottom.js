import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getShortagedNumber } from '../utils/numShortage'
import { COLORS } from '../constants/theme'

const VideoScreenBottom = ({likes, reposts, isLiked, isLightTheme, likePressHandler, repostPresshandler, comments, canComment, navigation, ownerId, videoId}) => {
  const onLikePress = () => {
    likePressHandler(isLiked)
  }

  const navigateToComments = () => {
    navigation.push('VideoComments', {ownerId, videoId})
  }

  const navigateToReactedUsersList = () => {
    navigation.push('ReactedOnVideoUsers', {ownerId, videoId})
  } 

  return (
    <View style={styles.iconsContainer}>
      <View style={{flexDirection: 'row', gap: 20}}>
        <TouchableOpacity style={styles.iconContainer} onPress={onLikePress} onLongPress={navigateToReactedUsersList}>
          {
            isLiked ?
            <AntDesign name='heart' size={23} color={COLORS.primary}/> :
            <AntDesign name='hearto' size={23} color={COLORS.secondary}/>
          }
          <Text style={[styles.iconText]}>
            {getShortagedNumber(likes)} 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Fontisto name='share-a' size={23} color={COLORS.secondary}/>
          <Text style={styles.iconText}>{reposts}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.iconContainer} activeOpacity={canComment === 1 ? 0.8 : 1} onPress={navigateToComments}>
        <MaterialCommunityIcons name='comment' size={23} color={COLORS.secondary}/>
        <Text style={styles.iconText}>{comments}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default VideoScreenBottom

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    // gap: 20,
    // height: 30
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary
  }
})