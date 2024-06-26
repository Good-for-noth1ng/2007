import { StyleSheet, Text, View, Animated, TouchableOpacity, ToastAndroid } from 'react-native'
import React from 'react'
import * as Clipboard from 'expo-clipboard'
import { useSelector, useDispatch } from 'react-redux'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'
import { COLORS } from '../constants/theme'

const PostDropdownMenu = () => {
  const dispatch = useDispatch()
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const dropdownData = useSelector(state => state.globalShadow)
  const isShadowExpanded = dropdownData.isOpen
  const data = dropdownData.data
  const shouldPerformAnimation = React.useRef(false)
  const listHeight = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (shouldPerformAnimation.current) {
      if (isShadowExpanded) {
        Animated.timing(listHeight, {
          toValue: 160,
          duration: 200,
          useNativeDriver: false,
        }).start()
      } else {
        Animated.timing(listHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start()
      }
    } else {
      shouldPerformAnimation.current = true
    }
  }, [isShadowExpanded])

  const addPostToFave = async () => {
    const url = `https://api.vk.com/method/fave.addPost?access_token=${accessToken}&v=5.131&owner_id=${data.owner_id ? data.owner_id : data.source_id}&id=${data.id ? data.id : data.post_id}${data.access_key ? `&access_key=${data.access_key}` : ''}`
    const response = await fetch(url)
    const parsedRes = await response.json()
    if (parsedRes.response === 1) {
      ToastAndroid.show('Added to Favorite!', ToastAndroid.SHORT)
    } else {
      ToastAndroid.show('Network Error', ToastAndroid.SHORT)
    }
    dispatch(collapseShadow())
  }

  const copyPostLink = async () => {
    await Clipboard.setStringAsync(`https://vk.com/wall${data.owner_id ? data.owner_id : data.source_id}_${data.id ? data.id : data.post_id}`)
    ToastAndroid.show('Copied!', ToastAndroid.SHORT)
    dispatch(collapseShadow())
  }

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
      <TouchableOpacity style={styles.postDropdownMenuButton} onPress={addPostToFave}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Add to Bookmarks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Not interested</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton} onPress={copyPostLink}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Copy Link</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Report</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default PostDropdownMenu

const styles = StyleSheet.create({
  postDropdownMenu: {
    borderRadius: 5,
    elevation: 5, 
    position: 'absolute', 
    zIndex: 5, 
    width: 170,
  },
  postDropdownMenuButton: {
    position: 'relative', 
    zIndex: 5, 
    flex: 1, 
    elevation: 2000,
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    paddingLeft: 5  
  }
})