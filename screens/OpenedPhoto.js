import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Image, Animated, BackHandler, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Localization from 'expo-localization'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import uuid from 'react-native-uuid'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice';
import CustomHeader from '../components/CustomHeader'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DividerWithLine from '../components/DividerWithLine'
import PhotoHeader from '../components/PhotoHeader'
import OpenedPostBottom from '../components/OpenedPostBottom';
import Comment from '../components/Comment'
import CommentsOverlay from '../components/CommentsOverlay';
import GlobalShadow from '../components/GlobalShadow';
import TextInputField from '../components/TextInputField';
import { COLORS } from '../constants/theme'

const OpenedPhoto = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const isGlobalShadowExpanded = useSelector(state => state.globalShadow.isOpen)
  const { ownerId, photoUrl, date, author, width, height, text, photoId, userId, albumId } = route.params
  const res = width / height
  // console.log(photoId)
  // const [isLoading, setIsLoading] = React.useState(false)
  const [comments, setComments] = React.useState([])
  const [likesCount, setLikesCount] = React.useState(0)
  const [isLiked, setIsLiked] = React.useState(false)
  const [repostsCount, setRepostsCount] = React.useState(0)
  const [commentsCount, setCommentsCount] = React.useState(-1)
  const count = 5
  const offset = React.useRef(0)
  const currentLevelCommentsCount = React.useRef(-1)

  const slideAnimation = React.useRef(new Animated.Value(2000)).current
  const authorInfoIsOpen = React.useRef(false)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (authorInfoIsOpen.current === true) {
          closeCommentMenu()
          return true
        }
        return false
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [authorInfoIsOpen.current])
  )

  React.useEffect(() => {
    if (isGlobalShadowExpanded == false) {
      closeCommentMenu()
    }
  }, [isGlobalShadowExpanded])

  const closeCommentMenu = () => {
    authorInfoIsOpen.current = false
    dispatch(collapseShadow())
    Animated.timing(slideAnimation, {
      toValue: 2000,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  const openCommentMenu = () => {
    authorInfoIsOpen.current = true 
    dispatch(expandShadow({dropdownType: 'none'}))
    Animated.timing(slideAnimation, {
      toValue: 100,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  const fetchComments = async () => {
    const url = `https://api.vk.com/method/photos.getComments?access_token=${accessToken}&v=5.131&photo_id=${photoId}&need_likes=1&owner_id=${ownerId}&count=${count}&sort=asc&offset=${offset.current}&fields=photo_100&extended=1`
    const photoInfoUrl = `https://api.vk.com/method/photos.get?access_token=${accessToken}&v=5.131&photo_ids=${photoId}&extended=1&owner_id=${ownerId}${albumId ? `&album_id=${albumId}` : ''}`
    const res = await fetch(url)
    const photoInfoRes = await fetch(photoInfoUrl)
    const photoInfoData = await photoInfoRes.json()
    const commentsData = await res.json()
    if (commentsData.error) {
      if (commentsData.error.error_code === 7) {
        currentLevelCommentsCount.current = 0
        offset.current = 0
        setComments([])
        setCommentsCount(0)
      }
    } else {
      const items = commentsData.response.items.map(item => {
        const key = uuid.v4()
        let threadItems = []
        if (item?.thread?.count > 0) {
          threadItems = item.thread.items.map(item => {
            const key = uuid.v4()
            let author = commentsData.response.profiles.find(profile => profile.id === item.from_id)
            if (author === undefined) {
              author = commentsData.response.groups.find(group => group.id === (-1 * item.from_id))
            }
            return {
              ...item,
              key,
              author,
            }
          })
        }
        const thread = {
          ...item.thread,
          items: threadItems
        }
        let author = commentsData.response.profiles.find(profile => profile.id === item.from_id)
        if (author === undefined) {
          author = commentsData.response.groups.find(group => group.id === (-1 * item.from_id))
        }
        return {
          ...item, 
          key,
          author,
          thread,
        }
      })
      if (commentsData.response.items.length > 0) {
        setComments(items)
      } else {
        setComments([])
      }
      // console.log(photoInfoData.response.items[0])
      setIsLiked(photoInfoData.response.items[0].likes.user_likes === 1)
      setLikesCount(photoInfoData.response.items[0].likes.count)
      setRepostsCount(photoInfoData.response.items[0].reposts.count)
      setCommentsCount(commentsData.response.count)
      currentLevelCommentsCount.current = commentsData.response.count
      offset.current += count
    }
    // setPost(findPostAuthor(parsedPostResponse.response.items[0], parsedPostResponse.response.profiles, parsedPostResponse.response.groups))  
  }

  const fetchMoreComments = async () => {
    if (comments.length < currentLevelCommentsCount.current) {
    const url = `https://api.vk.com/method/photos.getComments?access_token=${accessToken}&v=5.131&photo_id=${photoId}&need_likes=1&owner_id=${ownerId}&count=${count}&sort=asc&offset=${offset.current}&fields=photo_100&extended=1`
    const res = await fetch(url)
    const commentsData = await res.json()
    if (commentsData.error) {
      //permission denied
      if (commentsData.error.error_code === 7) {
        currentLevelCommentsCount.current = 0
        offset.current = 0
        setComments([])
        return
      }
    }
    const items = commentsData.response.items.map(item => {
      const key = uuid.v4()
      let threadItems = []
      if (item?.thread?.count > 0) {
        threadItems = item.thread.items.map(item => {
          const key = uuid.v4()
          let author = commentsData.response.profiles.find(profile => profile.id === item.from_id)
          if (author === undefined) {
            author = commentsData.response.groups.find(group => group.id === (-1 * item.from_id))
          }
          return {
            ...item,
            key,
            author,
          }
        })
      }
      const thread = {
        ...item.thread,
        items: threadItems
      }
      let author = commentsData.response.profiles.find(profile => profile.id === item.from_id)
      if (author === undefined) {
        author = commentsData.response.groups.find(group => group.id === (-1 * item.from_id))
      }
      return {
        ...item, 
        key,
        author,
        thread,
      }
    })
    if (commentsData.response.items.length > 0) {
      setComments(prev => prev.concat(items))
    }
    offset.current += count
    }
  }

  React.useEffect(() => {
    fetchComments()
  }, [])
  
  const navToReacted = () => {
    navigation.push('ReactedOnPhoto', {ownerId, photoId})
  }

  const onLikePress = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1)
      setIsLiked(false)
    } else {
      setLikesCount(prev => prev + 1)
      setIsLiked(true)
    }
  }

  const listHeader = () => {
    return (
      <>
        <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.light_smoke : COLORS.background_dark}/>
        <DividerWithLine dividerHeight={3} borderTL={5} borderTR={5} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
        <PhotoHeader 
          ownerId={ownerId}
          date={date}
          accessToken={accessToken}
          isLightTheme={isLightTheme}
          navigation={navigation}
          name={author?.name ? author?.name : `${author?.first_name} ${author?.last_name}`}
          imgUrl={author?.photo_100}
          isFriend={false}
          isMember={false}
          lang={lang}
        />
        <View style={[{paddingLeft: 5, paddingRight: 5}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <Image source={{uri: photoUrl}} style={{width: '100%', aspectRatio: res}}/>
        </View>
        {
          text ?
          <>
            <View style={[{padding: 5}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>{text}</Text>
            </View>
          </> : 
          null
        }
        {
          text && commentsCount > -1 ?
          <DividerWithLine 
              dividerLineHeight={1} 
              dividerLineWidth={'93%'} 
              dividerLineColor={COLORS.light_smoke} 
              dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
          /> :
          null
        }
        {
          commentsCount > -1 ?
          <View style={[{width: '100%', justifyContent: 'space-between', flexDirection: 'row', padding: 10, paddingBottom: 5}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <TouchableOpacity 
              style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}
              onPress={onLikePress}
              onLongPress={navToReacted}
            > 
              <AntDesign name='like1' size={23} color={isLiked ? COLORS.primary : COLORS.secondary}/>
              <Text style={[{fontSize: 16}, isLiked ? {color: COLORS.primary} : {color : COLORS.secondary}]}>{likesCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <FontAwesome name='share' color={COLORS.secondary} size={23}/>
              <Text style={{fontSize: 16, color: COLORS.secondary}}>{repostsCount}</Text>
            </TouchableOpacity>
          </View> : null
        }
        {
          commentsCount > -1 ?
          <>
            <View style={[{flexDirection: 'row', padding: 5, gap: 5, paddingBottom: 10}, isLightTheme? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
              <Text style={styles.commentCount}>{commentsCount}</Text>
              <Text style={styles.commentCount}>{getCommentsLang(commentsCount)}</Text>
            </View>
          </> : null
        }
      </>
    )
  }

  const getCommentsLang = (cnt) => {
    if (lang == 'ru') {
      const t = cnt % 10
      const k = cnt % 100
      if (k == 11 || k == 12 || k == 13 || k == 14) {
        return 'КОММЕНТАРИЕВ'
      } else if (t == 1) {
        return 'КОММЕНТАРИЙ'
      } else if (t > 1 && t < 5) {
        return 'КОММЕНТАРИЯ'
      } else if (t >= 5 || t == 0) {
        return 'КОММЕНТАРИЕВ'
      }
    } else {
      if (cnt == 1) {
        return 'COMMENT'
      }
      return 'COMMENTS'
    }
  }

  const renderItem = ({item}) => {
    // console.log(item)
    return (
      <Comment 
        commentId={item.id}
        commentDate={item.date} 
        likes={item?.likes?.count} 
        from_id={item.from_id} 
        commentText={item.text}
        threadComments={[]}
        threadCount={item.thread.count}
        navigation={navigation}
        // postId={postId}
        ownerId={ownerId}
        attachments={item?.attachments}
        is_deleted={item.deleted}
        isLightTheme={isLightTheme}
        openCommentMenu={openCommentMenu}
        author={item.author}
      />
    )
  }

  const commentSeparator = () => (
    <DividerWithLine dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} dividerHeight={12}/>
  )

  const footer = () => {
    if (comments != null && comments.length < currentLevelCommentsCount.current) {
      return (
        <View style={[{width: '100%', justifyContent: 'center', alignItems: 'center'}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <ActivityIndicator size={30} color={isLightTheme ? COLORS.primary : COLORS.white}/>
        </View>
      )
    }
    return (
      <>
        <DividerWithLine dividerHeight={10} borderBL={5} borderBR={5} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
        <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.light_smoke : COLORS.background_dark}/>
      </>
      
    )
  }
  const goBack = () => {
    navigation.goBack()
  }
  return (
    <SafeAreaView style={[{flex: 1, justifyContent: 'flex-start' }, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Фото' : 'Photo'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      <FlatList
        data={comments}
        style={[styles.list]}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={footer}
        ListEmptyComponent={
          commentsCount === -1 &&
          <View style={[{paddingTop: 10}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <ActivityIndicator size={40} color={isLightTheme ? COLORS.primary : COLORS.white}/>
          </View>
        }
        ItemSeparatorComponent={commentSeparator}
        onEndReached={fetchMoreComments}
      />
      {commentsCount > -1 ? <TextInputField isLightTheme={isLightTheme} accessToken={accessToken}/> : null}
      <CommentsOverlay 
        slideAnimation={slideAnimation}
        isLightTheme={isLightTheme}
        navigation={navigation}
      />
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default OpenedPhoto

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 5, 
    marginRight: 5, 
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
    borderRadius: 5
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
  commentCount: {
    fontSize: 15,
    color: COLORS.secondary,
  }
})