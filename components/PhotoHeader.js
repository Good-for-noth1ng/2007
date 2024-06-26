import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS } from '../constants/theme'
import { getTimeDate } from '../utils/date'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'

const PhotoHeader = ({ ownerId, date, isLightTheme, navigation, name, imgUrl, isMember, isFriend, lang }) => {
  const onProfilePress = () => {
    if (ownerId > 0) {
      navigation.push('UserProfile', { userId: ownerId })
    } else {
      navigation.push('Group', { groupId: -1 * ownerId })
    }
  }
  return (
    <View style={[styles.container, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
      <TouchableOpacity style={styles.vidPubContainer} onPress={onProfilePress}>
        <Image source={{uri: imgUrl}} style={styles.image}/>
        <View>
          <Text style={[styles.name, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{name}</Text>
          <Text style={styles.date}>{getTimeDate(date, lang)}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity activeOpacity={0.8}>
          {
            isFriend || isMember ? 
            <Feather name='user-check' size={23} color={COLORS.secondary}/> :
            <Feather name='user-plus' size={23} color={COLORS.primary}/> 
          }  
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} >
          <View>
            <Feather name='more-vertical' size={23} color={COLORS.secondary}/>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PhotoHeader

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vidPubContainer: {
    flexDirection: 'row',
    gap: 10,
    maxWidth: '74%',
    alignItems: 'center'
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 5
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: COLORS.secondary
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10
  }
})