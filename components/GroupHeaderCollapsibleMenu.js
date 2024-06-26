import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { collapseShadow, expandShadow } from '../redux/globalShadowSlice'
import { COLORS } from '../constants/theme'

const GroupHeaderCollapsibleMenu = ({ accessToken, isLightTheme, data }) => {
  const dispatch = useDispatch()
  const dropdownCoords = React.useRef()

  const openDropdownMenu = () => {
    dropdownCoords.current.measure(
      (x, y, width, height, pageX, pageY) => {
        dispatch(expandShadow({dropdownX: pageX, dropdownY: pageY, data: data, dropdownType: 'group'}))
      }
    )
  }

  const closeDropdownMenu = () => {
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={openDropdownMenu}>
        <View ref={dropdownCoords} collapsable={false}>
          <Feather name='more-vertical' size={20} color={COLORS.white}/>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default GroupHeaderCollapsibleMenu

const styles = StyleSheet.create({
  container: {
    zIndex: 4,
    position: 'absolute',
    top: -10,
    right: 0
  },
})