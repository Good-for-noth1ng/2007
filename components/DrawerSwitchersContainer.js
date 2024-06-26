import { StyleSheet,  Appearance } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector, useDispatch } from 'react-redux'
import * as Localization from 'expo-localization'
import { toggleCurrentColorScheme } from '../redux/colorSchemeSlice'
import { toggleOnlineStatus, setOnlineStatus } from '../redux/userSlice'
import DrawerToggler from './DrawerToggler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import { CustomDrawerButton } from './Buttons'
import { COLORS } from '../constants/theme'

const DrawerSwitchersContainer = () => {
  const dispatch = useDispatch()
  const isOnline = useSelector(state => state.user.isOnline)
  const lang = Localization.getLocales()[0].languageCode
  // console.log(isOnline)
  // const [isOnline, setIsOnline] = React.useState(false)
  const isInitRender = React.useRef(true)
  const [allowMarkAsRead, setAllowMarkAsRead] = React.useState(false)
  const [allowSeeTyping, setAllowSeeTyping] = React.useState(false)
  const onlineStatusIntervalId = React.useRef()
  const accessToken = useSelector(state => state.user.accessToken)
  const isLightTheme = useSelector(state => state.colorScheme.isCurrentSchemeLight)

  const getOnlineStatus = async () => {
    ///TODO:
    ///call api for status setting
    ///
    try {
      const onlineStatusStorage = await AsyncStorage.getItem("isCurrentUserOnline");
      const onlineStatus = JSON.parse(onlineStatusStorage)
      if (onlineStatus !== null) {
        dispatch(setOnlineStatus(onlineStatus))
      } else {
        dispatch(setOnlineStatus(false))
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (isInitRender.current) {
    getOnlineStatus()
    isInitRender.current = false
  }

  const changeOnlineStatus = async (url, currentStatus) => {
    const res = await fetch(url)
    const data = await res.json()
    // console.log(data)
    await AsyncStorage.setItem("isCurrentUserOnline", JSON.stringify(!currentStatus))
  }

  const onOnlineStatusPress = () => {
    dispatch(toggleOnlineStatus())
    if (isOnline === false) {
      changeOnlineStatus(`https://api.vk.com/method/account.setOnline?access_token=${accessToken}&v=5.131`, false)
      onlineStatusIntervalId.current = setInterval(() => {
        changeOnlineStatus(`https://api.vk.com/method/account.setOnline?access_token=${accessToken}&v=5.131`, false)
      }, 300000)
    } else {
      clearInterval(onlineStatusIntervalId.current)
      changeOnlineStatus(`https://api.vk.com/method/account.setOffline?access_token=${accessToken}&v=5.131`, true)
    }
  }

  const changeReadStatus = () => {
    setAllowMarkAsRead(prevState => !prevState)
  }
  const changeTypingStatus = () => {
    setAllowSeeTyping(prevState => !prevState)
  }
  const changeTheme = () => {
    dispatch(toggleCurrentColorScheme())
    // if (Appearance.getColorScheme() === 'light') {
    //   Appearance.setColorScheme('dark')
    // } else {
    //   Appearance.setColorScheme('light')
    // }
    
  }
  
  return (
    <>
      <DrawerToggler
        trueIcon={
          <MaterialCommunityIcons name='ghost-off-outline' size={20} color={COLORS.white}/>
        } 
        falseIcon={
          <MaterialCommunityIcons name='ghost-outline' size={20} color={COLORS.white}/>
        }
        currentState={isOnline}
        setNewState={onOnlineStatusPress}
        falseText={lang == 'ru' ? 'Не в сети' : 'Offline'}
        trueText={lang == 'ru' ? 'В сети' : 'Online'}
      />
      <DrawerToggler
        trueIcon={
          <SimpleLineIcons name='envelope-open' size={20} color={COLORS.white}/>
        }
        falseIcon={
          <SimpleLineIcons name='envelope' size={20} color={COLORS.white}/>
        }
        trueText={lang == 'ru' ? 'Помечать как прочитанные' : 'Mark as read'}
        falseText={lang == 'ru' ? 'Оставлять непрочитанными' : 'Mark as unread'}
        currentState={allowMarkAsRead}
        setNewState={changeReadStatus}
      />
      <DrawerToggler 
        trueIcon={
          <MaterialCommunityIcons name='pencil-outline' size={20} color={COLORS.white}/>
        }
        falseIcon={
          <MaterialCommunityIcons name='pencil-off-outline' size={20} color={COLORS.white}/>
        }
        trueText={lang == 'ru' ? 'Показывать набор' : 'Show typing'}
        falseText={lang =='ru' ? 'Скрыть набор' : 'Hide typing'}
        currentState={allowSeeTyping}
        setNewState={changeTypingStatus}
      />
      <DrawerToggler 
        trueIcon={
          <Octicons name='moon' size={20} color={COLORS.white}/>
        }
        falseIcon={
          <Octicons name='sun' size={20} color={COLORS.white}/>
        }
        trueText={lang == 'ru' ? 'Темный режим' : 'Dark mode'}
        falseText={lang == 'ru' ? 'Светлый режим' : 'Light mode'}
        currentState={!isLightTheme}
        setNewState={changeTheme}
      />
      <CustomDrawerButton 
        buttonIcon={<MaterialCommunityIcons name='door-open' color={COLORS.white} size={20}/>}
        buttonText={lang == 'ru' ? 'Выйти' : 'Logout'}
      />
    </>
  )
}

export default DrawerSwitchersContainer

const styles = StyleSheet.create({})