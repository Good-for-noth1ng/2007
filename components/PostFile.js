import { StyleSheet, Text, View, TouchableOpacity, Platform, ToastAndroid } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux'
import * as FileSystem from 'expo-file-system'
import { push } from '../redux/downloadSlice'
import Svg, {Circle,} from 'react-native-svg'
import { shareAsync } from 'expo-sharing'
import { COLORS } from '../constants/theme'
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated'
import uuid from 'react-native-uuid';
import { collapseShadow } from '../redux/globalShadowSlice'
import { LinearGradient } from 'expo-linear-gradient'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const PostFile = ({ isLightTheme, postDoc, name, quantity, size}) => {
  const dispatch = useDispatch()
  const prevProgress = React.useRef(-1)
  const progress = useSharedValue(0)
  const radius = 55
  const strokeWidth = 1.2
  const halfCircle = radius * strokeWidth
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 2 * Math.PI * radius * (1 - progress.value)
  }))

  const animate = (val) => {
    progress.value = withTiming(val, {duration: 10})
  }

  const onGettingChunk = async (chunk) => {
    const totalSize = chunk.totalBytesExpectedToWrite
    const curSize = chunk.totalBytesWritten
    const progress = Math.trunc(curSize / totalSize * 10)
    if (progress != prevProgress.current) {
      prevProgress.current = progress
      animate(progress * 0.1)
    }
    
  }

  const startDownload = () => {
    dispatch(push({url: postDoc.url, onGettingChunk: onGettingChunk, name: postDoc.title, ext: ''}))
    // if (isLoading.current == false) {
    //   isLoading.current = true
    // }
    // progress.value = withTiming(1, {duration: 1000})
  }

  return (
    <TouchableOpacity 
      style={[styles.fileContainer]} 
      activeOpacity={0.8} 
      onPress={startDownload}
    >
      {/* <View style={styles.fileIconContainer}>
        <FontAwesome name='file' size={22} color={COLORS.secondary} />
      </View> */}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <View style={{transform: [{rotate: '-90deg'}]}}>
        <Svg width={radius} height={radius} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`} >
          <AnimatedCircle 
            cx={'50%'}
            cy={'50%'}
            stroke={isLightTheme ? COLORS.primary : COLORS.white}
            strokeWidth={10}
            r={radius}
            strokeOpacity={1}
            fill={'transparent'}
            strokeDasharray={2 * Math.PI * radius}
            strokeLinecap={'round'}
            // strokeDashoffset={2 * Math.PI * radius * 0.5}
          
            animatedProps={animatedProps}
          />
        </Svg>
      </View>
      <View style={styles.fileIconContainer}>
        <FontAwesome name='file' size={22} color={COLORS.secondary} />
      </View>
      </View>
      <View style={styles.fileInfoContainer}>
        <Text numberOfLines={1} style={[styles.name, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{name}</Text>
        <Text numberOfLines={1} style={[styles.additionalInfo, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{postDoc.ext} {size} {quantity}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default PostFile

const styles = StyleSheet.create({
  fileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  fileInfoContainer: {
    display: 'flex',
    width: '80%',
    flexDirection: 'column',
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
  },
  additionalInfo: {
    fontSize: 13,
  },
  fileIconContainer: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_smoke,
    borderRadius: 45,
    position: 'absolute'
  }
})