import { StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid, LayoutAnimation } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import * as Clipboard from 'expo-clipboard'
import { useDispatch } from 'react-redux'
import { getShortagedNumber } from '../utils/numShortage'
import { getDuration } from '../utils/numShortage'
import { getTimeDate } from '../utils/date'
import { COLORS } from '../constants/theme'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'

const VideosListItem = ({title, duration, imageUrl, views, date, isLightTheme, navigation, playerUrl, ownerId, likes, reposts, isLiked, isReposted, id, canLike, canAdd, canAddToFavs, commentsCount, canComment, videoId, lang}) => {
  const dispatch = useDispatch()

  const dropdownCoords = React.useRef(null)
  let shortagedTitle = title.slice(0, 40)
  if (shortagedTitle !== title) {
    shortagedTitle += '...'
  }

  const navigateToVideo = () => {
    navigation.push(
      'Video', 
      {
        playerUrl: playerUrl, 
        title: title, 
        views: views, 
        ownerId: ownerId, 
        likes: likes, 
        reposts: reposts, 
        isLiked: isLiked, 
        isReposted: isReposted, 
        date: date,
        canAdd,
        canAddToFavs,
        canComment,
        canLike,
        commentsCount,
        videoId
      }
    )
  }

  // const onShadowPressCallback = (initValue) => {
  //   setDropdownMenuHeight(initValue)
  //   setVideoListItemZIndex(initValue)
  // }

  const onMorePress = () => {
    dropdownCoords.current.measure(
      (x, y, width, height, pageX, pageY) => {
        // console.log(pageX, pageY, width)
        dispatch(expandShadow({dropdownX: pageX, dropdownY: pageY, dropdownType: 'videoListItem'}))
      }
    )
  }

  return (
    <TouchableOpacity onPress={navigateToVideo} activeOpacity={0.8} style={[styles.mainContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUrl}} style={{width: '100%', height: '100%', borderRadius: 5}}/>
        <Text style={styles.timeDuration}>{getDuration(duration)}</Text>
      </View>
      <View style={{justifyContent: 'space-between'}}>
        <Text style={[styles.title, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{shortagedTitle}</Text>
        <View>
          <Text style={styles.views}>{getShortagedNumber(views)} {lang == 'ru' ? 'просмотров' : 'views'}</Text>
          <Text style={styles.date}>{getTimeDate(date, lang)}</Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={onMorePress}>
        <View ref={dropdownCoords} collapsable={false}>
          <Feather name='more-vertical' color={COLORS.secondary} size={20}/>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default VideosListItem
// export default React.memo(VideosListItem, (prevProps, nextProps) => {
//   return prevProps.id === nextProps.id;
// })

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    gap: 5,
    paddingLeft: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  timeDuration: {
    position: 'absolute', 
    zIndex: 3, 
    color: COLORS.white, 
    backgroundColor: COLORS.light_black, 
    borderRadius: 5,
    opacity: 0.8,
    right: 5,
    bottom: 5,
    padding: 3,
    fontSize: 15
  },
  imageContainer: {
    width: 150, 
    height: 90, 
    borderRadius: 5, 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end',
  },
  title: {
    width: 155,
    height: 55,
    fontSize: 15,
    fontWeight: 'bold',
    // backgroundColor: COLORS.secondary
  },
  views: {
    color: COLORS.secondary
  },
  date: {
    color: COLORS.secondary
  },
  dropdownMenu: {
    left: '50%', 
    top: 10,
    borderRadius: 5,
    elevation: 4, 
    position: 'absolute', 
    zIndex: 5, 
    width: 170,
  },
  dropdownMenuButton: {
    position: 'relative', 
    zIndex: 4, 
    flex: 1, 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    paddingLeft: 5  
  }
})