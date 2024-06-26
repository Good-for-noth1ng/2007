import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { collapseShadow, expandShadow } from '../redux/globalShadowSlice';
import { COLORS } from '../constants/theme'

const globalShadowHeight = Dimensions.get('window').height
const globalShadowWidth = Dimensions.get('window').width

const GlobalShadow = () => {
  const dispatch = useDispatch()
  const isShadowExpanded = useSelector(state => state.globalShadow.isOpen)

  const closeGlobalShadow = () => {
    dispatch(collapseShadow())
  }
  return (
    <>
      {
        isShadowExpanded ?
        <TouchableOpacity 
          activeOpacity={1}
          onPress={closeGlobalShadow}
          style={{width: globalShadowWidth, height: globalShadowHeight, zIndex: 4, position: 'absolute'}}
        />
        : null
      }
    </>
  )
}

export default GlobalShadow

const styles = StyleSheet.create({})