import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, Animated, FlatList, RefreshControl, Modal, Dimensions, TouchableOpacity, Image } from 'react-native'
import React from 'react'
// import { FlatList } from "react-native-gesture-handler";
import { useSelector } from 'react-redux'
import * as Localization from 'expo-localization'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import CustomHeader from '../components/CustomHeader'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
// import uuid from 'react-native-uuid';
import ImageViewer from 'react-native-image-zoom-viewer'
import WallHeaderGeneralInfo from '../components/WallHeaderGeneralInfo';
import WallHeaderCountersGrid from '../components/WallHeaderCountersGrid';
import WallHeaderButtons from '../components/WallHeaderButtons';
import DividerWithLine from '../components/DividerWithLine'
import Post from '../components/Post';
import Repost from '../components/Repost';
import WallIsPrivateText from '../components/WallIsPrivateText';
import WallHeaderPostSuggestButton from '../components/WallHeaderPostSuggestButton';
import WallHeaderPersonalContainer from '../components/WallHeaderPersonalContainer';
// import { setData, pushData, clear } from '../redux/userWallSlice'
import { COLORS } from '../constants/theme'
import ProfileHeaderName from '../components/ProfileHeaderName';
import { findPostAuthor } from '../utils/dataPreparationForComponents';
import PostDropdownMenu from '../components/PostDropdownMenu'
import GlobalShadow from '../components/GlobalShadow'
import Dropdown from '../components/Dropdown'
import UserHeaderCollapsibleMenu from '../components/UserHeaderCollapsibleMenu'
import ProfileOverlay from '../components/ProfileOverlay'
import OpenedPhotoBottom from '../components/OpenedPhotoBottom'

