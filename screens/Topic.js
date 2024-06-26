import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, Animated } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import * as Localization from 'expo-localization'
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import Comment from '../components/Comment'
import { FlatList } from "react-native-gesture-handler";
import { COLORS } from '../constants/theme'
import { findPostAuthor } from '../utils/dataPreparationForComponents';
import DividerWithLine from '../components/DividerWithLine';
import TextInputField from '../components/TextInputField';
import CommentsOverlay from '../components/CommentsOverlay';
// import OverlayWithButtons from '../components/OverlayWithButtons';

const Topic = ({navigation, route}) => {
  const lang = Localization.getLocales()[0].languageCode
  const {groupId, topicId} = route.params
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = React.useState(true)
  const [comments, setComments] = React.useState([])
  const count = 10
  const offset = React.useRef(0)
  const remainToFetchNum = React.useRef(null)

  const slideAnimation = React.useRef(new Animated.Value(2000)).current
  
  // const commentsGeneralData = useSelector(state => state.comments);
  // const authorName = commentsGeneralData.authorName;
  // const authorImgUrl = commentsGeneralData.authorImgUrl;
  // const registrationDate = commentsGeneralData.registrationDate;
  // const registrationDateIsFetching = commentsGeneralData.authorInfoIsFetching;
  
  const authorInfoIsOpen = React.useRef(false)

  const closeCommentMenu = () => {
    authorInfoIsOpen.current = false
    Animated.timing(slideAnimation, {
      toValue: 2000,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  const openCommentMenu = () => {
    authorInfoIsOpen.current = true
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  // const commentMenuButtonIconSize = 22
  // const commentMenuButtonColor = isLightTheme ? COLORS.primary : COLORS.white

  const fetchTopicComments = async () => {
    const url = `https://api.vk.com/method/board.getComments?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&group_id=${groupId}&topic_id=${topicId}&need_likes=1&extended=1`
    const response = await fetch(url)
    const parsedResponse = await response.json()
    if (remainToFetchNum.current === null) {
      remainToFetchNum.current = parsedResponse.response.count
    } else {
      remainToFetchNum.current -= count
    }
    offset.current += count
    const items = parsedResponse.response.items.map(item => {
      const preparedItem = findPostAuthor(item, parsedResponse.response.profiles, parsedResponse.response.groups)
      return preparedItem
    })
    setComments(prevState => prevState.concat(items))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchTopicComments()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  const listHeader = () => {
    return (
      <DividerWithLine 
        dividerHeight={5}
      />
    )
  }

  const listSeparator = () => {
    return (
      <DividerWithLine 
        dividerHeight={10}
        dividerColor={isLightTheme ? COLORS.white : COLORS.background_dark}
      />
    )
  }

  const listFooter = () => {
    if (remainToFetchNum.current > 0) {
      return (
        <View style={[{justifyContent: 'center'}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
        </View>
      )
    }
    return (
      <DividerWithLine 
        dividerHeight={5}
      />
    )
  }
  const renderItem = ({item}) => {
    return (
      <Comment 
        from_id={item.from_id}
        is_deleted={item.is_deleted}
        attachments={item?.attachments}
        commentText={item.text}
        commentDate={item.date}
        likes={item?.likes?.count}
        threadComments={[]}
        commentId={item.key}
        navigation={navigation}
        author={item.author}
        ownerId={item.from_id}
        isLightTheme={isLightTheme}
        openCommentMenu={openCommentMenu}
      />
    )
  }

  const fetchMore = () => {
    if (remainToFetchNum.current) {
      fetchTopicComments()
    }
  }
  return (
    <SafeAreaView
      style={[
        {flex: 1}, 
        isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}
      ]}
    >
      <CustomHeader
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Обсуждение' : 'Topic'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      {
        isLoading ? 
        <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <>
          <FlatList 
            data={comments}
            renderItem={renderItem}
            style={[styles.list, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.background_dark}]}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            showsVerticalScrollIndicator={false}
            onEndReached={fetchMore}
            ItemSeparatorComponent={listSeparator}
          />
          <TextInputField isLightTheme={isLightTheme} lang={lang}/>
          <CommentsOverlay 
            slideAnimation={slideAnimation}
            isLightTheme={isLightTheme}
            handleShadowTouch={closeCommentMenu}
            navigation={navigation}
            lang={lang}
          />
        </>
        
      }
    </SafeAreaView>
  )
}

export default Topic

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
})