import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS } from '../constants/theme'

const AlbumListItem = ({id, navigation, ownerId, albumTitle, albumItemsCount, type, imageUrl, isLightTheme, lang}) => {
  let shortagedTitle = albumTitle.slice(0, 40)
  if (shortagedTitle !== albumTitle) {
    shortagedTitle += '...'
  }
  const navigateToAlbum = () => {
    if (type === 'photos') {
      navigation.push('AlbumPhotos', {albumId: id, headerName: albumTitle, ownerId: ownerId})
    } else if (type === 'videos') {
      navigation.push('AlbumVideos', {albumId: id, headerName: albumTitle, ownerId: ownerId})
    }
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={navigateToAlbum} 
      style={[styles.container, isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}
    >
      <Image 
        source={{uri: imageUrl}}
        style={{width: 160, height: 110, borderRadius: 5}}
      />
      <View>
        <Text style={[styles.title, isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{shortagedTitle}</Text>
        <Text style={styles.quantity}>{albumItemsCount} {type === 'photos' ? lang == 'ru' ? 'фото' : 'photos' : lang == 'ru' ? 'видео' : 'videos'}</Text>
      </View>
      <TouchableOpacity>
        <Feather name='more-vertical' color={COLORS.secondary} size={20}/>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default React.memo(AlbumListItem, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 155,
    height: 55,
  },
  quantity: {
    fontSize: 15,
    color: COLORS.secondary
  }
})