// fix redux calls
const screenWidth = Dimensions.get('window').width
const UserProfile = ({ navigation, route }) => {
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const accessToken = useSelector(state => state.user.accessToken)
  const [isUserInfoExpanded, setIsUserInfoExpanded] = React.useState(false)
  const lang = Localization.getLocales()[0].languageCode
  const isGlobalShadowExpanded = useSelector(state => state.globalShadow.isOpen)
  const authorInfoIsOpen = React.useRef(false)
  const currentUserId = useSelector(state => state.user.userId)
  const userId = route?.params !== undefined ? route.params.userId : currentUserId
  console.log(currentUserId, userId)
  const imagesForSlides = React.useRef([])
  const [isAvatarVisible, setIsAvatarVisible] = React.useState(false)
  const count = 15
  const offset = React.useRef(0) 
  const remainToFetch = React.useRef(null)
  const [userData, setUserData] = React.useState([])

  const [isLoading, setIsLoading] = React.useState(true) 
  const userInfoUrlFields = 'friend_status,followers_count,photo_200,online,last_seen,counters,status,can_send_friend_request,can_write_private_message,can_post,relation,bdate,city,interests,home_town,personal,education,universities,screen_name'
  const userInfoUrl = `https://api.vk.com/method/users.get?access_token=${accessToken}&v=5.131&user_ids=${userId}&fields=${userInfoUrlFields}`
  const userWallUrl = `https://api.vk.com/method/wall.get?access_token=${accessToken}&v=5.131&owner_id=${userId}&extended=1&count=${count}`
  const fetchGroupAvatarsUrl = `https://api.vk.com/method/photos.get?access_token=${accessToken}&v=5.199&owner_id=${userId}&album_id=profile&rev=1&count=100&extended=1`
  const [wallHeaderData , setWallHeaderData] = React.useState({screenName: lang == 'ru' ? 'Профиль' : 'Profile'})
  const shouldRemoveStackScreens = React.useRef()

  const isDropdownHidden = React.useRef(true)
  const hideDropdownAnim = React.useRef(new Animated.Value(0)).current
  const shouldHideTopAndBottom = React.useRef(false)
  const hidePhotoInfoAnim = React.useRef(new Animated.Value(0)).current
  
  const move = hidePhotoInfoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50]
  })

  const dropdownHeight = hideDropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130]
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

  const refreshProfile = () => {
    setIsLoading(true)
    offset.current = 0
    remainToFetch.current = null
    fetchData()
  }

  const fetchData = async () => {
    const avatarsResponse = await fetch(fetchGroupAvatarsUrl)
    const userInfoResponse = await fetch(userInfoUrl)
    const userWallContentResponse = await fetch(userWallUrl)
    const avatarsData = await avatarsResponse.json()
    const userInfoData = await userInfoResponse.json()
    const userWallContentData = await userWallContentResponse.json()
    // console.log(avatarsData)
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
          photo_100: userInfoData.response[0].photo_200,
          name: `${userInfoData.response[0].first_name} ${userInfoData.response[0].last_name}`
        },
        likes: item?.likes?.count,
        isLiked: item?.likes?.user_likes,
        comments: item?.comments?.count,
        reposts: item?.reposts?.count,
        albumId: item?.album_id
      }
      })
    } else {
      imagesForSlides.current = []
    }
    let isOnlineUsingMobile
    let isOnlineUsingPC
    if (userInfoData.response[0].online === 1 && userInfoData.response[0].last_seen.platform < 6) {
      isOnlineUsingMobile = true
      isOnlineUsingPC = false
    } else if (userInfoData.response[0].online === 1 && userInfoData.response[0].last_seen.platform > 5) {
      isOnlineUsingMobile = false
      isOnlineUsingPC = true
    } else {
      isOnlineUsingMobile = false
      isOnlineUsingPC = false
    }
    // console.log(userInfoData.response[0], userInfoData.response[0])
    // if (userInfoData.response[0].online === 1 && (userInfoData.response[0].online_app || userInfoData.response[0].online_mobile)) {
    //   isOnlineUsingMobile = true
    //   isOnlineUsingPC = false
    // } else if (userInfoData.response[0].online === 1) {
    //   isOnlineUsingMobile = false
    //   isOnlineUsingPC = true
    // } else {
    //   isOnlineUsingMobile = false
    //   isOnlineUsingPC = false
    // }
    setWallHeaderData({
      userName: `${userInfoData.response[0].first_name} ${userInfoData.response[0].last_name}`,
      canAccessClosed: userInfoData.response[0].can_access_closed, 
      isClosed: userInfoData.response[0].is_closed,
      isOnlineUsingMobile: isOnlineUsingMobile,
      isOnlineUsingPC: isOnlineUsingPC,
      friendStatus: userInfoData.response[0].friend_status,
      avatarUrl: userInfoData.response[0].photo_200,
      status: userInfoData.response[0].status,
      counters: userInfoData.response[0].counters,
      lastSeen: userInfoData.response[0].last_seen,
      canSendFriendRequest: userInfoData.response[0].can_send_friend_request,
      canWritePrivateMessage: userInfoData.response[0].can_write_private_message,
      canPost: userInfoData.response[0].can_post === 1 ? true : false,
      personal: userInfoData.response[0].personal,
      relation: userInfoData.response[0].relation,
      bdate: userInfoData.response[0].bdate,
      city: userInfoData.response[0].city,
      interests: userInfoData.response[0].interests,
      homeTown: userInfoData.response[0].home_town,
      education: userInfoData.response[0].education,
      universities: userInfoData.response[0].universities,
      screenName: userInfoData.response[0].screen_name
    })
    if (userWallContentData.error === undefined) {
      const items = userWallContentData.response.items.map(item => {
        const preparedItem = findPostAuthor(item, userWallContentData.response.profiles, userWallContentData.response.groups)
        return preparedItem
      })
      setUserData(items)
      offset.current += count
      remainToFetch.current = userWallContentData.response.count - count
    } else if (userWallContentData.error.error_code === 30) {
      remainToFetch.current = 0
    }
    setIsLoading(false)
  }

  const fetchMore = async () => {
    const fetchMoreWallContentUrl = `https://api.vk.com/method/wall.get?access_token=${accessToken}&v=5.131&owner_id=${userId}&extended=1&count=${count}&offset=${offset.current}`
    const wallContentResponse = await fetch(fetchMoreWallContentUrl)
    const wallContent = await wallContentResponse.json()
    if (wallContent.error === undefined) {
      const items = wallContent.response.items.map(item => {
        const preparedItem = findPostAuthor(item, wallContent.response.profiles, wallContent.response.groups)
        return preparedItem
      })
      setUserData(prevState => prevState.concat(items))
      offset.current += count
      remainToFetch.current -= count
    }
  }

  const openDrawer = () => {
    navigation.openDrawer()
  }

  const goBack = () => {
    navigation.goBack()
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    if (currentUserId === userId) {
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
    }
  }, [navigation])

  const listHeader = () => {
    // console.log('lalalalalla')
    const isThereAdditionalInfo = (
      wallHeaderData.personal !== undefined || 
      wallHeaderData.relation !== undefined || 
      wallHeaderData.bdate !== undefined ||
      wallHeaderData.city !== undefined ||
      wallHeaderData.interests !== undefined ||
      wallHeaderData.homeTown !== undefined ||
      wallHeaderData.education !== undefined ||
      wallHeaderData.universities !== undefined
    )
    
    return(
      <View style={styles.wallHeaderContainer}>
        <WallHeaderGeneralInfo 
          name={wallHeaderData.userName}
          avatarUrl={wallHeaderData.avatarUrl}
          status={wallHeaderData.status}
          lastSeen={wallHeaderData.lastSeen}
          isOnlineUsingMobile={wallHeaderData.isOnlineUsingMobile}
          isOnlineUsingPC={wallHeaderData.isOnlineUsingPC}
          chevronPressHandler={setIsUserInfoExpanded}
          expanded={isUserInfoExpanded}
          shouldPerformExpanding={isThereAdditionalInfo}
          setIsAvatarVisible={setIsAvatarVisible}
          canAccess={!(wallHeaderData.canAccessClosed === false && wallHeaderData.isClosed === true)}
        /> 
        <WallHeaderPersonalContainer 
          lang={lang}
          personal={wallHeaderData.personal}
          relation={wallHeaderData.relation}
          bdate={wallHeaderData.bdate}
          city={wallHeaderData.city}
          interests={wallHeaderData.interests}
          homeTown={wallHeaderData.homeTown}
          education={wallHeaderData.education}
          universities={wallHeaderData.universities}
          isLightTheme={isLightTheme}
          expanded={isUserInfoExpanded}    
        /> 
        <WallHeaderButtons
          lang={lang}
          isUserWall={true}  
          friendStatus={wallHeaderData.friendStatus}
          canSendFriendRequest={wallHeaderData.canSendFriendRequest}
          canWritePrivateMessage={wallHeaderData.canWritePrivateMessage}
          shouldHideButtons={currentUserId === userId}
        />
        <DividerWithLine dividerHeight={10}/>
        <WallHeaderCountersGrid 
          counters={wallHeaderData.counters} 
          navigation={navigation} 
          ownerId={userId}
          canAccess={!(wallHeaderData.canAccessClosed === false && wallHeaderData.isClosed === true)}
          isUserOnHisOwnPage={currentUserId === userId}
          author={{ownerId: userId, name: wallHeaderData.userName, photo_100: wallHeaderData.avatarUrl}}
          lang={lang}
        />
        {
          wallHeaderData.canAccessClosed === false && wallHeaderData.isClosed === true ?
          <WallIsPrivateText isPrivateText={lang == 'ru' ? 'Закрытый профиль' : 'Profile is private'}/> : null
        }
        <WallHeaderPostSuggestButton canPost={wallHeaderData.canPost} lang={lang}/>
      </View>
    )
  }

  const renderItem = ({item}) => {
    if (item.copy_history !== undefined) {
      return (
        <Repost 
          isLightMode={isLightTheme} 
          data={item} 
          openedPost={true} 
          navigation={navigation} 
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
        isLigthTheme={isLightTheme} 
        isProfileContent={true}
        id={item.key}
        accessToken={accessToken}
        lang={lang}
      />
    )
  }

  const listFooter = () => {
    if (remainToFetch.current > 0) {
      return (
        <View style={[{justifyContent: 'center'}]}>
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

  const onClose = () => {
    shouldHideTopAndBottom.current = false
    setIsAvatarVisible(false)
  }
  // console.log(isAvatarVisible)
  return (
    <SafeAreaView style={[styles.mainContainer, isLightTheme ? {backgroundColor: COLORS.light_smoke} : {backgroundColor: COLORS.background_dark}]}>
      <CustomHeader 
        iconComponent={
          currentUserId === userId ?
          <Entypo name='menu' color={COLORS.white} size={30}/> :
          <AntDesign name='arrowleft' size={30} color={COLORS.white}/>
        }
        isLightTheme={isLightTheme}
        iconTouchHandler={currentUserId === userId ? openDrawer : goBack}
        headerName={<ProfileHeaderName userShortName={wallHeaderData.screenName}/>}
        isScreenFromDrawerMenu={userId === currentUserId}
        navigation={navigation}
        rightsideIconComponent={
          <UserHeaderCollapsibleMenu 
            isLightTheme={isLightTheme} 
            accessToken={accessToken}
            data={{userId, name: wallHeaderData.userName ? wallHeaderData.userName : '', imgUrl: wallHeaderData.avatarUrl ? wallHeaderData.avatarUrl : ''}}
          />
        }
      />
      {
        isLoading ?
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={50} color={isLightTheme ? COLORS.primary : COLORS.white}/>
        </View> :
        <>
          <Modal
            animationType='fade'
            transparent={true}
            visible={isAvatarVisible}
            onRequestClose={onClose}
          >
            <ImageViewer
              imageUrls={imagesForSlides.current}
              enableImageZoom={true}
              useNativeDriver={true}
              enablePreload={true}
              enableSwipeDown={false}
              renderIndicator={(currentIndex) => <></>}
              onClick={performHidePhotoInfoAnim}
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
                // console.log(props)
                return (
                  // <OpenedPhotoBottom 
                  //   photo={imagesForSlides.current[index]}
                  //   likes={imagesForSlides.current[index].likes}
                  //   isLiked={imagesForSlides.current[index].isLiked}
                  //   comments={imagesForSlides.current[index].comments}
                  //   reposts={imagesForSlides.current[index].reposts}
                  //   navigation={navigation}
                  //   accessToken={accessToken}
                  //   ownerId={userId}
                  // />
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
                            ownerId: userId,
                            albumId: imagesForSlides.current[index].albumId,
                            date: imagesForSlides.current[index].date, 
                            author: imagesForSlides.current[index].author, 
                            width: imagesForSlides.current[index].props.style.width, 
                            height: imagesForSlides.current[index].props.style.height,
                            likes: imagesForSlides.current[index].likes,
                            reposts: imagesForSlides.current[index].reposts,
                            liked: imagesForSlides.current[index].isLiked,
                            closeModal: onClose
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
            data={userData}
            style={styles.list}
            ListHeaderComponent={listHeader}
            renderItem={renderItem}
            ListFooterComponent={listFooter}
            onEndReached={fetchMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.8}
            refreshControl={
              <RefreshControl 
                refreshing={isLoading}
                onRefresh={refreshProfile}
                colors={[COLORS.primary, COLORS.white]} 
                tintColor={isLightTheme ? COLORS.primary : COLORS.white}
              />
            }
            ListEmptyComponent={
              !(wallHeaderData.canAccessClosed === false && wallHeaderData.isClosed === true) ?
              <View style={styles.noPostsContainer}>
                <Text style={[styles.noPostsText, {color: COLORS.secondary}]}>{lang == 'ru' ? 'Нет записей' : 'No posts yet'}</Text>
              </View> : null
            }
          />
        </>
      }
      <Dropdown isLightTheme={isLightTheme} accessToken={accessToken}/>
      <ProfileOverlay isLightTheme={isLightTheme} lang={lang}/>
      {/* <PostDropdownMenu /> */}
      <GlobalShadow />
    </SafeAreaView>
  )
}

export default UserProfile

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    marginLeft: 5,
    marginRight: 5,
  },
  wallHeaderContainer: {
    padding: 10,
    backgroundColor: COLORS.very_dark_gray,
    borderRadius: 5,
    marginTop: 5,
    // flexGrow: 1,
    // flex:1
  },
  privateProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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