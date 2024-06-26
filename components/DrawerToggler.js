import { StyleSheet, Switch, View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS } from '../constants/theme'
import { useSelector } from 'react-redux'

const DrawerToggler = ({ trueIcon, falseIcon, trueText, falseText, currentState, setNewState}) => {
  const accessToken = useSelector(state => state.user.accessToken)
  const setOfflineUrl = `https://api.vk.com/method/account.setOffline?access_token=${accessToken}&v=5.131`
  const toggleSwitch = () => {
    setNewState()
  }
  return (
    <View style={styles.switchContainer}>
      {
        currentState ?
        <View style={styles.textIconContainer}> 
          {trueIcon}
          <Text style={styles.text}>{trueText}</Text>
        </View> : 
        <View style={styles.textIconContainer}>
          {falseIcon}
          <Text style={styles.text}>{falseText}</Text>
        </View>
      }
      <Switch
        style={styles.switch}
        value={currentState}
        onValueChange={toggleSwitch}
        trackColor={{false: COLORS.black, true: COLORS.smoke}}
        thumbColor={COLORS.light_smoke}
      />
    </View>
  )
}

export default DrawerToggler

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 19,
    // backgroundColor: COLORS.light_smoke,
    height: 50
  },
  textIconContainer: {
    flexDirection: 'row',
    width: '75%',
    alignItems: 'center'
  },
  text: {
    color: COLORS.white,
    fontSize: 15,
    marginLeft: 25,
  },
  switch: {
    borderColor: COLORS.white,
  }
})