import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, ActivityIndicator, RefreshControl, BackHandler, Animated } from 'react-native'
import React, { useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux'
import uuid from 'react-native-uuid';
import * as Localization from 'expo-localization'
import GroupListItem from '../components/GroupListItem';
import { COLORS } from '../constants/theme';
import DividerWithLine from '../components/DividerWithLine';
import CustomHeader from '../components/CustomHeader';
import Entypo from 'react-native-vector-icons/Entypo'
import SearchResultHeaderCounter from '../components/SearchResultHeaderCounter';
import { selectSortType } from '../redux/sortGroupsCollapsibleOption';
import { selectCommunityType } from '../redux/communityTypeCollapsibleOption';
import { CollapsibleOption } from '../components/Buttons';
import Overlay from '../components/Overlay';
import VisitedGroups from '../components/VisitedGroups';


const GroupList = ({navigation}) => {
  const lang = Localization.getLocales()[0].languageCode
  const accessToken = useSelector(state => state.user.accessToken)
  const [isLoading, setIsLoading] = React.useState(true)
  const [groupsData, setGroupsData] = React.useState(null)
  const drawerNavigator = navigation.getParent()
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const [groupsCount, setGroupsCount] = React.useState(null)
  const remainToFetchNum = React.useRef()
  const offset = React.useRef(0)
  const searchQuery = React.useRef('')
  const count = 5
  const [visitedGroups, setVisitedGroups] = React.useState([])
  const [groupsCounterName, setGroupsCounterName] = React.useState(lang == 'ru' ? 'Все сообщества' :'All communities')
  const slideAnimation = React.useRef(new Animated.Value(2000)).current
  const filterIsOpen = React.useRef(false)
  const connectionController = React.useRef(undefined)
  const shouldRemoveStackScreens = React.useRef()

  const sortSearchResult = useSelector(state => state.groupsSortType)
  const sortSearchResultButtons = sortSearchResult.buttons
  const chosenSortType = sortSearchResult.selectedSortType

  const communityType = useSelector(state => state.communityType)
  const communityTypeButtons = communityType.buttons
  const chosenCommunityType = communityType.selectedCommunityType

  React.useEffect(() => {
    checkForVisitedGroups()
    initGroupList()
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

  // const deleteGroupFromVisited = async () => {
  //   const visitedGroupsFromStorage = await AsyncStorage.getItem("visitedGroups");
  //   const visitedGroups = JSON.parse(visitedGroupsFromStorage);
  //   for (let i = 0; i < visitedGroups.length; i++) {
  //     if (visitedGroups[i].id === groupId) {
  //       visitedGroups.splice(i, 1)
  //       break
  //     }
  //   }
  //   await AsyncStorage.setItem("visitedGroups", JSON.stringify([...visitedGroups, {id: groupId, img: img, name: name}]))
  // }

  const checkForVisitedGroups = async () => {
    try {
      const visitedGroupsStorageData = await AsyncStorage.getItem("visitedGroups");
      const visitedGroupsData = JSON.parse(visitedGroupsStorageData)
      if (visitedGroupsData !== null) {
        setVisitedGroups(visitedGroupsData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const refreshGroupList = () => {
    setIsLoading(true)
    checkForVisitedGroups()
    initGroupList()
  }

  const fetchUsersGroups = async () => {
    const getIdsUrl = `https://api.vk.com/method/groups.get?access_token=${accessToken}&v=5.131&extended=1&fields=activity,members_count&count=${count}&offset=${offset.current}`
    let response = await fetch(getIdsUrl)
    let data = await response.json()
    offset.current += count
    const items = data.response.items.map(item => {return {...item, key: uuid.v4()}})
    return {
      items: items,
      count: data.response.count
    }
  }

  //TODO: fix several rerenders
  const initGroupList = async () => {
    offset.current = 0
    searchQuery.current = ''
    const fetchedUsersGroups = await fetchUsersGroups()
    const visitedGroupsStorageData = await AsyncStorage.getItem("visitedGroups");
    const visitedGroupsData = JSON.parse(visitedGroupsStorageData)
    setVisitedGroups(visitedGroupsData !== null ? visitedGroupsData : [])
    remainToFetchNum.current = fetchedUsersGroups.count - count
    setGroupsData(fetchedUsersGroups.items)
    setGroupsCount(fetchedUsersGroups.count)
    setGroupsCounterName(lang == 'ru' ? 'Все сообщества' : 'All communities')
    setIsLoading(false)
  }

  const openDrawer = () => {
    drawerNavigator.openDrawer()
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
          visitedGroups.length > 0 ?
          <VisitedGroups lang={lang} visitedGroups={visitedGroups} isLightTheme={isLightTheme} navigation={navigation} setVisitedGroups={setVisitedGroups}/>
          : null
        }
        <SearchResultHeaderCounter 
          isLightTheme={isLightTheme}
          counterNum={groupsCount}
          counterName={groupsCounterName} 
        />
        <DividerWithLine 
          dividerHeight={10}  
          dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
        />
      </>  
    )
  }

  const renderItem = ({item}) => (
    <GroupListItem data={item} navigation={navigation} isLightTheme={isLightTheme} lang={lang}/>
  )

  const groupListSeparator = () => (
    <DividerWithLine dividerHeight={10} dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}/>
  )

  const footer = () => {
    if (remainToFetchNum.current > 0) {
      return (
        <>
          <View style={isLightTheme ? styles.bottomSpinnerContainerLight : styles.bottomSpinnerContainerDark}>
            <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
          </View>
          <DividerWithLine 
            dividerHeight={5} 
            marginB={5} 
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

  const fetchMoreGroups = async () => {
    if (searchQuery.current === '') {
      if (remainToFetchNum.current > 0) {
        const fetchedUsersGroups = await fetchUsersGroups()
        remainToFetchNum.current -= count
        setGroupsData(prevState => prevState.concat(fetchedUsersGroups.items))
      }
    } else {
      if (remainToFetchNum.current > 0) {
        const fetchedByQueryGroups = await getGroupsByQuery()
        remainToFetchNum.current -= count
        setGroupsData(prevState => prevState.concat(fetchedByQueryGroups.items))
      }
    }
  }

  const applyFilterChange = () => {
    offset.current= 0
    setGroupsData([])
    handleInputChange(searchQuery.current)
  }
  //TODO: add AbortController()
  const getGroupsByQuery = async () => {
    // if (connectionController.current) {
    //   connectionController.current.abort()
    // } 
    // connectionController.current = new AbortController()
    // const signal = connectionController.current.signal
    let groupSearchUrl = `https://api.vk.com/method/groups.search?q=${searchQuery.current}&access_token=${accessToken}&v=5.131&count=${count}&offset=${offset.current}&sort=${chosenSortType}`
    if (chosenCommunityType !== '') { groupSearchUrl += `&type=${chosenCommunityType}`}
    const searchResponse = await fetch(groupSearchUrl)
    const searchData = await searchResponse.json()
    const groupsNum = searchData.response.count
    // console.log(searchData)
    const groupsItems = searchData.response.items
    offset.current += count
    const ids = groupsItems.map(item => {
      return item.id
    }).join()
    const getGroupUrl = `https://api.vk.com/method/groups.getById?group_ids=${ids}&access_token=${accessToken}&fields=members_count,activity&v=5.131`
    const groupsListResponse = await fetch(getGroupUrl)
    const data = await groupsListResponse.json()
    const items = data.response.map(item => {return {...item, key: uuid.v4()}})
    return {
      items: items,
      counterName: lang == 'ru' ? 'Результаты поиска' : 'Search result',
      groupsNum: groupsNum 
    }
  }

  const debounce = (func, delay=700) => {
    let debounceTimer
    return (...args) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {func(...args)}, delay)
    };
  }
  
  const saveInput = async (query) => {
    offset.current = 0
    searchQuery.current = query   
    if (!(query.replace(/\s/g, '') === '')) {      
      setIsLoading(true)
      const fetchedByQueryGroups = await getGroupsByQuery()
      remainToFetchNum.current = fetchedByQueryGroups.groupsNum - count  
      setVisitedGroups([])
      setGroupsCount(fetchedByQueryGroups.groupsNum)
      setGroupsCounterName(fetchedByQueryGroups.counterName)
      setGroupsData(fetchedByQueryGroups.items)
      setIsLoading(false)
    }
    
  }

  const handleInputChange = debounce((...args) => saveInput(...args))
  
  const keyExtractor = (item) => {
    return item.key
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (filterIsOpen.current) {
          closeFilterMenu()
          return true
        }
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [filterIsOpen.current])
  )

  const closeFilterMenu = () => {
    filterIsOpen.current = false
    Animated.timing(slideAnimation, {
      toValue: 2000,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  const openFilters = () => {
    filterIsOpen.current = true
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  return (
    <SafeAreaView style={[{flex: 1}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader
        isLightTheme={isLightTheme} 
        headerName={
          <Text style={{color: COLORS.white, fontSize: 18, fontWeight: 'bold'}}>{lang == 'ru' ? 'Сообщества' : 'Communities'}</Text>
        }
        iconComponent={
          <Entypo name='menu' color={COLORS.white} size={30}/>
        }
        iconTouchHandler={openDrawer}
        showSearchIcon={true}
        handleInputChange={handleInputChange}
        navigation={navigation}
        onCleaningInput={initGroupList}
        onOptionsButton={openFilters}
        isScreenFromDrawerMenu={true}
        lang={lang}
      />
      {
        isLoading ? 
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <FlatList 
          data={groupsData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={groupListSeparator}
          ListHeaderComponent={listHeader}
          onEndReached={fetchMoreGroups}
          refreshControl={
            <RefreshControl 
              refreshing={isLoading}
              onRefresh={refreshGroupList}
              colors={[COLORS.primary, COLORS.white, COLORS.secondary]}
              tintColor={COLORS.primary} 
              
            />
          }    
          style={styles.list}
          ListFooterComponent={footer}
          keyboardShouldPersistTaps={'handled'}
        />
      }
      <Overlay 
        slideAnimation={slideAnimation} 
        handleShadowTouch={closeFilterMenu} 
        isLightTheme={isLightTheme}
        headerText={'Filters'}
        actionButtonText={'Show Results'}
        handleActionButtonPress={applyFilterChange}
        overlayContentComponent={
          <>
            <CollapsibleOption 
              headerText={'Order'}
              buttons={[{id: 297172627290, buttonListItems: sortSearchResultButtons, onSelectItemAction: selectSortType}]}
            />
            <CollapsibleOption 
              headerText={'Community type'}
              buttons={[{id: 281273627398723, buttonListItems: communityTypeButtons, onSelectItemAction: selectCommunityType}]}
            />
          </>
        }
      />
    </SafeAreaView>
  )
}

export default GroupList

const styles = StyleSheet.create({
  spinnerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  mainContainer: {
    flex: 1,
    // backgroundColor: COLORS.light_smoke
  },
  // mainContainerDark: {
  //   flex: 1,
  //   backgroundColor: COLORS.background_dark
  // },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
  listHeaderCounterTextLight: {
    fontSize: 14,
    color: COLORS.black,
  },
  listHeaderCounterTextDark: {
    fontSize: 14,
    color: COLORS.white
  },
  bottomSpinnerContainerLight: {
    justifyContent: 'center',
    backgroundColor: COLORS.white
  },
  bottomSpinnerContainerDark: {
    justifyContent: 'center',
    backgroundColor: COLORS.primary_dark
  }
})