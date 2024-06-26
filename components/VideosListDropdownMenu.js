import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'
import { COLORS } from '../constants/theme'

const VideosListDropdownMenu = () => {
  const dispatch = useDispatch()
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)
  const dropdownData = useSelector(state => state.globalShadow)
  const isShadowExpanded = dropdownData.isOpen
  const shouldPerformAnimation = React.useRef(false)
  const listHeight = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (shouldPerformAnimation.current) {
      if (isShadowExpanded) {
        Animated.timing(listHeight, {
          toValue: 160,
          duration: 250,
          useNativeDriver: false,
        }).start()
      } else {
        Animated.timing(listHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start()
      }
    } else {
      shouldPerformAnimation.current = true
    }
  }, [isShadowExpanded])

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
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Add to Bookmarks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Add to my videos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Add to playlist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Copy Link</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Not interesting</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postDropdownMenuButton}>
        <Text style={[{fontSize: 17}, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>Report</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default VideosListDropdownMenu

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