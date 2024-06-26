import { StyleSheet, Text, View, Animated, TouchableOpacity, ToastAndroid, BackHandler, Dimensions } from 'react-native'
import React from 'react'
import * as Clipboard from 'expo-clipboard'
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'
import { setUserForFetchingInfo } from '../redux/regDateSlice';
import { setCommentsSortType } from '../redux/commentsSlice';
import { COLORS } from '../constants/theme'

const width = Dimensions.get('window').width
const Dropdown = ({ isLightTheme, accessToken }) => {
  const dispatch = useDispatch()
  const lang = 'ru'
  const commentsSortType = useSelector(state => state.comments.commentsSortType)
  const dropdownData = useSelector(state => state.globalShadow)
  const isShadowExpanded = dropdownData.isOpen
  const data = dropdownData.data
  const dropdownType = dropdownData.dropdownType
  const shouldPerformAnimation = React.useRef(false)
  const listHeight = React.useRef(new Animated.Value(0)).current
  let listTargetHeight
  // console.log(data)
  switch (dropdownType) {
    case 'post':
      listTargetHeight = 160
      break;
    case 'openPost':
      listTargetHeight = 150
      break
    case 'videoListItem':
      listTargetHeight = 300
      break
    case 'group':
      listTargetHeight = 200
      break
    case 'videoScreen':
      listTargetHeight = 300
      break
    case 'profile':
      listTargetHeight = 250
      break
    case 'commentsSort':
      listTargetHeight = 100
      break
    case 'relation':
      listTargetHeight = 250
      break
    default:
      listTargetHeight = 160
      break;
  }

  useFocusEffect(React.useCallback(() => {
    const onBackPress = () => {
      if (isShadowExpanded) {
        dispatch(collapseShadow())
        return true
      }
      return false
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () => subscription.remove()
  }, [isShadowExpanded]))

  React.useEffect(() => {
    if (shouldPerformAnimation.current) {
      if (isShadowExpanded) {
        Animated.timing(listHeight, {
          toValue: listTargetHeight,
          duration: 100,
          useNativeDriver: false,
        }).start()
      } else {
        Animated.timing(listHeight, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start()
      }
    } else {
      shouldPerformAnimation.current = true
    }
  }, [isShadowExpanded])

  const openProfileRegistartionDate = () => {
    dispatch(collapseShadow())
    dispatch(expandShadow({dropdownType: 'none'}))
    dispatch(setUserForFetchingInfo({registrationDate: 0, name: data.name, imgUrl: data.imgUrl, userId: data.userId, isFetching: true, isOpen: true}))
    let profileDataRegUrl = `https://vkdia.com/pages/fake-vk-profile/registration-date?vkId=${data.userId}`;
    const re = /^\d*$/g; 
    if (data.userId > 0) {
      fetch(profileDataRegUrl)
      .then(response => response.json())
      .then(result => {
        const regDate = result.regDate 
        if (re.test(regDate)) {
          dispatch(
            setUserForFetchingInfo({
              name: data.name, 
              imgUrl: data.imgUrl, 
              userId: data.userId, 
              isFetching: false, 
              registrationDate: regDate, 
              isOpen: true,
            })
          )
        }
      })
    } else {
      dispatch(setUserForFetchingInfo({
        registrationDate: 0,
        name: '',
        imgUrl: 'banned',
        userId: vkId,
        isFetching: false,
      }))
    }
  }

  const addGroupToFave = async () => {
    const url = `https://api.vk.com/method/fave.addPage?access_token=${accessToken}&v=5.131&group_id=${data.groupId}`
    const res = await fetch(url)
    const parsed = await res.json()
    if (parsed.response === 1) {
      ToastAndroid.show(lang == 'ru' ? 'Добавлено в избранное!' : 'Added to Favorite!', ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Network Error', ToastAndroid.SHORT)
    }
    dispatch(collapseShadow())
  }

  const addProfileToFave = async () => {
    const url = `https://api.vk.com/method/fave.addPage?access_token=${accessToken}&v=5.131&user_id=${data.userId}`
    const res = await fetch(url)
    const parsed = await res.json()
    if (parsed.response === 1) {
      ToastAndroid.show(lang == 'ru' ? 'Добавлено в избранное!' : 'Added to Favorite!', ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Network Error', ToastAndroid.SHORT)
    }
    dispatch(collapseShadow())
    // console.log(parsed) 
  }

  const addPostToFave = async () => {
    const url = `https://api.vk.com/method/fave.addPost?access_token=${accessToken}&v=5.131&owner_id=${data.owner_id ? data.owner_id : data.source_id}&id=${data.id ? data.id : data.post_id}${data.access_key ? `&access_key=${data.access_key}` : ''}`
    const response = await fetch(url)
    const parsedRes = await response.json()
    if (parsedRes.response === 1) {
      ToastAndroid.show(lang == 'ru' ? 'Добавлено в избранное!' : 'Added to Favorite!', ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Network Error', ToastAndroid.SHORT)
    }
    dispatch(collapseShadow())
  }

  const notInterested = async () => {
    const setNotInterested = data.setShowNotInterested
    const url = `https://api.vk.com/method/newsfeed.ignoreItem?access_token=${accessToken}&v=5.131&owner_id=${data.owner_id}&type=wall&item_id=${data.id ? data.id : data.post_id}`
    const res = await fetch(url)
    const par = await res.json()
    if (par.response == 1) {
      setNotInterested(true)
    } else {
      ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Network Error', ToastAndroid.SHORT)
    }
    // console.log(data.owner_id, data.post_id)
    
    dispatch(collapseShadow())
  }

  const removePostFromFavorite = async () => {
    const func = data.func
    func(data.favId)
    const url = `https://api.vk.com/method/fave.removePost?access_token=${accessToken}&v=5.131&owner_id=${data.owner_id ? data.owner_id : data.source_id}&id=${data.id ? data.id : data.post_id}${data.access_key ? `&access_key=${data.access_key}` : ''}`
    const response = await fetch(url)
    const parsedRes = await response.json()
    if (parsedRes.response === 1) {
      ToastAndroid.show(lang == 'ru' ? 'Удалено из избранного!' : 'Removed from Fave!', ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Network Error', ToastAndroid.SHORT)
    }
    dispatch(collapseShadow())
  }

  const copyPostLink = async () => {
    await Clipboard.setStringAsync(`https://vk.com/wall${data.owner_id ? data.owner_id : data.source_id}_${data.id ? data.id : data.post_id}`)
    ToastAndroid.show(lang == 'ru' ? 'Скопировано!' : 'Copied!', ToastAndroid.SHORT)
    dispatch(collapseShadow())
  }

  const sortCommentsOldFirst = () => {
    if (commentsSortType === 'asc') {
      dispatch(collapseShadow())
    } else {
      // const func = data.setCommentsSortType 
      // func('desc')
      dispatch(collapseShadow())
      dispatch(setCommentsSortType())
    }
  }

  const sortCommentsNewFirst = () => {
    if (commentsSortType === 'desc') {
      dispatch(collapseShadow())
    } else {
      // const func = data.setCommentsSortType 
      // func('asc')
      dispatch(collapseShadow())
      dispatch(setCommentsSortType())
    }
  }

  const onRelationshipOption = (rel) => {
    const setNewStatus = data.setNewStatus
    setNewStatus(rel)
    dispatch(collapseShadow())
  }

  if (dropdownType === 'post') {
    return (
      <Animated.View 
        style={[
        styles.postDropdownMenu,
        { 
          height: listHeight,   
        },
        isLightTheme ? 
        {backgroundColor: COLORS.white} :
        {backgroundColor: COLORS.very_dark_gray},
        {transform: [{translateX: dropdownData.dropdownX - 150}, {translateY: dropdownData.dropdownY}]}
      ]}>
        <TouchableOpacity style={styles.postDropdownMenuButton} onPress={data.is_favorite ? removePostFromFavorite : addPostToFave} activeOpacity={0.8}>
          <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {
              data.is_favorite ? 
              lang == 'ru' ? 'Удалить из избранного' : 'Remove from fave' : 
              lang == 'ru' ? 'Добавить в избранное' : 'Add to Bookmarks'
            }
          </Text>
        </TouchableOpacity>
        {
          data.fromNewsfeed ? 
          <TouchableOpacity style={styles.postDropdownMenuButton} onPress={notInterested}>
            <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Скрыть' : 'Not interested'}
            </Text>
          </TouchableOpacity> : null
        }
        <TouchableOpacity style={styles.postDropdownMenuButton} onPress={copyPostLink} activeOpacity={0.8}>
          <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Скопировать ссылку' : 'Copy Link'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postDropdownMenuButton}>
          <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Пожаловаться' : 'Report'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  } else if (dropdownType === 'group') {
    return (
      <Animated.View style={[
        styles.headerDropdown,
        {height: listHeight}, 
        isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor : COLORS.secondary},
        {transform: [{translateX: dropdownData.dropdownX - 180}, {translateY: dropdownData.dropdownY}]}
      ]}>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.secondary}
          ]} 
          onPress={addGroupToFave}
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Добавить в избранное' : 'Add to Bookmarks'}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.secondary}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Leave/Join Community</Text>
        </TouchableOpacity> */}
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.secondary}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Скопировать ссылку' : 'Copy link'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.secondary}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Пожаловаться' : 'Report'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  } else if (dropdownType === 'openPost') {
    return (
      <Animated.View style={[
        styles.headerDropdown,
        {height: listHeight}, 
        isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor : COLORS.secondary},
        {transform: [{translateX: dropdownData.dropdownX - 180}, {translateY: dropdownData.dropdownY}]}
      ]}>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Добавить в избранное' : 'Add to Bookmarks'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Копировать ссылку' : 'Copy link'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{lang == 'ru' ? 'Пожаловаться' : 'Report'}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  } else if (dropdownType === 'videoListItem') {
    return (
      <Animated.View 
      style={[
      styles.postDropdownMenu,
      { 
        height: listHeight,   
      },
      isLightTheme ? 
      {backgroundColor: COLORS.white} :
      {backgroundColor: COLORS.very_dark_gray},
      {transform: [{translateX: dropdownData.dropdownX - 150}, {translateY: dropdownData.dropdownY}]}
    ]}>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Добавить в избранное' : 'Add to Bookmarks'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Добавить в мои видео' : 'Add to my videos'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Добавить в плейлист' : 'Add to playlist'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Копировать ссылку' : 'Copy Link'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Поделиться' : 'Share'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Скрыть' : 'Not interesting'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Пожаловаться' : 'Report'}
        </Text>
      </TouchableOpacity>
    </Animated.View>)
  } else if (dropdownType === 'videoScreen') {
    return (
      <Animated.View 
      style={[
      styles.postDropdownMenu,
      { 
        height: listHeight,   
      },
      isLightTheme ? 
      {backgroundColor: COLORS.white} :
      {backgroundColor: COLORS.very_dark_gray},
      {transform: [{translateX: dropdownData.dropdownX - 150}, {translateY: dropdownData.dropdownY}]}
    ]}>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Добавить в избранное' : 'Add to Bookmarks'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Добавить в мои видео' : 'Add to my videos'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Добавить в плейлист' : 'Add to playlist'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Копировать ссылку' : 'Copy Link'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Поделиться' : 'Share'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Скрыть' : 'Not interesting'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
          {lang == 'ru' ? 'Пожаловаться' : 'Report'}
        </Text>
      </TouchableOpacity>
    </Animated.View>)
  } else if (dropdownType === 'profile') {
    return (
      <Animated.View style={[
        styles.headerDropdown,
        {height: listHeight}, 
        isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor : COLORS.secondary},
        {transform: [{translateX: dropdownData.dropdownX - 180}, {translateY: dropdownData.dropdownY}]}
      ]}>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]}
          onPress={addProfileToFave}
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Добавить в избранное' :'Add to Bookmarks'}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Leave/Join Community</Text>
        </TouchableOpacity> */}
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Копировать ссылку' : 'Copy link'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]} 
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru'  ? 'Пожаловаться' :'Report'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.headerDropdownOptionContainer,  
            isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke}
          ]}
          onPress={openProfileRegistartionDate}
        >
          <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Дата регистрации' : 'Registration Date'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  } else if (dropdownType === 'commentsSort') {
    return (
      <Animated.View 
        style={[
          styles.commentsSortDropdown,
          { 
            height: listHeight,   
          },
          isLightTheme ? 
          {backgroundColor: COLORS.white} :
          {backgroundColor: COLORS.very_dark_gray},
          {transform: [{translateX: dropdownData.dropdownX - 73}, {translateY: dropdownData.dropdownY}]}
        ]}>
        <TouchableOpacity style={styles.commentsSortDropdownButton} activeOpacity={0.5} onPress={sortCommentsOldFirst}>
          <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Старые' : 'Old'}
          </Text>
          {commentsSortType === 'asc' && <Feather name='check' size={20} color={COLORS.primary}/>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentsSortDropdownButton} activeOpacity={0.5} onPress={sortCommentsNewFirst}>
          <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {lang == 'ru' ? 'Новые' : 'New'}
          </Text>
          {commentsSortType === 'desc' && <Feather name='check' size={20} color={COLORS.primary}/>}
        </TouchableOpacity>
      </Animated.View>
    )
  } else if (dropdownType === 'relation') {
    return (
      <Animated.View 
        style={[
          {
            borderRadius: 5,
            elevation: 5, 
            position: 'absolute', 
            zIndex: 5, 
            width: width - 50,
          },
          { 
            height: listHeight,   
          },
          isLightTheme ? 
          {backgroundColor: COLORS.white} :
          {backgroundColor: COLORS.very_dark_gray},
          {transform: [{translateX: dropdownData.dropdownX}, {translateY: dropdownData.dropdownY}]}
        ]}>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]}
            activeOpacity={0.5}
            onPress={() => onRelationshipOption('1')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Не замужем / Не женат' : 'Not Married'}
            </Text>
            {
              data.curStatus === '1' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('2')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Есть друг / подруга' : 'Have a friend'}
            </Text>
            {
              data.curStatus === '2' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('3')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Помолвлен / помолвлена' : 'Engaged'}
            </Text>
            {
              data.curStatus === '3' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('4')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Женат / замужем' : 'Married'}
            </Text>
            {
              data.curStatus === '4' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('5')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Всё` сложно' : "It's complicated"}
            </Text>
            {
              data.curStatus === '5' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('6')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'В активном поиске' : 'Actively search'}
            </Text>
            {
              data.curStatus === '6' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('7')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Влюблен/влюблена' : 'In Love'}
            </Text>
            {
              data.curStatus === '7' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('8')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'В гражданском браке' : 'Live together'}
            </Text>
            {
              data.curStatus === '8' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerDropdownOptionContainer,  
              isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.smoke},
              {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}
            ]} 
            activeOpacity={0.8}
            onPress={() => onRelationshipOption('0')}
          >
            <Text style={[styles.headerDropdownOption, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
              {lang == 'ru' ? 'Не указано' : 'Unset'}
            </Text>
            {
              data.curStatus === '0' ?
              <Feather name='check' size={20} color={COLORS.primary}/> : null
            }
          </TouchableOpacity>
      </Animated.View>
    )
  }
  return null
}

export default Dropdown

const styles = StyleSheet.create({
  postDropdownMenu: {
    borderRadius: 5,
    elevation: 5, 
    position: 'absolute', 
    zIndex: 5, 
    width: 170,
  },
  commentsSortDropdown: {
    borderRadius: 5,
    elevation: 5, 
    position: 'absolute', 
    zIndex: 5, 
    width: 110,
  },
  postDropdownMenuButton: {
    position: 'relative', 
    zIndex: 5, 
    flex: 1, 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    paddingLeft: 5  
  },
  commentsSortDropdownButton: {
    position: 'relative', 
    zIndex: 5, 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
  },
  headerDropdown: {
    zIndex: 5,
    position: 'absolute',
    elevation: 15,
    width: 200,
    borderRadius: 5,
  },
  headerDropdownOptionContainer: {
    width: '100%',
    // height: '50%',
    flex: 1,
    zIndex: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 5
  },
  headerDropdownOption: {
    fontSize: 18,
  },
})