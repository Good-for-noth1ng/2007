import { StyleSheet, Text, View, TouchableOpacity, Touchable } from 'react-native'
import React, { useState, useCallback, memo } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DividerWithLine from './DividerWithLine'
import CountSortComments from './CountSortComments'
import { getShortagedNumber } from '../utils/numShortage'
import { COLORS } from '../constants/theme'

const OpenedPostBottom = ({lang, reposts, likes, views, comments, isLightTheme, ownerId, postId, navigation, commentsSortType, setCommentsSortType, accessToken}) => {
  const [isLikePressed, setIsLikePressed] = useState(false);
  const [likesCount, setLikesCount] = useState(likes !== undefined ? likes : 0);
  const [repostsCount, setRepostsCount] = useState(reposts !== undefined ? reposts : 0);

  const handleLikePress = async () => {
    if (isLikePressed) {
      const url = `https://api.vk.com/method/likes.delete?type=post&v=5.131&access_token=${accessToken}&owner_id=${ownerId}&item_id=${postId}`
      await fetch(url)
      setLikesCount(likesCount - 1);
    } else {
      const url = `https://api.vk.com/method/likes.add?type=post&v=5.131&access_token=${accessToken}&owner_id=${ownerId}&item_id=${postId}`
      await fetch(url)
      setLikesCount(likesCount + 1);
    }
    setIsLikePressed(!isLikePressed);
  }
  
  const navigateToReactedUsersList = () => {
    navigation.push('ReactedOnPostUsers', {ownerId: ownerId, postId: postId})
  }

  const unactiveButtonColor = isLightTheme ? COLORS.secondary : COLORS.smoke  
  
  return (
    <>
      <View style={[styles.bottomPostContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
        <View style={styles.leftButtonsContainer}>
          <TouchableOpacity onPress={handleLikePress} activeOpacity={0.8} style={styles.leftButtons} onLongPress={navigateToReactedUsersList}>
            <AntDesign name='like1' style={styles.iconsInfoGap} size={20} color={isLikePressed ? COLORS.primary : unactiveButtonColor}/>
            <Text style={{color: COLORS.secondary}}>{getShortagedNumber(likesCount)}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.leftButtons}>
            <FontAwesome name='share' style={styles.iconsInfoGap} size={20} color={unactiveButtonColor}/>
            <Text style={{color: COLORS.secondary}}>{getShortagedNumber(repostsCount)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewsButton}>
          <AntDesign name='eye' style={styles.iconsInfoGap} size={20} color={unactiveButtonColor}/>
          <Text style={{color: COLORS.secondary}}>{getShortagedNumber(views)}</Text>
        </View>
      </View>

      <DividerWithLine  
        dividerHeight={40} 
        dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
        dividerLineColor={isLightTheme ? COLORS.light_smoke : COLORS.secondary}
        dividerLineHeight={1}
        dividerLineWidth={'95%'}
        linePosition={'center'}
      />
      <CountSortComments 
        comments={comments} 
        isLightTheme={isLightTheme} 
        commentsSortType={commentsSortType} 
        lang={lang}
        // setCommentsSortType={setCommentsSortType}
      />
      <DividerWithLine 
        dividerHeight={20} 
        dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
      />
    </>
  )
}

export default memo(OpenedPostBottom)

const styles = StyleSheet.create({
  bottomPostContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 7,
    paddingRight: 7,
    height: 20,
    //backgroundColor: COLORS.white
  },
  // bottomPostContainerDark: {
  //   display: 'flex', 
  //   flexDirection: 'row', 
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingLeft: 7,
  //   paddingRight: 7,
  //   height: 20,
  //   backgroundColor: COLORS.primary_dark
  // },
  leftButtonsContainer: { 
    flexDirection: 'row',
    // width: '33%',
    justifyContent: 'flex-start',
    gap: 20
  },
  viewsButton: {
    // width: '16%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftButtons: {
    // width: '38%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconsInfoGap: {
    marginRight: 7
  }
})