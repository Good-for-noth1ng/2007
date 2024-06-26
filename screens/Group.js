import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, RefreshControl, Modal, Dimensions, TouchableOpacity, Image, Animated } from 'react-native'
import React from 'react'
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from 'react-redux'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS } from '../constants/theme'
import CustomHeader from '../components/CustomHeader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
// import uuid from 'react-native-uuid';
import ImageViewer from 'react-native-image-zoom-viewer'
import Post from '../components/Post'
// import { setData, pushData } from '../redux/groupSlice'
import Repost from '../components/Repost'
import WallHeader from '../components/WallHeader'
import DividerWithLine from '../components/DividerWithLine'
import WallHeaderGeneralInfo from '../components/WallHeaderGeneralInfo';
import WallHeaderCountersGrid from '../components/WallHeaderCountersGrid';
import WallHeaderButtons from '../components/WallHeaderButtons';
import WallHeaderPostSuggestButton from '../components/WallHeaderPostSuggestButton';
import WallHeaderAdditionalInfo from '../components/WallHeaderAdditionalInfo'
import WallIsPrivateText from '../components/WallIsPrivateText';
import { cleanAdditionalInfoLinksAndUsers } from '../utils/dataPreparationForComponents'
import ProfileHeaderName from '../components/ProfileHeaderName';
import { findPostAuthor } from '../utils/dataPreparationForComponents';
import { postWidth } from '../constants/theme';
// import PostDropdownMenu from '../components/PostDropdownMenu';
import GlobalShadow from '../components/GlobalShadow';
import GroupHeaderCollapsibleMenu from '../components/GroupHeaderCollapsibleMenu';
import Dropdown from '../components/Dropdown';
import OpenedPhotoBottom from '../components/OpenedPhotoBottom';

