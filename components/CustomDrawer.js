import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'
import { useSelector, useDispatch } from 'react-redux'
import {COLORS} from '../constants/theme'
import DrawerSwitchersContainer from './DrawerSwitchersContainer'
import { setPlayStatus } from '../redux/audioSlice'

const CustomDrawer = (props) => {
  const dispatch = useDispatch()
  const userData = useSelector(state => state.user)
  const track = useSelector(state => state.audio)
  
  // const urlDrawerPhoto = userData.userProfileDrawerPhotoUrl
  // const firstName = userData.firstName
  // const lastName = userData.lastName
  const { navigation } = props

  const togglePlayStatus = () => {
    if (track.isPlaying) {
      dispatch(setPlayStatus(false))
    } else {
      dispatch(setPlayStatus(true))
    }
  }

  const goToUserProfilePage = () => {
    navigation.navigate('CurrentUser', {userId: userData.userId})
  }

  const navToPlayer = () => {
    navigation.navigate('AudioPlayer')
  }


  return (
    <View style={{flex: 1, backgroundColor: COLORS.very_dark_gray}}>
      <DrawerContentScrollView showsVerticalScrollIndicator={false}>
        {/* <TouchableOpacity style={styles.profileDrawerContainer} activeOpacity={0.8} onPress={goToUserProfilePage}>
          <Image source={{uri: urlDrawerPhoto}} style={styles.profileImageStyle}/>
          <View>
            <Text style={styles.profileName}>{firstName} {lastName}</Text>
          </View>
        </TouchableOpacity> */}
        <DrawerItemList {...props}/>
        <DrawerSwitchersContainer />
        {
          track.info ?
          <View style={{width: '100%', height: 65}} /> :
          null 
        }
      </DrawerContentScrollView>
      {
        track.info ?
        <TouchableOpacity 
          onPress={navToPlayer}
          style={styles.playerContainer}
          activeOpacity={1}
        >
          <TouchableOpacity onPress={togglePlayStatus}>
            {
              track.isPlaying ?
              <Ionicons name='pause' color={COLORS.white} size={30}/> :
              <Entypo name='triangle-right' color={COLORS.white} size={30}/>
            }
          </TouchableOpacity>
          <View style={{width: '80%'}}>
            <Text numberOfLines={1} style={styles.artist}>{track.info.artist}</Text>
            <Text numberOfLines={1} style={styles.song}>{track.info.title}</Text>
          </View>
        </TouchableOpacity> :
        null 
      }  
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
    profileDrawerContainer: {
        width: '89%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        // backgroundColor: COLORS.light_smoke,
        justifyContent: 'flex-start'
    },
    profileImageStyle: {
        width: 80, 
        height: 80, 
        borderRadius: 5
    },
    profileName: {
        marginLeft: 15,
        color: COLORS.white
    },
    drawerContainer: {
        backgroundColor: COLORS.very_dark_gray,
    },
    playerContainer: {
      flexDirection: 'row', 
      backgroundColor: COLORS.light_black, 
      width: '100%', 
      height: 65, 
      position: 'absolute', 
      bottom: 0, 
      zIndex: 3, 
      alignItems: 'center', 
      paddingLeft: 10, 
      paddingRight: 10,
      gap: 10
    },
    artist: {
      fontSize: 15,
      fontWeight: 'bold',
      color: COLORS.light_smoke
    },
    song: {
      fontSize: 15,
      color: COLORS.light_smoke
    }
})