import { StyleSheet, Text, View, BackHandler, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native'
import React from 'react'
import { Audio } from 'expo-av';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/Octicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { COLORS } from '../constants/theme'
import { setPlayStatus, updateTrack } from '../redux/audioSlice';
import { getDuration } from '../utils/numShortage';
import { updateProgress } from '../redux/audioProgressSlice'

const AudioPlayer = ({ navigation }) => {
  const dispatch = useDispatch()
  const track = useSelector(state => state.audio)
  const progress = useSelector(state => state.audioProgress.played)

  const togglePlayStatus = () => {
    if (track.isPlaying) {
      dispatch(setPlayStatus(false))
    } else {
      dispatch(setPlayStatus(true))
    }
  }

  React.useEffect(() => {
    const onPlayStatusChange = async () => {
      if (track.sound) {
        if (track.isPlaying) {
          await track.sound.playAsync()
        } else {
          await track.sound.pauseAsync()
        }
      }
    }
    onPlayStatusChange()
  }, [track.isPlaying])

  //[Error: yb.a0$f: Response code: 404]
  React.useEffect(() => {
    const handler = async () => {
      if (track.info) {
        if (track.prev) {
          try {
            await track.prev.pauseAsync()
            await track.prev.unloadAsync()
          } catch (e) {
            console.log('unavailable')            
          // await track.sound.loadAsync({uri: track.info.url})
          }
        }
        try {
          await track.sound.loadAsync({uri: track.info.url})
          track.sound.setOnPlaybackStatusUpdate(onPlaybackUpdate)
          await track.sound.playAsync()
          dispatch(setPlayStatus(true))
        } catch (error) {
          if (error.message === 'yb.a0$f: Response code: 404') {
            ToastAndroid.show(`${artist} - ${title} is not available`, ToastAndroid.SHORT)
            await track.sound.unloadAsync()
            if (track.index + 1 < track.audios.length) {
              const sound = new Audio.Sound()
              dispatch(updateTrack({sound: sound, info: track.audios[index+1].audio}))
            } else {
              dispatch(updateTrack({sound: null, info: null, index: track.index}))
            }
          // setIsAvailable(false)
          }
        }
      }
    }
    handler()
  }, [track.info])
  
  const onPlaybackUpdate = async (status) => {
    dispatch(updateProgress(status.positionMillis))
    if (status.didJustFinish) {
      if (track.index + 1 < track.audios.length) {
        const sound = new Audio.Sound()
        dispatch(updateTrack({sound: sound, info: track.audios[track.index+1].audio, index: track.index+1}))
      } else {
        await track.sound.pauseAsync()
        dispatch(updateTrack({sound: null, info: null, index: track.index}))
      }
    }
  }
  
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.openDrawer()
        return true
      }
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => subscription.remove()
    }, [])
  )

  const rewindTape = async (val) => {
    await track.sound.setPositionAsync(val)
  }

  const setPlayedTime = (val) => {
    dispatch(updateProgress(val))
  }

  const playNext = async () => {
    const sound = new Audio.Sound()
    dispatch(updateTrack({sound: sound, info: track.audios[track.index+1].audio, index: track.index+1}))
  }

  const playPrev = async () => {
    const sound = new Audio.Sound()
    dispatch(updateTrack({sound: sound, info: track.audios[track.index-1].audio, index: track.index-1}))
  }

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', backgroundColor: COLORS.white, padding: 10}}>
      <View style={{height: '55%', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.light_smoke, width: '90%', borderRadius: 5}}>
        <Fontisto name='music-note' color={COLORS.secondary} size={50}/>
      </View>
      <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        <Slider 
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={track.info ? track.info.duration * 1000 : 1}
          minimumTrackTintColor={COLORS.primary_blue_dark}
          maximumTrackTintColor={COLORS.smoke}
          thumbTintColor={COLORS.primary}
          value={progress}
          onValueChange={setPlayedTime}
          onSlidingComplete={rewindTape}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
          <Text style={{fontSize: 12, color: COLORS.secondary}}>{getDuration(Math.floor(progress / 1000))}</Text>
          <Text style={{fontSize: 12, color: COLORS.secondary}}>{track.info && getDuration(track?.info?.duration)}</Text>
        </View>
      </View>
      
      <View style={{gap: 10, alignItems: 'center', width: '100%'}}>
        <Text numberOfLines={1} style={{fontSize: 15, fontWeight: 'bold'}}>{track?.info?.artist}</Text>
        <Text numberOfLines={1} style={{fontSize: 15}}>{track?.info?.title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-around', height: 60,}}>
          {/* <Octicons name='download' size={35} color={COLORS.black}/> */}
          <TouchableOpacity 
            style={[track.index === 0 && {opacity: 0.5}, {justifyContent: 'center', alignItems: 'center'}]}
            activeOpacity={track.index === 0 ? 0.5 : 0.8}
            onPress={track.index === 0 ? () => {} : playPrev}
          >
            <AntDesign name='banckward' size={35} color={COLORS.black}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayStatus} style={{justifyContent: 'center', alignItems: 'center'}}>
            {
              track.isPlaying ?
              <Ionicons name='pause' color={COLORS.black} size={45}/> :
              <Entypo name='controller-play' color={COLORS.black} size={45}/>
            }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[track.index === track.audios.length - 1 && {opacity: 0.5}, {justifyContent: 'center', alignItems: 'center'}]}
            activeOpacity={track.index === track.audios.length - 1 ? 0.5 : 0.8}
            onPress={track.index === track.audios.length - 1 ? () => {} : playNext}
          >
            <AntDesign name='forward' size={35} color={COLORS.black}/>
          </TouchableOpacity>
          {/* <Feather name='more-vertical' size={35} color={COLORS.black}/> */}
        </View>
      </View>
      
    </SafeAreaView>
  )
}

export default AudioPlayer

const styles = StyleSheet.create({})