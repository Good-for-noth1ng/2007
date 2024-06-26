import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview'
import * as Localization from 'expo-localization'
import { useSelector } from 'react-redux'
import CustomHeader from '../components/CustomHeader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DividerWithLine from '../components/DividerWithLine'
import { Video, ResizeMode } from 'expo-av';
import { COLORS } from '../constants/theme'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { getShortagedNumber } from '../utils/numShortage'
import VideoScreenBottom from '../components/VideoScreenBottom'
import VideoHeader from '../components/VideoHeader'
import GlobalShadow from '../components/GlobalShadow'
import VideosListDropdownMenu from '../components/VideosListDropdownMenu'
import Dropdown from '../components/Dropdown'

const width = Dimensions.get('window').width

const VideoScreen = ({navigation, route}) => {
  const lang = Localization.getLocales()[0].languageCode
  const { playerUrl, title, views, ownerId, likes, reposts, isLiked, isReposted, date, canLike, canAdd, canAddToFavs, commentsCount, canComment, videoId, accessKey, isShortVideo } = route.params
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  // console.log(videoId, accessKey, ownerId)
  const [video, setVideo] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [name, setName] = React.useState('')
  const [imgUrl, setImgUrl] = React.useState('')
  const [isFriend, setIsFriend] = React.useState(0)
  const [isMember, setIsMember] = React.useState(0)
  const [likesCount, setLikesCount] = React.useState(likes)
  const [liked, setLiked] = React.useState(isLiked === 1 ? true : false)
  const webview = React.useRef()

  const webViewJsScript = `
  const meta = document.createElement('meta'); 
  meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); 
  meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  `
  const deleteElemsJs = `const meta = document.createElement('meta'); 
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); 
    meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
    setTimeout(function () {
      const controls = document.getElementsByClassName("VideoPlayerEmbed__container")[0];
      controls.remove();
      const button = document.getElementsByClassName("VideoPlayerEmbed__button")[0];
      button.remove();
    }, 100)
  `
  const onLoad = () => {
    webview.current.injectJavaScript(deleteElemsJs)
  }
  //TODO: add clips
  const fetchVideoInfo = async () => {
    if (isShortVideo) {
      const getVideoUrl = `https://api.vk.com/method/video.get?access_token=${accessToken}&v=5.131&owner_id=${ownerId}&videos=${ownerId}_${videoId}`
      // console.log(getVideoUrl)  
      const videoResponse = await fetch(getVideoUrl)
      const videoData = await videoResponse.json()
      // console.log(videoData)
      setLikesCount(videoData.response.items[0].likes.count)
      setLiked(videoData.response.items[0].likes.user_likes === 1 ? true : false)
      setVideo({
        playerUrl: videoData.response.items[0].player,
        title: videoData.response.items[0].title,
        views: videoData.response.items[0].views,
        commentsCount: videoData.response.items[0].comments,
        canComment: videoData.response.items[0].can_comment,
        date: videoData.response.items[0].date
      })
    } else {
      if (accessKey !== undefined) {
        const getVideoUrl = `https://api.vk.com/method/video.get?access_token=${accessToken}&v=5.131&owner_id=${ownerId}&videos=${ownerId}_${videoId}_${accessKey}`
        const videoResponse = await fetch(getVideoUrl)
        const videoData = await videoResponse.json()
        // console.log(videoData.response.items[0])
        setLikesCount(videoData?.response?.items[0]?.likes?.count)
        setLiked(videoData?.response?.items[0]?.likes?.user_likes === 1 ? true : false)
        setVideo({
          playerUrl: videoData.response.items[0].player,
          title: videoData.response.items[0].title,
          views: videoData.response.items[0].views,
          commentsCount: videoData.response.items[0].comments,
          canComment: videoData.response.items[0].can_comment,
          date: videoData.response.items[0].date
        })
      }
    }
    if (ownerId > 0) {
      const getVideoAuthorUrl = `https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.131&fields=photo_100,is_friend&user_ids=${ownerId}`
      const videoAuthorResponse = await fetch(getVideoAuthorUrl)
      const videoAuthorData = await videoAuthorResponse.json()
      setName(`${videoAuthorData.response[0].first_name} ${videoAuthorData.response[0].last_name}`)
      setImgUrl(videoAuthorData.response[0].photo_100)
      setIsFriend(videoAuthorData.response[0].is_friend)
      setIsLoading(false)
    } else {
      const getVideoAuthorUrl = `https://api.vk.com/method/groups.getById?access_token=${accessToken}&v=5.131&fields=photo_100&group_id=${-1 * ownerId}`
      const videoAuthorResponse = await fetch(getVideoAuthorUrl)
      const videoAuthorData = await videoAuthorResponse.json()
      setName(videoAuthorData.response[0].name)
      setImgUrl(videoAuthorData.response[0].photo_100)
      setIsFriend(videoAuthorData.response[0].is_member)
      setIsLoading(false)
    }
  }

  // const getVideoUrl = async () => {
  //   const response = await fetch(playerUrl)
  //   const htmlPage = await response.text()
  //   const regex = /"url240":"https:.[^,]*|"url360":"https:.[^,]*|"url480":"https:.[^,]*|"url720":"https:.[^,]*/g
  //   const urls = htmlPage.match(regex)
  //   // console.log('\n')
  //   // const res = await fetch(urls[3].split('":"')[1].slice(0, -1))
  //   // console.log(res.status, res.statusTexts, res.type, res.headers)
  //   // video.current.loadAsync(urls[3].split('":"')[1].slice(0, -1))
  //   // setVideoUrl(urls[3].split('":"')[1].slice(0, -1))
  //   // const customHtml = `<body><h1>LALALALALA</h1></body>`
    
  //   // const customHtml = `
  //   // <html>
  //   //   <body>
  //   //     <video controls width="800" height="800">
  //   //       <source src="${urls[3].split('":"')[1].slice(0, -1)}" type="video/mp4">
  //   //     </video>
  //   //   </body>
  //   // <html>
  //   // `
  //   // console.log(urls[3].split('":"')[1].slice(0, -1))
  //   setVideoUrl(customHtml)
  //   // await video.current.loadAsync({uri: urls[3].split('":"')[1].slice(0, -1).concat('3953674881735.mp4')})
  //   // return urls[3].split('":"')[1].slice(0, -1)
  // }

  const likePressHandler = (isPressed) => {
    if (isPressed) {
      setLikesCount(prevState => prevState - 1)
      setLiked(false)
    } else {
      setLikesCount(prevState => prevState + 1)
      setLiked(true)
    }
  }
  React.useEffect(() => {
    fetchVideoInfo()
  }, [])

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={[{flex: 1, justifyContent: 'flex-start' }, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Видео' : 'Video'}</Text>}
        iconComponent={ <AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}        
      >
        <View
          style={[styles.contentContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}
        >
        {
          isLoading ? 
          <View style={{width: '100%', height: '100%', justifyContent: 'center'}}>
            <ActivityIndicator size={50} color={isLightTheme ? COLORS.primary : COLORS.white}/>
          </View> :
          <>
            <VideoHeader 
              ownerId={ownerId}
              date={isShortVideo ? video.date : accessKey ? video.date : date}
              accessToken={accessToken}
              isLightTheme={isLightTheme}
              navigation={navigation}
              name={name}
              imgUrl={imgUrl}
              isFriend={isFriend}
              isMember={isMember}
              lang={lang}
            />
            {
              isShortVideo ? 
              <WebView
                ref ={webview}
                source={{ uri : video.playerUrl}}
                style={{width: width - 20, aspectRatio: 9 / 16}} 
                injectedJavaScript={deleteElemsJs}
                javaScriptEnabled={true}
                // onLoadEnd={onLoad}
                // renderLoading={() => {
                //   return (
                //     <View 
                //       style={[
                //         {width: '100%', height: '100%', justifyContent: 'center'}, 
                //         isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
                //       ]}
                //     >
                //       <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
                //      </View>
                //     )
                //   }
                // }
              /> :
              <WebView
                source={{uri: accessKey ? video.playerUrl : playerUrl}}
                allowsFullscreenVideo={true}
                startInLoadingState={true}
                style={{width: width - 20, aspectRatio:  16 /9}}
                renderLoading={() => {
                    return (
                      <View 
                        style={[
                          {width: '100%', height: '100%', justifyContent: 'center'}, 
                          isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
                        ]}
                      >
                        <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
                      </View>
                    )
                  }
                }
                scalesPageToFit={true}
                injectedJavaScript={webViewJsScript}
              />
            }
            <View style={{marginLeft: 5}}>
              <Text style={[styles.title, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
                {isShortVideo ? video.title : accessKey ? video.title : title}
              </Text>
              <Text style={styles.views}>
                {getShortagedNumber(isShortVideo ? video.views : accessKey ? video.views : views)} {lang == 'ru' ? 'просмотров' : 'views'}
              </Text>
              <DividerWithLine 
                linePosition={'center'} 
                dividerLineWidth={'97%'} 
                dividerLineHeight={1} 
                dividerLineColor={isLightTheme ? COLORS.light_smoke : COLORS.secondary} 
                dividerHeight={20}
              />
              <VideoScreenBottom 
                canComment={isShortVideo ? video.canComment : accessKey ? video.canComment : canComment} 
                comments={isShortVideo ? video.commentsCount : accessKey ? video.commentsCount : commentsCount} 
                likes={likesCount} 
                isLiked={liked} 
                reposts={reposts} 
                likePressHandler={likePressHandler}
                navigation={navigation}
                ownerId={ownerId}
                videoId={videoId}
              />
              <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
            </View>
          </>
        }
        </View>
      </ScrollView>
      {/* <VideosListDropdownMenu /> */}
      <Dropdown isLightTheme={isLightTheme} accessToken={accessToken}/>
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default VideoScreen

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  spinnerContainer: {
    // flex: 1,
    justifyContent: 'center',
    // height: '100%'
  },
  contentContainer: {
    // flex: 0.75, 
    marginLeft: 5, 
    marginRight: 5, 
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  views: {
    fontSize: 15,
    color: COLORS.secondary
  }
})