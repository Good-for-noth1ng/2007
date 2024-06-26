import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { getTimeDate } from '../utils/date'
import { COLORS } from '../constants/theme'

const GiftItem = ({ author, gift, id, date, message, privacy, isLightTheme, navigation }) => {
  const navToProfile = () => {
    if (author.name != 'undefined undefined') {
      navigation.push('UserProfile', { userId : author.id})
    }
  }
  return (
    <View style={[
      {
        marginTop: 5, 
        marginBottom: 5, 
        borderRadius: 5,
        padding: 10,
        // justifyContent: 'center',
        alignItems: 'center',
        gap: 10
      }, 
      isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
    ]}>
      <TouchableOpacity style={{flexDirection: 'row', width: '100%', gap: 10}} onPress={navToProfile} activeOpacity={author.name != 'undefined undefined' ? 0.8 : 1}>
        {
          author.name != 'undefined undefined' ?
          <Image source={{ uri: author.photo }} style={{width: 40, height: 40, borderRadius: 5}}/> :
          <View style={{width: 40, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.light_smoke}}>
            <Text style={{fontSize: 16, color: COLORS.secondary}}>?</Text>
          </View>
        }
        <View>
          <Text style={[{fontSize: 16}, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>
            {author.name != 'undefined undefined' ? author.name : 'Anonim'}
          </Text>
          <Text style={[{fontSize: 13}, isLightTheme ? {color: COLORS.secondary} : {color: COLORS.smoke}]}>
            {getTimeDate(date)}
          </Text>
        </View>
      </TouchableOpacity>
      <Image source={{ uri: gift.thumb_256 }} style={{width: 170, height: 170, borderRadius: 10}}/>
      <Text style={[{fontSize: 15}, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{message}</Text>
    </View>
  )
}

export default GiftItem

const styles = StyleSheet.create({})