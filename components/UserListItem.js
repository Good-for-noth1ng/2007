import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { COLORS } from '../constants/theme'
import { getUserAge } from '../utils/date'
import { setUserID } from '../redux/userWallSlice'

const UserListItem = ({ imgUrl, firstName, lastName, id, navigation, isLightTheme, bdate, city, lang }) => {
  const dispatch = useDispatch()
  const age = bdate && getUserAge(bdate, lang)
  const cityName = city !== undefined && city.title
  const gap = (cityName && age) ? ', ' : ''
  const handleOnPress = () => {
    dispatch(setUserID(id))
    navigation.push('UserProfile', {userId : id})
  }
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={handleOnPress} 
      style={isLightTheme ? styles.listItemContainerLight : styles.listItemContainerDark}
    >
      <Image style={styles.image} source={{uri: imgUrl}}/>
      <View style={styles.nameAndAdditionalInfoContainer}>
        <Text style={isLightTheme ? styles.nameLight : styles.nameDark}>{firstName} {lastName}</Text>
        <Text style={styles.additionalInfo}>{age}{gap}{cityName}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(UserListItem, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.isLightTheme === nextProps.isLightTheme
})

const styles = StyleSheet.create({
  listItemContainerLight: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: COLORS.white,
  },
  listItemContainerDark: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: COLORS.primary_dark,
  },
  image: {
    width: 50, 
    height: 50,
    borderRadius: 5
  },
  nameLight: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black
  },
  nameDark: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.primary_text
  },
  additionalInfo: {
    color: COLORS.secondary
  },
  nameAndAdditionalInfoContainer: {
    marginLeft: 12
  },
})