import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import Entypo from 'react-native-vector-icons/Entypo'
import PostAudioItem from './PostAudioItem';
import { COLORS } from '../constants/theme'
import { getDuration } from '../utils/numShortage'

const PostAudio = ({postAudios, isLightTheme}) => {
  return (  
    <View>
      {
        postAudios.map((item, index) => {
            const key = uuid.v4()
            return (
              <PostAudioItem index={index} audios={postAudios} key={key} item={item} isLightTheme={isLightTheme}/>
            )
        })
      }
    </View>
  )
}

export default PostAudio

const styles = StyleSheet.create({})