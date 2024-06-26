import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native'
import React from 'react'
import * as Localization from 'expo-localization'
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from 'react-redux'
import uuid from 'react-native-uuid';
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import DividerWithLine from '../components/DividerWithLine'
import SearchResultHeaderCounter from '../components/SearchResultHeaderCounter';
import VideosListItem from '../components/VideosListItem';
import { COLORS } from '../constants/theme'

const AlbumVideos = ({navigation, route}) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = React.useState(true)
  const [videosList, setVideosList] = React.useState([])
  const count = 24
  const offset = React.useRef(0)
  const remainToFetchNum = React.useRef(null)
  const numOfVideos = React.useRef(0)
  const { albumId, headerName, ownerId } = route.params
  let headerTitle = headerName.slice(0, 24)
  if (headerTitle !== headerName) {
    headerTitle += '...'
  }

  const fetchAlbumVideos = async () => {
    const fetchAlbumPhotosUrl = `https://api.vk.com/method/video.get?access_token=${accessToken}&v=5.131&count=${count}&album_id=${albumId}&offset=${offset.current}&owner_id=${ownerId}&extended=1`
    const response = await fetch(fetchAlbumPhotosUrl)
    const data = await response.json()
    if (remainToFetchNum.current === null) {
      numOfVideos.current = data.response.count
      remainToFetchNum.current = data.response.count - count
    } else {
      remainToFetchNum.current -= count 
    }
    offset.current += count
    const videos = data.response.items.map(item => {
      const key = uuid.v4()
      return {...item, key: key}
    })
    setVideosList(prevState => prevState.concat(videos))
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchAlbumVideos()
  }, [])

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
        likes={item.likes.count}
        reposts={item.reposts.count}
        isLiked={item.likes.user_likes}
        isReposted={item.reposts.user_reposted}
        id={item.key}
        lang={lang}
      />
    )
  }

  const listSeparator = () => {
    return (
      <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
    )
  }

  const goBack = () => {
    navigation.goBack()
  }

  const keyExtractor = (item) => {
    return item.key
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
        <SearchResultHeaderCounter 
          isLightTheme={isLightTheme}
          counterName={lang == 'ru' ? 'Все видео' : 'All videos'}
          counterNum={numOfVideos.current}
        />
        <DividerWithLine 
          dividerHeight={10}  
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
        />
      </>
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
  return (
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{headerTitle}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      {
        isLoading ?
        <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <FlatList 
          data={videosList}
          style={styles.list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          ListFooterComponent={footer}
          ItemSeparatorComponent={listSeparator}
          showsVerticalScrollIndicator={false}
        />
      }  
    </SafeAreaView>
  )
}

export default AlbumVideos

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