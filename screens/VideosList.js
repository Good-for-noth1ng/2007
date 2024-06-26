import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import { useSelector } from 'react-redux'
import * as Localization from 'expo-localization'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import CustomHeader from '../components/CustomHeader'
import VideosListItem from '../components/VideosListItem'
import DividerWithLine from '../components/DividerWithLine'
import Carousel from '../components/Carousel';
import SearchResultHeaderCounter from '../components/SearchResultHeaderCounter';
import { COLORS } from '../constants/theme'
import { FlashList } from "@shopify/flash-list";
import GlobalShadow from '../components/GlobalShadow';
import VideosListDropdownMenu from '../components/VideosListDropdownMenu';
import Dropdown from '../components/Dropdown';

const VideosList = ({ navigation, route }) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const currentUserId = useSelector(state => state.user.userId)
  
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [videosList, setVideosList] = React.useState([])
  const [albumsList, setAlbumsList] = React.useState([])
  const [videosCount, setVideosCount] = React.useState(0)
  const [videosCounterName, setVideosCounterName] = React.useState(lang == 'ru' ? 'Все видео' : 'All videos')

  const count = 10
  const offset = React.useRef(0)
  const searchQuery = React.useRef('')
  const remainToFetchNum = React.useRef(null)
  
  // const [numOfVideos, setNumOfVideos] = React.useState(0) 
  // const numOfVideos = React.useRef(0)
  const numOfAlbums = React.useRef(0)

  const shouldRemoveStackScreens = React.useRef()
  const ownerId = route.params === undefined ? currentUserId : route.params.ownerId

  const initVideosList = () => {
    setIsLoading(true)
    offset.current = 0
    remainToFetchNum.current = null
    searchQuery.current = ''
    setVideosList([])
    fetchVideos()
  }

  const fetchVideos = async () => {
    let fetchVideosUrl = `https://api.vk.com/method/video.get?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&owner_id=${ownerId}&extended=1`
    if (searchQuery.current !== '') {
      fetchVideosUrl = `https://api.vk.com/method/video.search?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&extended=1&q=${searchQuery.current}`
    }
    const response = await fetch(fetchVideosUrl)
    const data = await response.json()
    if (remainToFetchNum.current === null) {
      // numOfVideos.current = data.response.count
      remainToFetchNum.current = data.response.count - count
      const fetchVideoAlbumsUrl = `https://api.vk.com/method/video.getAlbums?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&owner_id=${ownerId}&extended=1`
      const albumsRes = await fetch(fetchVideoAlbumsUrl)
      const albums = await albumsRes.json()
      numOfAlbums.current = albums.response.count
      offset.current += count
      setVideosCount(data.response.count)
      setVideosCounterName(lang == 'ru' ? 'Все видео' : 'All videos')
      setAlbumsList(albums.response.items)
    } else {
      offset.current += count 
      remainToFetchNum.current -= count 
    }
    
    const videos = data.response.items.map(item => {
      const key = uuid.v4()
      return {...item, key: key}
    })
    setVideosList(prevState => prevState.concat(videos))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchVideos()
  }, [])
  
  React.useEffect(() => {
    const drawerNavigator = navigation.getParent()
    const blur = drawerNavigator.addListener('blur', () => {
      shouldRemoveStackScreens.current = false
    })
    const focus = drawerNavigator.addListener('focus', () => {
      shouldRemoveStackScreens.current = true
    })
    const drawerItemPress = drawerNavigator.addListener('drawerItemPress', (e) => {
      if (shouldRemoveStackScreens.current) {
        navigation.popToTop()
      }
    })
    return blur, focus, drawerItemPress
  }, [navigation])
  
  const openDrawer = () => {
    navigation.openDrawer()
  }
  
  const goBack = () => {
    navigation.goBack()
  }

  const fetchMoreVideos = () => {
    if (remainToFetchNum.current > 0) {
      fetchVideos()
    }
  }

  const listSeparator = () => {
    return (
      <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
    )
  }

  const listHeader = () => {
    return (
      <>
        <DividerWithLine 
          dividerHeight={10} 
          marginT={10} 
          borderTL={5} 
          borderTR={5} 
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
        />
        {
          numOfAlbums.current > 0 ?
          <Carousel 
            data={albumsList}
            dataLength={numOfAlbums.current}
            type={'videos'}
            isLightTheme={isLightTheme}
            navigation={navigation}
            ownerId={ownerId}
            dataLengthFetched={count}
            lang={lang}
          /> : null
        }
        <SearchResultHeaderCounter 
          isLightTheme={isLightTheme}
          counterName={videosCounterName}
          counterNum={videosCount}
        />
        <DividerWithLine 
          dividerHeight={10}  
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
        />
      </>
    )
  }

  const renderItem = ({item}) => {
    return (
      <VideosListItem
        title={item.title}
        imageUrl={item.image[item.image.length - 1].url}
        duration={item.duration}
        views={item.views}
        date={item.date}
        isLightTheme={isLightTheme}
        navigation={navigation}
        playerUrl={item.player}
        ownerId={item.owner_id}
        likes={item?.likes?.count}
        reposts={item?.reposts?.count}
        isLiked={item?.likes?.user_likes}
        isReposted={item?.reposts?.user_reposted}
        id={item.key}
        canLike={item.can_like}
        canAdd={item.can_add}
        canAddToFavs={item.can_add_to_faves}
        commentsCount={item.comments}
        canComment={item.can_comment}
        videoId={item.id}
        lang={lang}
      />
    )
  }

  const footer = () => {
    if (remainToFetchNum.current > 0) {
      return (
        <>
          <View style={[{justifyContent: 'center'}, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
          </View>
          <DividerWithLine 
            dividerHeight={5} 
            marginB={10} 
            borderBL={5} 
            borderBR={5} 
            dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
          />
        </>
      )
    }
    return (
      <DividerWithLine 
        dividerHeight={10} 
        marginB={10} 
        borderBL={5} 
        borderBR={5} 
        dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
      />
    )
  }

  const keyExtractor = (item) => {
    return item.key
  }

  const fetchVideosByQuery = async () => {
    let videosSearchUrl = `https://api.vk.com/method/video.search?q=${searchQuery.current}&access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&extended=1`
    const searchRes = await fetch(videosSearchUrl)
    const searchData = await searchRes.json()
    const videosNum = searchData.response.count
    const videoItems = searchData.response.items.map(item => {
      const key = uuid.v4()
      return {
        ...item,
        key
      }
    })
    offset.current += count
    return {
      items: videoItems,
      videosNum,
      counterName: lang == 'ru' ? 'Результаты поиска' : 'Search result'
    }
  }

  const debounce = (func, delay=700) => {
    let debounceTimer
    return (...args) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {func(...args)}, delay)
    }
  }

  const saveInput = async (query) => {
    offset.current = 0
    searchQuery.current = query
    if (!(query.replace(/\s/g, '') === '')) {      
      setIsLoading(true)
      const fetchedByQueryVideos = await fetchVideosByQuery()
      remainToFetchNum.current = fetchedByQueryVideos.videosNum - count 
      // console.log(fetchedByQueryVideos.videosNum)
      setVideosCount(fetchedByQueryVideos.videosNum)
      setVideosCounterName(fetchedByQueryVideos.counterName)
      setVideosList(fetchedByQueryVideos.items)
      setIsLoading(false)
    }
  }

  const handleInputChange = debounce((...args) => saveInput(...args))
  
  return (
    <SafeAreaView style={[
        {flex: 1}, 
        isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}
      ]}>
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Видео' : 'Videos'}</Text>}
        iconComponent={
          currentUserId === ownerId ?
          <Entypo name='menu' color={COLORS.white} size={30}/> :
          <AntDesign name='arrowleft' size={30} color={COLORS.white}/>
        }
        iconTouchHandler={currentUserId === ownerId ? openDrawer : goBack}
        showSearchIcon={true}
        handleInputChange={handleInputChange}
        onCleaningInput={initVideosList}
        navigation={navigation}
        isScreenFromDrawerMenu={ownerId === currentUserId}
        lang={lang}
      />
      {
        isLoading ?
        <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <View style={{width: '100%', height: '100%', paddingLeft: 5, paddingRight: 5, flex: 1}}>
          <FlashList
            data={videosList}
            renderItem={renderItem}
            estimatedItemSize={93}
            onEndReached={fetchMoreVideos}
            ListHeaderComponent={listHeader}
            ListFooterComponent={footer}
            ItemSeparatorComponent={listSeparator}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor} 
          />
        </View>
      }
      {/* <VideosListDropdownMenu /> */}
      <Dropdown isLightTheme={isLightTheme} accessToken={accessToken}/>
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default VideosList

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
  headerTextStyle: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
})