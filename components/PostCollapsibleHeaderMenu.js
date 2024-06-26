import { StyleSheet, Text, View, Animated, TouchableOpacity, Easing } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { collapseShadow, expandShadow } from '../redux/globalShadowSlice'
import { COLORS } from '../constants/theme'

//TODO: add different sets of buttons
const PostCollapsibleHeaderMenu = ({ isLightTheme, accessToken}) => {
    const dispatch = useDispatch()  
    const dropdownCoords = React.useRef()

    const openDropdownMenu = () => {
      dropdownCoords.current.measure(
        (x, y, width, height, pageX, pageY) => {
          dispatch(expandShadow({dropdownX: pageX, dropdownY: pageY, data: null, dropdownType: 'openPost'}))
        }
      )
    }

    // const closeDropdownMenu = () => {
    //   setIsShadowExpanded(false)
    // }

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

export default PostCollapsibleHeaderMenu

const styles = StyleSheet.create({
  container: {
    zIndex: 4,
    position: 'absolute',
    top: -10,
    right: 0
  },
  dropdown: { 
    zIndex: 5,
    position: 'absolute',
    elevation: 15,
    width: 200,
    borderRadius: 5,
    right: 0
  },
  optionContainer: {
    width: '100%',
    // height: '50%',
    flex: 1,
    zIndex: 5,
    justifyContent: 'center',
    backgroundColor: COLORS.light_smoke,
    paddingLeft: 10,
    borderRadius: 5
  },
  option: {
    fontSize: 18,
  },
})