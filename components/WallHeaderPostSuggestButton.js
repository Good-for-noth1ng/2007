import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Octicons from 'react-native-vector-icons/Octicons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../constants/theme'

const MakePostButton = ({text, action}) => {
  return (
    <TouchableOpacity style={styles.suggestButton}>
      <LinearGradient style={styles.buttonGradient} colors={[COLORS.gradientHeaderStart, COLORS.gradientHeaderEnd]}>
        <Text style={styles.suggestButtonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const AttachPhotosButton = () => {
  return (
    <TouchableOpacity style={styles.addPhotoButton}>
      <LinearGradient style={styles.addPhotoGradient} colors={[COLORS.gradientHeaderStart, COLORS.gradientHeaderEnd]}>
        <Octicons color={COLORS.white} size={24} name={'device-camera'}/>
      </LinearGradient>
    </TouchableOpacity>
  )
}
const WallHeaderPostSuggestButton = ({canPost, canSuggest, isCommunityWall, lang}) => {
  if (isCommunityWall) {
    if (canPost) {
      return(
      <View style={styles.buttonsContainer}>
        <MakePostButton 
          text={lang == 'ru' ? 'Создать запись' : 'Write a post'}
        />
        <AttachPhotosButton />
      </View>
      )
    } else if (canSuggest) {
      return(
        <View style={styles.buttonsContainer}>
          <MakePostButton 
            text={lang == 'ru' ? 'Предложить запись' : 'Suggest a post'}
          />
          <AttachPhotosButton />
        </View>
        )
    } else {
      return null
    }
  } else {
    if (canPost) {
      return (
      <View style={styles.buttonsContainer}>
        <MakePostButton 
          text={lang == 'ru' ? 'Создать запись' : 'Write a post'}
        />
        <AttachPhotosButton />
      </View>
      )
    }
  }
  return null
}

export default WallHeaderPostSuggestButton

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestButton: {
    // backgroundColor: COLORS.primary,
    borderRadius: 5,
    width: '75%',
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  suggestButtonText: {
    fontSize: 17,
    color: COLORS.white
  },
  addPhotoButton: {
    // backgroundColor: COLORS.primary,
    borderRadius: 5,
    width: '22%',
    flexDirection: 'row',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addPhotoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})