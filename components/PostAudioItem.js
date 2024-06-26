import { StyleSheet, Text, View, TouchableOpacity , Dimensions, LayoutAnimation, ToastAndroid, Permission } from 'react-native'
import React from 'react'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { useSelector, useDispatch, createSelectorHook, } from 'react-redux'
import { store } from '../redux/store'
// import notifee from "@notifee/react-native"
// import * as Notifications from 'expo-notifications'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { updateTrack, setPlayStatus } from '../redux/audioSlice'
import { COLORS } from '../constants/theme'
import { getDuration } from '../utils/numShortage'
// import { updateProgress } from '../redux/audioProgressSlice'

const width = Dimensions.get('window').width
const PostAudioItem = ({isLightTheme, item, audios, index}) => {
  const dispatch = useDispatch()
  const trackInfo = useSelector(state => state.audio.info)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [played, setPlayed] = React.useState(0)
  const artist = item.audio.artist
  const title = item.audio.title
  const audioProgressUnsub = React.useRef(null)
  const audioPlayUnsub = React.useRef(null)

  if (audioPlayUnsub.current && trackInfo && (trackInfo.id !== item.audio.id || trackInfo.owner_id !== item.audio.owner_id)) {
    const unsub1 = audioPlayUnsub.current
    const unsub2 = audioProgressUnsub.current
    unsub1()
    unsub2()
    audioProgressUnsub.current = null
    audioPlayUnsub.current = null
  }
  
  const togglePlayStatus = () => {
    setIsPlaying(store.getState().audio.isPlaying)
  }

  const updatePlayState = () => {
    setPlayed(store.getState().audioProgress.played)
  } 

  if (trackInfo && trackInfo.id === item.audio.id && trackInfo.owner_id === item.audio.owner_id && audioProgressUnsub.current == null) {
    audioProgressUnsub.current = store.subscribe(updatePlayState)
    audioPlayUnsub.current = store.subscribe(togglePlayStatus)
  }

  const onPressTrack = async () => {
    if (isPlaying) {
      if (trackInfo && trackInfo.id === item.audio.id && trackInfo.owner_id === item.audio.owner_id) {
        dispatch(setPlayStatus(false))
      } else {
        audioProgressUnsub.current = store.subscribe(updatePlayState)
        audioPlayUnsub.current = store.subscribe(togglePlayStatus)
        const sound = new Audio.Sound()
        dispatch(updateTrack({sound: sound, info: item.audio, index: index, audios: audios}))
      }
    } else {
      if (trackInfo && trackInfo.id === item.audio.id && trackInfo.owner_id === item.audio.owner_id) {
        dispatch(setPlayStatus(true))
      } else {
        console.log(item.audio.main_artists)
        audioProgressUnsub.current = store.subscribe(updatePlayState)
        audioPlayUnsub.current = store.subscribe(togglePlayStatus)
        const sound = new Audio.Sound()
        dispatch(updateTrack({sound: sound, info: item.audio, index: index, audios: audios}))
      }
    }
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[{flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5, marginBottom: 5}]}
      onPress={onPressTrack}
    >
      <View style={{width: 40, height: 40, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'}}>
        {
          trackInfo && trackInfo.id === item.audio.id && trackInfo.owner_id === item.audio.owner_id && isPlaying ?
          <Ionicons name='pause' color={COLORS.white} size={30}/> :
          <Entypo name='triangle-right' color={COLORS.white} size={30}/>
        }
      </View>
      <View style={{width: width - 150}}>
        <Text numberOfLines={1} style={{fontSize: 15, color: COLORS.primary_light, fontWeight: 'bold'}}>{artist}</Text>
        <Text numberOfLines={1} style={[{fontSize: 15}, isLightTheme ? {color: COLORS.secondary} : {color: COLORS.primary_text}]}>{title}</Text>
      </View>            
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
        <Text style={[{fontSize: 13}, isLightTheme ? {color: COLORS.secondary} : {color: COLORS.primary_text}]}>
          {
            trackInfo && trackInfo.id === item.audio.id && trackInfo.owner_id === item.audio.owner_id?
            getDuration(Math.floor(played/1000)) :
            getDuration(item.audio.duration)
          }
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default PostAudioItem

const styles = StyleSheet.create({})