import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, Animated, BackHandler } from 'react-native'
import React from 'react'
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import * as Localization from 'expo-localization'
import uuid from 'react-native-uuid';
import AntDesign from 'react-native-vector-icons/AntDesign'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import Feather from 'react-native-vector-icons/Feather'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import Octicons from 'react-native-vector-icons/Octicons'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice';
import CustomHeader from '../components/CustomHeader'
import Comment from '../components/Comment';
import { COLORS } from '../constants/theme'
// import { setProfiles, pushProfiles } from '../redux/commentsSlice';
// import { setID } from '../redux/userWallSlice'
import DividerWithLine from '../components/DividerWithLine';
import TextInputField from '../components/TextInputField';
import OverlayWithButtons from '../components/OverlayWithButtons';
import CommentsOverlay from '../components/CommentsOverlay';
import GlobalShadow from '../components/GlobalShadow';

const CommentThread = ({navigation, route}) => {
  const dispatch = useDispatch()
  const accessToken = useSelector(state => state.user.accessToken)
  // const commentsGeneralData = useSelector(state => state.comments)
  const isGlobalShadowExpanded = useSelector(state => state.globalShadow.isOpen)
  const shouldPerfomeAuthorInfoAnim = React.useRef(false);
  const lang = Localization.getLocales()[0].languageCode
  const {threadMainCommentId, ownerId, postId} = route.params
  
  const authorInfoIsOpen = React.useRef(false)
  const shouldScroll = React.useRef(true)
  let getThreadUrl = `https://api.vk.com/method/wall.getComments?access_token=${accessToken}&v=5.131&count=10&comment_id=${threadMainCommentId}&extended=1&fields=photo_100&need_likes=1&owner_id=${ownerId}&post_id=${postId}&sort=asc`
  let getThreadMainCommentUrl = `https://api.vk.com/method/wall.getComment?access_token=${accessToken}&v=5.131&comment_id=${threadMainCommentId}&extended=1&fields=photo_100&owner_id=${ownerId}`
  const [isLoading, setIsLoading] = React.useState(true)
  const [comments, setComments] = React.useState(null)
  const [mainComment, setMainComment] = React.useState(null)
  const threadList = React.useRef(null)
  const offset = React.useRef(10)
  const currentLevelCommentsCount = React.useRef()
  
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)

  const slideAnimation = React.useRef(new Animated.Value(2000)).current

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

  const fetchThreadComments = async () => {
    const threadCommentsResponse = await fetch(getThreadUrl)
    const threadMainCommentResponse = await fetch(getThreadMainCommentUrl)
    const threadCommentsData = await threadCommentsResponse.json() 
    const threadMainCommentData = await threadMainCommentResponse.json()
    // console.log(threadCommentsData)
    const items = threadCommentsData.response.items.map(item => {
      const key = uuid.v4()
      let author = threadCommentsData.response.profiles.find(profile => profile.id === item.from_id)
      if (author === undefined) {
        author = threadCommentsData.response.groups.find(group => group.id === (-1 * item.from_id))
      }
      return {
        ...item,
        key,
        author,
      }
    }) 
    // console.log(threadMainCommentData.response)
    setMainComment({...threadMainCommentData})
    currentLevelCommentsCount.current = threadCommentsData.response.count - 10
    // console.log(threadMainCommentData.response)
    setComments(items)
    // dispatch(pushProfiles([...threadCommentsData.response.profiles, threadMainCommentData.response.profiles[0]]))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchThreadComments()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  const fetchMoreComments = async () => {
    if (currentLevelCommentsCount.current > 0) {
      let fetchMoreCommentsUrl = `https://api.vk.com/method/wall.getComments?access_token=${accessToken}&count=10&offset=${offset.current}&v=5.131&comment_id=${threadMainCommentId}&extended=1&fields=photo_100&need_likes=1&owner_id=${ownerId}&post_id=${postId}&sort=asc`
      const fetchMoreCommentsResponse = await fetch(fetchMoreCommentsUrl)
      const fetchMoreCommentsData = await fetchMoreCommentsResponse.json()
      const items = fetchMoreCommentsData.response.items.map(item => {
        const key = uuid.v4()
        let author = fetchMoreCommentsData.response.profiles.find(profile => profile.id === item.from_id)
        if (author === undefined) {
          author = fetchMoreCommentsData.response.groups.find(group => group.id === (-1 * item.from_id))
        }
        return {
          ...item,
          key,
          author,
        }
      })
      setComments(prevState => prevState.concat(items))
      // dispatch(pushProfiles(fetchMoreCommentsData.response.profiles))
      offset.current += 10
      currentLevelCommentsCount.current -= 10
    }
  }

  //TODO
  const renderItem = ({item}) => (
    <Comment
      commentId={item.id}
      commentDate={item.date} 
      likes={item.likes.count} 
      from_id={item.from_id} 
      commentText={item.text}
      threadComments={[]}
      navigation={navigation}
      postId={item.post_id}
      ownerId={item.owner_id}
      attachments={item?.attachments}
      is_deleted={item.deleted}
      isLightTheme={isLightTheme}
      openCommentMenu={openCommentMenu}
      author={item.author}
      lang={lang}
      accessToken={accessToken}
      type={'comment'}
      //add openCommentMenu function
    />
  )
  
  const listHeader = () => {
    // console.log(mainComment.response.items)
    let author = [...mainComment.response.profiles].find(item => item.id === mainComment.response.items[0].from_id)
    let group = [...mainComment.response.groups].find(item => -item.id === mainComment.response.items[0].from_id)
    return (
      <>
        <DividerWithLine 
          marginT={10} 
          dividerHeight={5} 
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
          borderTL={4}
          borderTR={4}
        />
        <Comment
          lang={lang}
          commentId={mainComment.response.items[0].id}
          commentDate={mainComment.response.items[0].date}
          likes={mainComment.response.items[0].likes?.count}
          from_id={mainComment.response.items[0].from_id}
          commentText={mainComment.response.items[0].text}
          author={
            author ? 
          // mainComment.response.profiles.length > 1 ? 
            author :
            //  : mainComment.response.profiles[0]: 
            group
          }
          threadComments={[]}
          attachments={mainComment.response.items[0]?.attachments}
          is_deleted={mainComment.response.items[0].deleted}
          isLightTheme={isLightTheme}
          navigation={navigation}
          openCommentMenu={openCommentMenu}
        />
        <DividerWithLine 
          dividerHeight={16} 
          dividerLineHeight={1} 
          dividerLineColor={isLightTheme ? COLORS.light_smoke : COLORS.secondary} 
          dividerLineWidth={300}
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
          linePosition={'center'}
        />
      </>
    )
  }

  const commentSeparator = () => (
    <DividerWithLine dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} dividerHeight={10}/>
  )

  const listBottom = () => {
    if (currentLevelCommentsCount.current > 0) {
      return (
        <>
          <View style={[styles.bottomSpinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
          </View>
          <DividerWithLine dividerHeight={5} marginB={5} borderBL={5} borderBR={5}/>
        </>
      )
    } else {
      return (
        <DividerWithLine 
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} 
          marginB={10} 
          dividerHeight={10} 
          borderBL={5} 
          borderBR={5}
        />
      )
    }
  }
  
  const keyExtractor = (item) => {
    return item.key
  }

  const scrollingToThreadStart = () => {
    if (shouldScroll.current) {
      threadList.current.scrollToIndex({index: 2, animated: true})
      shouldScroll.current = false
    } 
  }

  return (
    <SafeAreaView 
      style={[
        styles.mainContainer, 
        isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}
      ]}>
      <CustomHeader
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
        headerName={<Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>{lang == 'ru' ? 'Ответы к комментарию' : 'Comment replies'}</Text>}
        isLightTheme={isLightTheme}
      />
      {
        isLoading ?
        <View style={styles.spinnerContainer}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <>
          <FlatList
            ref={threadList}
            onLayout={scrollingToThreadStart} 
            data={comments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={[
              styles.list,
            ]}
            ItemSeparatorComponent={commentSeparator}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listBottom}
            onEndReached={fetchMoreComments}
            onEndReachedThreshold={0.8}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode={'interactive'}
            onScrollToIndexFailed={err => console.log(err)}
          />
          <TextInputField isLightTheme={isLightTheme} lang={lang}/>
        </>
      }
      <CommentsOverlay 
        slideAnimation={slideAnimation}
        isLightTheme={isLightTheme}
        handleShadowTouch={closeCommentMenu}
        navigation={navigation}
        lang={lang}
      />
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default CommentThread

const styles = StyleSheet.create({
  spinnerContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContainer: {
    flex: 1,
  },
  list: {
    marginRight: 5,
    marginLeft: 5
  },
  bottomSpinnerContainer:{
    justifyContent: 'center',
    backgroundColor: COLORS.white
  },
})