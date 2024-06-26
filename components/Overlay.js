import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLORS } from '../constants/theme'

const Overlay = ({slideAnimation, handleShadowTouch, isLightTheme, headerText, actionButtonText, overlayContentComponent, handleActionButtonPress}) => {
  
  const onShadowPress = () => {
    handleShadowTouch()
  }

  const onActionButtonPress = () => {
    handleShadowTouch()
    handleActionButtonPress()
  }

  return (
    <Animated.View style={[styles.box, {transform: [{translateY: slideAnimation}]}]} >
      <TouchableOpacity style={styles.shadow} onPress={onShadowPress} activeOpacity={0}>
      </TouchableOpacity>
      <View style={[styles.menuContainer, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.very_dark_gray}]}>
        <View style={styles.crossContainer}>
          <Text style={[styles.headerText, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>
            {headerText}
          </Text>
          <TouchableOpacity onPress={onShadowPress}>
            <AntDesign name='close' color={isLightTheme ? COLORS.primary : COLORS.white} size={27}/>
          </TouchableOpacity>
        </View>
        {overlayContentComponent}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity activeOpacity={0.8} style={[styles.actionButton]} onPress={onActionButtonPress}>
            <Text style={styles.actionButtonText}>{actionButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

export default Overlay

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: '100%',
    zIndex: 0,
    position: 'absolute',
  },
  shadow: {
    backgroundColor: COLORS.black,
    opacity: 0,
    width: '100%',
    height: '30%',
  },
  menuContainer: {
    width: '100%',
    height: '70%',
    elevation: 30,
    shadowColor: COLORS.black,
    borderRadius: 5,
    padding: 15
  },
  crossContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  crossButton: {
    margin: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    zIndex: -1,
  },
  actionButton: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold'
  }
})