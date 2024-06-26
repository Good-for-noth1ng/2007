import { StyleSheet, Text, View, Image, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { COLORS } from '../constants/theme'
import { getTimeDate } from '../utils/date'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const WallHeaderGeneralInfo = ({ lang, name, avatarUrl, lastSeen, status, isOnlineUsingMobile, isOnlineUsingPC, chevronPressHandler, expanded, shouldPerformExpanding, setIsAvatarVisible, canAccess }) => {
  // const isPersonalInfoOpen = React.useRef(false)
  
  let onlineStatus
  if (lastSeen !== undefined && !isOnlineUsingMobile && !isOnlineUsingPC) {
    if (lastSeen.platform < 6) {
      onlineStatus = (
        <View style={styles.onlineStatusContainer}>
          <Ionicons name='phone-portrait-sharp' color={COLORS.secondary} size={14}/>
          <Text style={styles.onlineStatusText}> {getTimeDate(lastSeen.time, lang)}</Text>
        </View>
      )
    } else {
      onlineStatus = (
        <View style={styles.onlineStatusContainer}>
          <MaterialIcons name='computer' color={COLORS.secondary} size={14}/>
          <Text style={styles.onlineStatusText}> {getTimeDate(lastSeen.time, lang)}</Text>
        </View>
      )
    }
  } else if (lastSeen !== undefined) {
    if (isOnlineUsingMobile) {
      onlineStatus = (
        <View style={styles.onlineStatusContainer}>
          <Ionicons name='phone-portrait-sharp' color={COLORS.secondary} size={14}/>
          <Text style={styles.onlineStatusText}> {lang == 'ru' ? ' В сети' : ' online'}</Text>
        </View>
      )
    } else {
      onlineStatus = (
        <View style={styles.onlineStatusContainer}>
          <MaterialIcons name='computer' color={COLORS.secondary} size={14}/>
          <Text style={styles.onlineStatusText}>{lang == 'ru' ? ' В сети' : ' online'}</Text>
        </View>
      )
    }   
  } else {
    onlineStatus = null
  }
  const onChevronPress = () => {
    if (shouldPerformExpanding) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      chevronPressHandler(prevState => !prevState)
    }
    
  }
  
  const openAvatar = () => {
    if(canAccess) {
      setIsAvatarVisible(prev => !prev)
    }
  }

  return (
    <View style={styles.imageNameContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={openAvatar}>
        <Image source={{uri: avatarUrl}} style={styles.image}/>
      </TouchableOpacity>
      <View style={styles.additionalInfoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.wallName}>{name}</Text>
        </View>
        {onlineStatus}
        <TouchableOpacity style={styles.chevron} activeOpacity={1} onPress={onChevronPress}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
          {
            shouldPerformExpanding ?
            <Entypo name={expanded ? 'chevron-up' : 'chevron-down'} color={COLORS.secondary} size={23} /> : null
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WallHeaderGeneralInfo

const styles = StyleSheet.create({
  imageNameContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5
  },
  additionalInfoContainer: {
    marginLeft: 10,
    width: '73%'
  },
  nameContainer: {
    width: '90%', 
  },
  statusContainer: {
    width: '88%', 
    marginBottom: 10,
  },
  wallName: {
    fontSize: 18,
    color: COLORS.white,
  },
  statusText: {
    color: COLORS.secondary
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  onlineStatusText: {
    color: COLORS.secondary,
    fontSize: 14
  },
  chevron: {
    width: '100%',
    // height: 17,
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-start',
  }
})