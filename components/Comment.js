import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Pressable } from 'react-native'
import React, { useState, memo, useRef, } from 'react'
import { useDispatch } from 'react-redux'
import { COLORS } from '../constants/theme'
import { startLoadingRegistrationDate, setRegistrationData } from '../redux/commentsSlice'
// import { setUserID } from '../redux/userWallSlice'
import CommentBottom from './CommentBottom'
import CommentReplies from './CommentReplies'
import DividerWithLine from './DividerWithLine'
// import CommentPhotos from './CommentPhotos'
// import CommentVideos from './CommentVideos'
import CommentAttachments from './CommentAttachments'
import { getHyperlinkInText } from '../utils/hyperlinks'

const Comment = ({from_id, is_deleted, attachments, commentText, commentDate, likes, threadCount, threadComments, commentId, navigation, postId, ownerId, isLightTheme, openCommentMenu, author, lang}) => {
  const dispatch = useDispatch() 
  const name = author?.name ? author?.name : `${author?.first_name} ${author?.last_name}`
  const photoUrl = author?.photo_100
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)

  const colorTransitionAnimation = useRef(new Animated.Value(0)).current
  const commentBgEndColor = isLightTheme ? COLORS.light_blue : COLORS.light_black
  const commentBgInitColor = isLightTheme ? COLORS.white : COLORS.primary_dark
  const commentBgColor = colorTransitionAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [commentBgInitColor, commentBgEndColor]
  })

  const handleLikePress = () => {
    if(!isLiked) {
      setLikesCount(prevState => prevState + 1);
      setIsLiked(true);
    } else {
      setLikesCount(prevState => prevState - 1);
      setIsLiked(false);
    }
  }

  //TODO: refact dispatch calls num
  const fetchProfileInfo = (vkId, name, photoUrl, commentId) => {
    let profileDataRegUrl = `https://vkdia.com/pages/fake-vk-profile/registration-date?vkId=${vkId}`;
    const re = /^\d*$/g; 
    dispatch(startLoadingRegistrationDate())
    if (vkId < 0) {
      dispatch(setRegistrationData({
        registrationDate: 0,
        authorName: name,
        authorImgUrl: photoUrl,
        authorId: vkId,
        authorCommentId: commentId,
        ownerId: ownerId,
        commentText
      }))
    } else if (vkId > 0) {
      fetch(profileDataRegUrl)
      .then(response => response.json())
      .then(result => {
        const regDate = result.regDate 
        if (re.test(regDate)) {
          dispatch(
            setRegistrationData({
              registrationDate: regDate,
              authorName: name,
              authorImgUrl: photoUrl,
              authorId: vkId,
              authorCommentId: commentId,
              ownerId: ownerId,
              commentText
            })
          )
        }
      })
    } else {
      dispatch(setRegistrationData({
        registrationDate: 0,
        authorName: '',
        authorImgUrl: 'banned',
        authorId: vkId,
        authorCommentId: commentId,
        ownerId: ownerId,
        commentText
      }))
    }
  }
  
  const navigateToCommentAuthor = () => {
    if (from_id > 0) {
      navigation.push('UserProfile', {userId: from_id})
    } else if(from_id < 0) {
      navigation.push('Group', {groupId: (-1 * from_id)})
    }
  }

  const onPressIn = () => {
    Animated.timing(colorTransitionAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }

  const onPressOut = () => {
    Animated.timing(colorTransitionAnimation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }

  const onLongPress = () => {
    console.log('opening')
    fetchProfileInfo(from_id, name, photoUrl, commentId)
    openCommentMenu()
  }

  return (
    <>
      <Pressable 
        onPressIn={onPressIn} 
        onPressOut={onPressOut} 
        onLongPress={onLongPress} 
        delayLongPress={800} 
        unstable_pressDelay={100}
      >
        <Animated.View 
          style={[styles.commentContainer, {backgroundColor: commentBgColor}]}
        >
          <TouchableOpacity activeOpacity={1} style={styles.imageContainer} onPress={navigateToCommentAuthor}>
            <Image source={is_deleted ? require('../assets/avatars/banned-light.jpg') : {uri: photoUrl}} style={styles.image}/>
          </TouchableOpacity>
          <View style={styles.commentConentContainer}>
            {
              is_deleted ? <View style={styles.deltedContainer}><Text style={styles.deletedText}>{lang == 'ru' ? 'Комментарий удален' : 'Comment deleted'}</Text></View> : 
              <>
                <TouchableOpacity activeOpacity={1} onPress={navigateToCommentAuthor}>
                  <Text style={[styles.authorName, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{name}</Text>
                </TouchableOpacity>
                {
                  commentText ? 
                  <Text style={[styles.text, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
                    {getHyperlinkInText(commentText)}
                  </Text> : null
                }
                {
                  attachments ? 
                  <CommentAttachments 
                    attachments={attachments} 
                    navigation={navigation} 
                    isLightTheme={isLightTheme} 
                    author={author}
                    // ownerId={from_id}
                    ownerId={ownerId} 
                    lang={lang}
                  /> : null
                }
              </>
            }
            <CommentBottom lang={lang} likesCount={likesCount} handleLikePress={handleLikePress} date={commentDate} isLiked={isLiked}/>
          </View>
        </Animated.View>
      </Pressable>
      {threadCount > 0 && <DividerWithLine dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} dividerHeight={8}/>}
      <CommentReplies 
        threadComments={threadComments} 
        threadCount={threadCount} 
        fetchProfileInfo={fetchProfileInfo}
        startOfThreadId={commentId}
        navigation={navigation}
        postId={postId}
        ownerId={ownerId}
        isLightTheme={isLightTheme}
        openCommentMenu={openCommentMenu}
        lang={lang}
      />
    </>
  )
}

// export default memo(Comment)
export default memo(Comment, (prevProps, nextProps) => {
  return prevProps.commentId === nextProps.commentId && prevProps.isLightTheme === nextProps.isLightTheme
})

const styles = StyleSheet.create({
  commentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    paddingLeft: 5,
    paddingRight: 5,
  },
  imageContainer: {
    marginRight: 7
  },
  image: {
    width: 38, 
    height: 38, 
    borderRadius: 100,
  },
  
  commentConentContainer: {
    width: '86%',
  },
  text: {
    fontSize: 15,
    // color: COLORS.black,
  },
  // textDark: {
  //   fontSize: 15,
  //   color: COLORS.primary_text
  // },
  authorName: {
    fontWeight: '700', 
    fontStyle: 'normal', 
    fontSize: 14,
    // color: COLORS.black
  },
  // authorNameDark: {
  //   fontWeight: '700', 
  //   fontStyle: 'normal', 
  //   fontSize: 14,
  //   color: COLORS.primary_text
  // },
  likeIcon: {
    marginRight: 2,
  },
  deltedContainer: {
    height: 35,
    justifyContent: 'center',
  },
  deletedText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
})