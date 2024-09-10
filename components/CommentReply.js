import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { setUserID } from '../redux/userWallSlice'
import CommentBottom from './CommentBottom'
// import CommentPhotos from './CommentPhotos'
import CommentAttachments from './CommentAttachments'
import { COLORS } from '../constants/theme'
import { getHyperlinkInText } from '../utils/hyperlinks'

const CommentReply = ({lang, fetchProfileInfo, from_id, commentText, commentDate, likes, isLightTheme, openCommentMenu, commentId, ownerId, navigation, attachments, author, is_deleted}) => {
  const name = author.name ? author.name : `${author.first_name} ${author.last_name}` 
  const photoUrl = author.photo_100
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)

  const colorTransitionAnimation = useRef(new Animated.Value(0)).current
  const commentBgEndColor = isLightTheme ? COLORS.light_blue : COLORS.light_black
  const commentReplyBgInitColor = isLightTheme ? COLORS.white : COLORS.primary_dark
  const commentReplyBgColor = colorTransitionAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [commentReplyBgInitColor, commentBgEndColor]
  })

  const handleProfilePress = () => {
    if (from_id > 0) {
      navigation.push('UserProfile', {userId: from_id})
    } else if (from_id < 0) {
      navigation.push('Group', {groupId: (-1 * from_id)})
    }
  }

  const handleLikePress = () => {
    if(!isLiked) {
      setLikesCount(prevState => prevState + 1);
      setIsLiked(true);
    } else {
      setLikesCount(prevState => prevState - 1);
      setIsLiked(false);
    }
  }

  const onPressIn = () => {
    Animated.timing(colorTransitionAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false
    }).start();
  }

  const onPressOut = () => {
    Animated.timing(colorTransitionAnimation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false
    }).start();
  }

  const handleLongPress = () => {
    fetchProfileInfo(from_id, name, photoUrl, commentId)
    openCommentMenu()
  }

  return (
    <Pressable 
      onPressIn={onPressIn} 
      onPressOut={onPressOut} 
      unstable_pressDelay={100} 
      onLongPress={handleLongPress}
      delayLongPress={1000}
    >
      <Animated.View 
        style={[styles.commentReplyContainer, {backgroundColor: commentReplyBgColor}]}
      >
        <TouchableOpacity activeOpacity={1} style={styles.imageContainer} onPress={handleProfilePress}>
          <Image source={is_deleted ? require('../assets/avatars/banned-light.jpg') : {uri: photoUrl}} style={styles.image}/>
        </TouchableOpacity>
        <View style={styles.commentConentContainer}>
          <TouchableOpacity activeOpacity={1} onPress={handleProfilePress}>
            <Text 
              style={[
                styles.authorName, 
                isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.replyText, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
            {getHyperlinkInText(commentText)}
          </Text>
          {attachments ? <CommentAttachments lang={lang} ownerId={ownerId} attachments={attachments} navigation={navigation} isLightTheme={isLightTheme} author={author}/> : null}
          <CommentBottom lang={lang} likesCount={likesCount} handleLikePress={handleLikePress} date={commentDate} isLiked={isLiked}/>
        </View>
      </Animated.View>
    </Pressable>
  )
}

export default CommentReply

const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
  },
  imageContainer: {
    marginRight: 7
  },
  image: {
    width: 32, 
    height: 32, 
    borderRadius: 100,
  },
  commentReplyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    width: '90%',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
  },
  commentConentContainer: {
    width: '86%',
  },
  authorName: {
    fontWeight: '700', 
    fontStyle: 'normal', 
    fontSize: 14,
  },
  replyText: {
    fontSize: 15,
  },
  likeIcon: {
    marginRight: 2,
  },
})