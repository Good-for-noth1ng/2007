import { View, Text, RefreshControl, SafeAreaView, StatusBar, ActivityIndicator, StyleSheet, FlatList, useColorScheme, Appearance, PanResponder, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import * as Localization from 'expo-localization'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../constants/theme';
import Post from '../components/Post'
import Entypo from 'react-native-vector-icons/Entypo'
// import { setItems, setGroups, setProfiles, pushItems, pushGroups, pushProfiles, setNextFrom } from '../redux/newsSlice';
// import { Header } from '@react-navigation/elements';
import CustomHeader from '../components/CustomHeader';
import NewsTitleSwitcher from '../components/NewsTitleSwitcher';
import DividerWithLine from '../components/DividerWithLine';
import Repost from '../components/Repost';
import GlobalShadow from '../components/GlobalShadow';
import PostDropdownMenu from '../components/PostDropdownMenu';
// import { FlatList } from "react-native-gesture-handler";
import { setLogin } from '../redux/userSlice'
import { findPostAuthor } from '../utils/dataPreparationForComponents';
import Dropdown from '../components/Dropdown';

//TODO fix comments, likes etc. being undefined
const News = ({navigation}) => {
  const dispatch = useDispatch()
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const count = 20
  const lang = Localization.getLocales()[0].languageCode
  const accessToken = useSelector(state => state.user.accessToken)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const nextFrom = useRef('')
  // const [isFetchingMoreData, setIsFetchingMoreData] = useState(false)
  const [postContent, setPostContent] = useState([])
  const currentNewsPage = useSelector(state => state.news.currentPage)
  const shouldRemoveStackScreens = useRef()


  const getNextFrom = async () => {
    try {
      let next = await AsyncStorage.getItem('nextFrom')
      next = JSON.parse(next)
      if (next) {
        return next
      }
      return ''
    } catch (e) {

    }
  }

  const fetchNews = async () => {
    setIsLoading(true);    
    const next = await getNextFrom()
    let newsUrl
    if (currentNewsPage === 'News') {
      newsUrl = `https://api.vk.com/method/newsfeed.get?return_banned=0&access_token=${accessToken}&count=${count}&v=5.131`
    } else {
      newsUrl = `https://api.vk.com/method/newsfeed.getRecommended?return_banned=0&access_token=${accessToken}&count=${count}&v=5.131${next != '' ? `&start_from=${next}` : ''}`
    }
    const response =  await fetch(newsUrl)
    const data = await response.json()
        // todo: handle error 43 tmp unavailable
    if (data?.error?.error_code == 5) {
      await SecureStore.setItemAsync('accessToken', '')
      dispatch(setLogin(false))
    } else {
      const items = data.response.items.map(item => { 
      const preparedItem = findPostAuthor(item, data.response.profiles, data.response.groups)
        return preparedItem
      })
      nextFrom.current = data.response.next_from
      if (currentNewsPage !== 'News') {
        await AsyncStorage.setItem("nextFrom", data.response.next_from ? JSON.stringify(data.response.next_from) : '')
      }
      setPostContent(items)
      setIsLoading(false);
    }
  }

  React.useEffect(()=> {
    //error code 5 token given to another api address
    fetchNews();
  }, [currentNewsPage])

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

  const fetchRefreshData = async () => {
    setIsLoading(true)
    let refreshUrl
    if (currentNewsPage === 'News') {
      refreshUrl = `https://api.vk.com/method/newsfeed.get?return_banned=0&access_token=${accessToken}&start_from=${nextFrom.current}&v=5.131&count=${count}`
    } else {
      refreshUrl = `https://api.vk.com/method/newsfeed.getRecommended?return_banned=0&access_token=${accessToken}&start_from=${nextFrom.current}&v=5.131&count=${count}`
    }
    const response = await fetch(refreshUrl)
    const data = await response.json()
    const items = data.response.items.map(item => {  
      const preparedItem = findPostAuthor(item, data.response.profiles, data.response.groups)
        return preparedItem
    })
    nextFrom.current = data.response.next_from
    if (currentNewsPage !== 'News') {
      await AsyncStorage.setItem("nextFrom", data.response.next_from ? JSON.stringify(data.response.next_from) : '')
    }
    setPostContent(items)
    setIsLoading(false)
  }

  const fetchMoreData = async () => {
    let fetchMoreDataUrl
    if (currentNewsPage === 'News') {
      fetchMoreDataUrl = `https://api.vk.com/method/newsfeed.get?return_banned=0&access_token=${accessToken}&count=${count}&start_from=${nextFrom.current}&v=5.131`
    } else {
      fetchMoreDataUrl = `https://api.vk.com/method/newsfeed.getRecommended?return_banned=0&access_token=${accessToken}&count=${count}&start_from=${nextFrom.current}&v=5.131`
    }
    const response = await fetch(fetchMoreDataUrl)
    const data = await response.json()  
    const items = data.response.items.map(item => {  
      const preparedItem = findPostAuthor(item, data.response.profiles, data.response.groups)
      return preparedItem
    })
    if (currentNewsPage !== 'News') {
      await AsyncStorage.setItem("nextFrom", data.response.next_from ? JSON.stringify(data.response.next_from) : '')
    }
    nextFrom.current = data.response.next_from
    setPostContent(prevState => prevState.concat(items));
  }
  
  const handleDrawerOpening = () => {
    navigation.openDrawer()
  }

  const renderItem = ({item}) => {
    if(item.copy_history !== undefined) {
      return (
        <Repost 
          data={item} 
          openedPost={true} 
          navigation={navigation} 
          isLightMode={isLightTheme}
          id={item.key}
          accessToken={accessToken}
          lang={lang}
        />
      )
    } else if (item.type === 'wall_photo' || item.type === 'friend') {
      return null
    }
    return (
      <Post 
        data={item} 
        navigation={navigation} 
        openedPost={true} 
        isLigthTheme={isLightTheme} 
        id={item.key}
        accessToken={accessToken}
        fromNewsfeed={true}
        lang={lang}
      />
    )
  }

  const listFooterComponent = () => {
    return (
      <>
        <View style={styles.bottomSpinnerContainer}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
        </View>
      </>
    )
  }
  
  const keyExtractor = (item) => {
    return item.key
  }
  
  return(
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        headerName={<NewsTitleSwitcher isLightTheme={isLightTheme}/>} 
        iconComponent={<Entypo name='menu' color={COLORS.white} size={30}/>}
        iconTouchHandler={handleDrawerOpening}
        isLightTheme={isLightTheme}
        isScreenFromDrawerMenu={true}
        navigation={navigation}
      />
        {
          isLoading ?
          <View style={styles.spinnerContainer}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
          </View> :
          <FlatList 
            data={postContent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            onEndReached={fetchMoreData}
            style={styles.listContainer}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.8}
            refreshControl={
              <RefreshControl 
                refreshing={isLoading} 
                onRefresh={fetchRefreshData} 
                colors={[COLORS.primary, COLORS.white]} 
                tintColor={isLightTheme ? COLORS.primary : COLORS.white}
              />
            }
            // CellRendererComponent={({children}) => children}
            ListFooterComponent={listFooterComponent}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={30}
          />
      } 
      <Dropdown isLightTheme={isLightTheme} accessToken={accessToken} />
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default News

const styles = StyleSheet.create({
  spinnerContainer: {
    width: '100%',
    height: '90%',
    justifyContent: 'center'
  },
  newsBackgroundLight: {
    backgroundColor: COLORS.light_smoke,
  },
  newsBackgroundDark: {
    backgroundColor: COLORS.background_dark
  },
  listContainer: {
    marginLeft: 5,
    marginRight: 5,
    zIndex: 4
  },
  bottomSpinnerContainer: {
    justifyContentL: 'center',
  }
})