//TODO: replace selectors on usestate
const screenWidth = Dimensions.get('window').width
const Group = ({navigation, route}) => {
  // const dispatch = useDispatch();
  const accessToken = useSelector(state => state.user.accessToken)
  const lang = Localization.getLocales()[0].languageCode
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const [wallHeaderData, setWallHeaderData] = React.useState({screenName: lang == 'ru' ? 'Сообщество' : 'Community'})
  const [groupData, setGroupData] = React.useState([])
  
  // const [groupAvatars, setGroupAvatars] = React.useState([])
  const imagesForSlides = React.useRef([])
  const [isAvatarVisible, setIsAvatarVisible] = React.useState(false) 
  const offset = React.useRef(0)
  const remainToFetchNum = React.useRef(null)
  const count = 20
  const { groupId } = route.params
  const [isAdditionalInfoExpanded, setIsAdditionalInfoExpanded] = React.useState(false)
  // const groupData = useSelector(state => state.group)
  // const groupID = groupData.id  
  // const offset = groupData.offset  
  // const postData = groupData.items 
  // const totalPostCount = groupData.totalPostCount
  const fields = 'members_count,counters,description,status,can_message,description,contacts,addresses,screen_name,links,main_section,can_post,can_suggest,member_status' 
  const fetchGroupWallContentUrl = `https://api.vk.com/method/wall.get?access_token=${accessToken}&count=${count}&v=5.131&extended=1&owner_id=${-1 * groupId}`
  const fetchGroupInfoUrl = `https://api.vk.com/method/groups.getById?access_token=${accessToken}&v=5.131&group_id=${groupId}&fields=${fields}`
  const fetchGroupAvatarsUrl = `https://api.vk.com/method/photos.get?access_token=${accessToken}&v=5.199&owner_id=${-groupId}&album_id=profile&rev=1&count=100&extended=1`
  const [isLoading, setIsLoading] = React.useState(true)  
  
  console.log(groupId)

  const isDropdownHidden = React.useRef(true)
  const shouldHideTopAndBottom = React.useRef(false)
  const hideDropdownAnim = React.useRef(new Animated.Value(0)).current
  const hidePhotoInfoAnim = React.useRef(new Animated.Value(0)).current

  const dropdownHeight = hideDropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130]
  })

  const move = hidePhotoInfoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50]
  })
  // const moveDown = hidePhotoInfoAnim.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 50]
  // })

  const copyImgLink = async () => {}

  const downloadImg = async () => {
  }
  
  const save = async (uri, filename, mimetype) => {
  }

  const openAvatarDropdown = () => {
    Animated.timing(hideDropdownAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false
    }).start()
    isDropdownHidden.current = false
  }

  const closeAvatarDropdown = () => {
    if (isDropdownHidden.current == false) {
      Animated.timing(hideDropdownAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false
      }).start()
      isDropdownHidden.current = true
    }
  }

  const performHidePhotoInfoAnim = () => {
    if (isDropdownHidden.current) {
      if (shouldHideTopAndBottom.current) {
        Animated.timing(hidePhotoInfoAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false
        }).start()
      } else {
        Animated.timing(hidePhotoInfoAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false
        }).start()
      }
      shouldHideTopAndBottom.current = !shouldHideTopAndBottom.current
    } else {
      closeAvatarDropdown()
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  const addGroupToVisitedStack = async (img, name) => {
    try {
      const visitedGroupsFromStorage = await AsyncStorage.getItem("visitedGroups");
      const visitedGroups = JSON.parse(visitedGroupsFromStorage);
      if (visitedGroups === null) {
        await AsyncStorage.setItem("visitedGroups", JSON.stringify([{id: groupId, img: img, name: name}]))
      } else {
        const indexToDelete = visitedGroups.findIndex(item => item.id === groupId)
        console.log(indexToDelete)
        if (indexToDelete !== -1) {
          visitedGroups.splice(indexToDelete, 1)
        }
        // for (let i = 0; i < visitedGroups.length; i++) {
        //   if (visitedGroups[i].id === groupId) {
        //     visitedGroups.splice(i, 1)
        //     break
        //   }
        // }
        const visited = [{id: groupId, img: img, name: name}, ...visitedGroups]
        await AsyncStorage.setItem("visitedGroups", JSON.stringify(visited))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = async () => {
    const response = await fetch(fetchGroupWallContentUrl)
    const groupHeaderResponse = await fetch(fetchGroupInfoUrl)
    const avatarsResponse = await fetch(fetchGroupAvatarsUrl)
    const avatarsData = await avatarsResponse.json()
    const data = await response.json()
    const groupHeaderData = await groupHeaderResponse.json()
    if (avatarsData?.error?.error_code !== 30) {
      imagesForSlides.current = avatarsData.response.items.map(item => {
        const url = item.sizes.sort(function(a, b){return b.width - a.width})[0].url
        return {
          url,
          photoId: item.id,
          ownerId: item.owner_id,
          userId: item.user_id,
          text: item.text,
          date: item.date,
          author: {
            photo_100: groupHeaderData.response[0].photo_200,
            name: groupHeaderData.response[0].name
          },
          likes: item?.likes?.count,
          isLiked: item?.likes?.user_likes,
          comments: item?.comments?.count,
          reposts: item?.reposts?.count
        }
      })
    } else {
      imagesForSlides.current = []
    }
    
    const contactsIds = groupHeaderData.response[0].contacts?.map(item => item.user_id)
    const contacts = await fetch(`https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.131&user_ids=${contactsIds}&fields=photo_100`)
    const contactsDetailedRes = await contacts.json()
    const contactsDetailed = contactsDetailedRes.response
    const {cleanedLinks, cleanedUsers} = cleanAdditionalInfoLinksAndUsers(groupHeaderData.response[0].links, groupHeaderData.response[0].contacts, contactsDetailed)
    addGroupToVisitedStack(groupHeaderData.response[0].photo_200, groupHeaderData.response[0].name)
    setWallHeaderData({
      communityName: groupHeaderData.response[0].name,
      communityMembersCount: groupHeaderData.response[0].members_count,
      communityAvatarUrl: groupHeaderData.response[0].photo_200,
      communityStatus: groupHeaderData.response[0].status,
      isMemberOfCommunity: groupHeaderData.response[0].is_member === 1 ? true : false,
      counters: groupHeaderData.response[0].counters,
      canMessage: groupHeaderData.response[0].can_message,
      description: groupHeaderData.response[0].description,
      cleanedLinks,
      cleanedUsers,
      screenName: groupHeaderData.response[0].screen_name,
      canSuggest: groupHeaderData.response[0].can_suggest === 1 ? true : false,
      canPost: groupHeaderData.response[0].can_post === 1 ? true : false,
      memberStatus: groupHeaderData.response[0].member_status
      // contacts: groupHeaderData.response[0].contacts,
      // contactsDetailed: contactsDetailed,
      // links: groupHeaderData.response[0].links
    })
    // console.log(groupHeaderData.response[0].contacts)
    // console.log(data)
    if (data.error === undefined) {
      const items = data.response.items.map(item => {
        const preparedItem = findPostAuthor(item, data.response.profiles, data.response.groups)
        return preparedItem
      }) 
      remainToFetchNum.current = data.response.count - count
      setGroupData(items)
      setWallHeaderData(prevState => ({...prevState, canAccess: true}))
      // dispatch(setData(data.response))
    } else {
      setGroupData([])
      setWallHeaderData(prevState => ({...prevState, canAccess: false}))
      // dispatch(setData(data.response))
    }

    offset.current += count 
    
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchMoreData = () => {
    const url = `https://api.vk.com/method/wall.get?owner_id=${-1 * groupId}&access_token=${accessToken}&extended=1&count=${count}&offset=${offset.current}&v=5.131`
    fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error === undefined) {
        const items = data.response.items.map(item => {
          const preparedItem = findPostAuthor(item, data.response.profiles, data.response.groups)
          return preparedItem
        })
        offset.current += count
        remainToFetchNum.current -= count
        setGroupData(prevState => prevState.concat(items))
      }
    })
  }

  const listHeader = () => {
    const isThereAdditionalInfo = (
      wallHeaderData.description !== undefined ||
      wallHeaderData.cleanedLinks !== undefined ||
      wallHeaderData.cleanedUsers !== undefined
    )
    return (
      <View style={styles.headerContainer}>
        <WallHeaderGeneralInfo 
          name={wallHeaderData.communityName}
          avatarUrl={wallHeaderData.communityAvatarUrl}
          status={wallHeaderData.communityStatus}
          chevronPressHandler={setIsAdditionalInfoExpanded}
          expanded={isAdditionalInfoExpanded}
          shouldPerformExpanding={isThereAdditionalInfo}
          setIsAvatarVisible={setIsAvatarVisible}
          canAccess={wallHeaderData.canAccess}
          lang={lang}
        />
        <WallHeaderAdditionalInfo 
          description={wallHeaderData.description}
          cleanedLinks={wallHeaderData.cleanedLinks}
          cleanedUsers={wallHeaderData.cleanedUsers}
          navigation={navigation}
          lang={lang}
          expanded={isAdditionalInfoExpanded}
        /> 
        <WallHeaderButtons
          isUserWall={wallHeaderData.isUserWall} 
          isMember={wallHeaderData.isMemberOfCommunity} 
          canWritePrivateMessage={wallHeaderData.canMessage}
          memberStatus={wallHeaderData.memberStatus}
          accessToken={accessToken}
          groupId={groupId}
          navigation={navigation}
          lang={lang}
        />
        <DividerWithLine dividerHeight={10}/>
        <WallHeaderCountersGrid 
          membersCount={wallHeaderData.membersCount} 
          counters={wallHeaderData.counters} 
          ownerId={-1 * groupId} 
          navigation={navigation}
          canAccess={wallHeaderData.canAccess}
          lang={lang}
        />
        {
          !wallHeaderData.canAccess ? 
          <WallIsPrivateText  isPrivateText={lang == 'ru' ? 'Закрытое сообщество' : 'Community is private'}/> : null 
        }
        <DividerWithLine dividerHeight={10}/>
        <WallHeaderPostSuggestButton 
          canPost={wallHeaderData.canPost} 
          canSuggest={wallHeaderData.canSuggest} 
          isCommunityWall={true}
          lang={lang}
        />
      </View>
    )
  }

  const keyExtractor = (item) => {
    return item.key
  }

  const renderItem = ({item}) => {
    if(item.copy_history !== undefined) {
      return (
        <Repost 
          isLightMode={isLightTheme} 
          data={item} 
          openedPost={true} 
          navigation={navigation} 
          isCommunityContent={true}
          id={item.key}
          accessToken={accessToken}
          lang={lang}
        />
      )
    } 
    return (
      <Post 
        data={item} 
        navigation={navigation} 
        openedPost={true} 
        isCommunityContent={true} 
        isLigthTheme={isLightTheme}
        id={item.key}
        accessToken={accessToken}
        lang={lang}
      />
    )
  }

  const listFooter = () => {
    if (remainToFetchNum.current > 0) {
      return (
        <View style={[{justifyContent: 'center'}, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColorL: COLORS.background_dark}]}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={40}/>
        </View>
      )
    }
    return null
    // return (
    //   <DividerWithLine 
    //     dividerHeight={10} 
    //     marginB={10} 
    //     borderBL={5} 
    //     borderBR={5} 
    //     dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark}
    //   />
    // )
  }
  
  return (
    <SafeAreaView style={[styles.feedContainer, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        iconComponent={<AntDesign name='arrowleft' size={30} color={COLORS.white}/>}
        iconTouchHandler={goBack}
        headerName={<ProfileHeaderName userShortName={wallHeaderData.screenName}/>}
        isLightTheme={isLightTheme}
        rightsideIconComponent={
          <GroupHeaderCollapsibleMenu 
            isLightTheme={isLightTheme} 
            accessToken={accessToken}
            data={{groupId}}
          />
        }
      />
      {
        isLoading ?
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color={isLightTheme ? COLORS.primary : COLORS.white} size={50}/>
        </View> :
        <>
          <Modal
            animationType='fade'
            transparent={true}
            visible={isAvatarVisible}
            onRequestClose={
              () => {
                shouldHideTopAndBottom.current = false
                setIsAvatarVisible(prev => !prev)
              }
            }
          >
            <ImageViewer
              imageUrls={imagesForSlides.current}
              enableImageZoom={true}
              useNativeDriver={true}
              enablePreload={true}
              enableSwipeDown={false}
              onClick={performHidePhotoInfoAnim}
              renderIndicator={(currentIndex) => <></>}
              onMove={closeAvatarDropdown}
              renderHeader={
              (currentIndex) => (
                <Animated.View 
                  style={{
                    position: 'absolute', 
                    zIndex: 3, 
                    flexDirection: 'row', 
                    width: screenWidth, 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingLeft: 10, 
                    paddingRight: 10, 
                    marginTop: 10,
                    transform: [{translateY: move}]
                  }}
                >
                  <View style={{flexDirection: 'row', gap: 30}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => setIsAvatarVisible(false)}>
                      <AntDesign name={'arrowleft'} size={25} color={COLORS.white}/>
                    </TouchableOpacity>
                    <Text style={{color: COLORS.white, fontSize: 17}}>{currentIndex + 1} {lang == 'ru' ? 'из' : 'of'} {imagesForSlides.current.length}</Text>
                  </View>
                  <TouchableOpacity onPress={openAvatarDropdown}>
                    <Feather name={'more-vertical'} color={COLORS.white} size={25}/>
                  </TouchableOpacity>
                </Animated.View>
              )
            }
            renderImage={
              (props) => {
                // console.log(props.source.uri)
                return(
                  <Image source={{uri: props.source.uri}} style={{flex: 1, width: null, height: null}} resizeMode={'contain'}/>
                )
              }
            }
            renderFooter={
              (index) => {
                return (
                  <Animated.View 
                    style={{
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      width: screenWidth, 
                      paddingLeft: 15, 
                      paddingRight: 15, 
                      paddingBottom: 10,
                      bottom: move
                    }}
                  >
                    <TouchableOpacity style={{flexDirection: 'row', gap: 5}}>
                      {
                        imagesForSlides.current[index].isLiked ?
                        <AntDesign name={'heart'} color={COLORS.primary} size={20}/> :
                        <AntDesign name={'hearto'} color={COLORS.white} size={20}/>
                      }
                      <Text style={{color: COLORS.white, fontSize: 14}}>{imagesForSlides.current[index].likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={
                        () => navigation.push(
                          'OpenedPhoto', 
                          {
                            photoUrl: imagesForSlides.current[index].url,
                            photoId: imagesForSlides.current[index].photoId,
                            text: imagesForSlides.current[index].text,
                            userId: imagesForSlides.current[index].userId,
                            ownerId: -groupId, 
                            date: imagesForSlides.current[index].date, 
                            author: imagesForSlides.current[index].author, 
                            width: imagesForSlides.current[index].props.style.width, 
                            height: imagesForSlides.current[index].props.style.height,
                          }
                        )
                      }
                      style={{flexDirection: 'row', gap: 5}}
                    >
                      <MaterialCommunityIcons name={'comment-outline'} color={COLORS.white} size={20} />
                      <Text style={{color: COLORS.white, fontSize: 14}}>{imagesForSlides.current[index].comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row', gap: 5}}>
                      <MaterialCommunityIcons name={'share-outline'} size={22} color={COLORS.white}/>
                      <Text style={{color: COLORS.white, fontSize: 14}}>{imagesForSlides.current[index].reposts}</Text>
                    </TouchableOpacity>
                   </Animated.View>
                )
              }
              } 
            />
            <Animated.View style={[{transform: [{translateX: screenWidth / 2}, {translateY: 10}], paddingLeft: 5, backgroundColor: COLORS.white, width: 170, zIndex: 3, position: 'absolute', borderRadius: 5}, {height: dropdownHeight}]}>
              <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={downloadImg}>
                <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Скачать' : 'Download'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Копировать ссылку' : 'Copy'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 16}}>{lang == 'ru' ? 'Добавить в сохраненные' : 'Add to saved'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </Modal>
          <FlatList 
            data={groupData}
            renderItem={renderItem}
            initialNumToRender={4}
            keyExtractor={keyExtractor}
            removeClippedSubviews={true}
            onEndReached={fetchMoreData}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            style={styles.feed}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            refreshControl={
              <RefreshControl 
                refreshing={isLoading} 
                onRefresh={fetchData} 
                colors={[COLORS.primary, COLORS.white]} 
                tintColor={isLightTheme ? COLORS.primary : COLORS.white}
              />
            }
            ListEmptyComponent={
              wallHeaderData.canAccess ?
              <View style={styles.noPostsContainer}>
                <Text style={[styles.noPostsText, {color: COLORS.secondary}]}>No posts yet</Text>
              </View> : null
            }
          />
        </>   
      }
      <Dropdown isLightTheme={isLightTheme} accessToken={accessToken}/>
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default Group

const styles = StyleSheet.create({
  spinnerContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  feed: {
    marginLeft: 5,
    marginRight: 5,
  },
  feedContainer: {
    flex: 1,
    // backgroundColor: COLORS.light_smoke,
  },
  // feedContainerDark: {
  //   flex: 1,
  //   backgroundColor: COLORS.background_dark,
  // },
  bottomSpinnerContainer: {
    justifyContent: 'center'
  },
  headerContainer: {
    padding: 10,
    backgroundColor: COLORS.very_dark_gray,
    borderRadius: 5,
    marginTop: 5
  },
  noPostsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  noPostsText: {
    fontSize: 17,
    fontWeight: 'bold'
  }
})