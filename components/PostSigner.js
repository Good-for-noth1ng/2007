import { StyleSheet, Text, View, TouchableOpacity, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useSelector, useDispatch } from 'react-redux'
import { COLORS } from '../constants/theme'
import { setUserID } from '../redux/userWallSlice'

const PostSigner = ({ navigation, author }) => {
  const name = `${author.first_name} ${author.last_name}`
  // console.log(author)
  // const dispatch = useDispatch()
  // const groupProfiles = useSelector(state => state.group.profiles)
  // const newsProfiles = useSelector(state => state.news.profiles)
  // for (let i = groupProfiles.length - 1; i >= 0; i--) {
  //   if (groupProfiles[i].id === signerID) {
  //     name = `${groupProfiles[i].first_name} ${groupProfiles[i].last_name}`
  //   }
  // }
  // if (name === '') {
  //   for (let i = newsProfiles.length - 1; i >= 0; i--) {
  //     if (newsProfiles[i].id === signerID) {
  //       name = `${newsProfiles[i].first_name} ${newsProfiles[i].last_name}`
  //     }
  //   } 
  // }
  const onPress = () => {
    // dispatch(setUserID(signerID))
    navigation.push('UserProfile', {userId: author.id})
  }

  return (
    <TouchableOpacity style={styles.signerContainer} activeOpacity={1} onPress={onPress}>
      <FontAwesome5 name='user-alt' color={COLORS.primary} size={14}/>
      <Text style={styles.signerText}>{name}</Text>
    </TouchableOpacity>
  )
}

export default PostSigner

const styles = StyleSheet.create({
  signerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  signerText: {
    color: COLORS.primary,
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold'
  }
})