import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native'
import React from 'react'
import * as Localization from 'expo-localization'
import { FlatList } from "react-native-gesture-handler";
import uuid from 'react-native-uuid';
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CustomHeader from '../components/CustomHeader'
import VideosListItem from '../components/VideosListItem'
import DividerWithLine from '../components/DividerWithLine'
import AlbumListItem from '../components/AlbumListItem';
import { COLORS } from '../constants/theme'

const PhotoAlbumsList = ({navigation, route}) => {
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [albumsList, setAlbumsList] = React.useState([])
  const count = 10
  const offset = React.useRef(0)
  const remainToFetchNum = React.useRef(null)
  const numOfAlbums = React.useRef(0)
  const { ownerId } = route.params


  const fetchAlbums = async () => {
    const fetchAlbumsUrl = `https://api.vk.com/method/photos.getAlbums?access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&owner_id=${ownerId}&need_covers=1&photo_sizes=1`
    const response = await fetch(fetchAlbumsUrl)
    const data = await response.json()
    if (remainToFetchNum.current === null) {
      if (ownerId < 0) {
        fetchAlbumsCountUrl = `https://api.vk.com/method/photos.getAlbumsCount?access_token=${accessToken}&v=5.131&group_id=${-1 * ownerId}`
      } else {
        fetchAlbumsCountUrl = `https://api.vk.com/method/photos.getAlbumsCount?access_token=${accessToken}&v=5.131&user_id=${ownerId}`
      }
      const albumsCountRes = await fetch(fetchAlbumsCountUrl)
      const albumsCount = await albumsCountRes.json()
      remainToFetchNum.current = albumsCount.response - count
    } else {
      remainToFetchNum.current -= count
    }
    offset.current += count
    const albums = data.response.items.map(item => {
      const key = uuid.v4()
      return {...item, key}
    })
    setAlbumsList(prevState => prevState.concat(albums))
  }

  React.useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchMore = () => {
    if (remainToFetchNum.current > 0) {
      fetchAlbums()
    }
  }
  const listHeader = () => {
    return (
      <DividerWithLine 
        dividerHeight={10} 
        marginT={10} 
        borderTL={5} 
        borderTR={5} 
        dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
      />
    )
  }

  const listSeparator = () => {
    return (
      <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
    )
  }

  const renderItem = ({item}) => {
    return (
      <AlbumListItem
        albumTitle={item.title}
        albumItemsCount={item.size}
        imageUrl={item.sizes[item.sizes.length - 1].url}
        isLightTheme={isLightTheme}
        navigation={navigation}
        ownerId={item.owner_id}
        id={item.id}
        type={'photos'}
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

  const goBack = () => {
    navigation.goBack()
  }
  return (
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        isLightTheme={isLightTheme}
        headerName={<Text style={styles.headerTextStyle}>{lang == 'ru' ? 'Альбомы' : 'Albums'}</Text>}
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
      />
      <FlatList
        style={styles.list} 
        data={albumsList}
        renderItem={renderItem}
        ListFooterComponent={footer}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={listSeparator}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMore}
        ListEmptyComponent={
          <View style={[styles.spinnerContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
          </View>
        }
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  )
}

export default PhotoAlbumsList

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